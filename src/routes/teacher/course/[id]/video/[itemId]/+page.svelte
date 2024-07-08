<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import checkLogin from "$lib/CheckLogin";
    import ApiController from "$lib/ApiController";

    import Sidebar from "@components/Sidebar.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Toast from "@components/Toast.svelte";
    import Spinner from "@components/Spinner.svelte";
	import InputField from "@components/InputField.svelte";
	import Button from "@components/Button.svelte";

    let user, detail
    let toastData, toastVisible = false, showSpinner = false, status = false
    let id = $page.params.id
    let itemId = $page.params.itemId

    const getDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/get/${id}`,
        }).then(response => {
            detail = response.data
            status = true
        })
    }

    onMount(() => {
        user = checkLogin("Teacher", true)
        getDetail()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Bank Kursus" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                {#if status}
                <div class="flex gap-2">
                    <a href="/teacher/course" class="body-medium-semi-bold tc-neutral-disabled">Materi</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/teacher/course/{id}" class="body-medium-semi-bold tc-neutral-disabled">{detail.title}</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/teacher/course/{id}/video#" class="body-medium-semi-bold tc-primary-main">Video</a>
                </div>

                <div class="card radius-sm p-4" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                    <div class="card-body gap-4">
                        <div class="flex-column gap-3">
                            <InputField id="title" placeholder="Judul Video" label="Judul" labelClass="body-medium-semi-bold"/>
                            <InputField id="video" placeholder="Nama File" label="Unggal File Video" labelClass="body-medium-semi-bold"/>
                            <InputField id="description" placeholder="Deskripsi Video" label="Deskripsi" labelClass="body-medium-semi-bold" type="tinymce"/>
                        </div>
                    </div>
                </div>
                <div class="flex-row-reverse gap-3" transition:fly={{ delay: 450, duration: 300, x: -100, opacity: 0, easing: quintOut }}>
                    <Button classList="btn btn-main">Simpan Video</Button>
                    <Button type="link" href="/teacher/course/{id}?active=Submateri" classList="btn btn-main-outline">Kembali</Button>
                </div>
                {/if}
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>{ detail ? "Materi " + detail.title : 'Loading' }</title>
</svelte:head>