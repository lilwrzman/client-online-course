<script>
	import { onMount } from "svelte"
    import { goto } from "$app/navigation"

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import ApiController from "$lib/ApiController.js"
    import { extract } from "$lib/Cookie.js"
    import { setFlash } from "$lib/Flash"

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Sidebar from "@components/Sidebar.svelte"
    import Toast from "@components/Toast.svelte"
    import Dropzone from "@components/Dropzone.svelte"
    import Spinner from "@components/Spinner.svelte"
	import checkLogin from "$lib/CheckLogin";

    let user
    let errors = null

    let toastData = null
    let toastVisible = false

    let showSpinner = false
    let title, content, thumbnail_file

    const handleSubmit = () => {
        let formData = new FormData()

        formData.append('title', title)
        formData.append('content', content)

        if(thumbnail_file){
            formData.append('thumbnail_file', thumbnail_file)
        }

        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "article/add",
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({title: "Berhasil", message: response.message, type: 'success', redirect: "/superadmin/article"})
                return
            }
        }).catch(e => {
            let error = e.response.data
            showSpinner = false

            if(error.errors){
                errors = error.errors
                return
            }

            if(error.error){
                toastData = {
                    title: "Gagal",
                    message: error.error,
                    color: "toast-danger"
                }

                toastVisible = true
            }
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin", true)
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Manajemen Artikel" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Artikel" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}
                <div class="flex gap-2">
                    <a href="/superadmin/article" class="body-medium-semi-bold tc-neutral-disabled">
                        Manajemen Artikel
                    </a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/article/add#" class="body-medium-semi-bold tc-primary-main">
                        Tambah Artikel
                    </a>
                </div>
                <div class="row">
                    <div class="col-12 col-md-8">
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Judul Artikel" id="title" 
                                        placeholder="Masukkan judul artikel" bind:value={title}
                                        rules={[{ required: true }]} error={errors ? errors.title ? errors.title : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" bind:value={content}
                                        type="tinymce"
                                        placeholder="Masukkan konten artikel"
                                        label="Deskripsi" id="content" rules={[{ required: true }]} 
                                        error={errors ? errors.content ? errors.content : '' : '' }/>
                                </div>

                                <div class="flex justify-content-end gap-2">
                                    <Button type='link' href='/superadmin/event' classList="btn btn-main-outline">Batal</Button>
                                    <Button disabled={title && content ? false : true} 
                                        onClick={handleSubmit}
                                        classList="btn btn-main">Simpan</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4" transition:fly={{ delay: 450, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
                        <div class="card radius-sm" style="aspect-ratio: 4/3;">
                            <div class="card-body gap-2">
                                <div class="body-large-semi-bold">Thumbnail Artikel</div>
                                <Dropzone bind:file={thumbnail_file} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Manajemen Artikel</title>
</svelte:head>