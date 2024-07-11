<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import checkLogin from "$lib/CheckLogin";
    import ApiController from "$lib/ApiController";
    import { setFlash } from "$lib/Flash";

    import Sidebar from "@components/Sidebar.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Toast from "@components/Toast.svelte";
    import Spinner from "@components/Spinner.svelte";
	import InputField from "@components/InputField.svelte";
	import Button from "@components/Button.svelte";

    let user, detail
    let toastData, toastVisible = false, showSpinner = false, status = false
    let id = $page.params.id
    let title, description, video_file
    let inputfile, filename
    let errors

    const getDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/get/${id}`,
        }).then(response => {
            detail = response.data
            status = true
        })
    }

    const handleSubmit = () => {
        if(!title){
            return alert('Harap isi judul video!')
        }

        if(!video_file){
            return alert('Harap pilih video untuk disimpan!')
        }

        if(!description){
            return alert('Harap isi deskripsi video!')
        }

        showSpinner = true
        let formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('video_file', video_file)

        ApiController.sendRequest({
            method: "POST",
            endpoint: `course/${id}/video/add`,
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: `/teacher/course/${id}?active=Submateri` })
            }
        }).catch(e => {
            console.log(e)
            let response = e.response.data
            console.error(response)

            if(response.error){
                errors = response.error
                showSpinner = false
                toastData = { title: "Gagal", message: "Mohon periksa kembali data Video dan coba lagi!", color: 'toast-danger' }
                toastVisible = true
                return
            }

            if(!response.status){
                toastData = { title: "Gagal", message: response.message, color: 'toast-danger' }
                toastVisible = true
                showSpinner = false
                return
            }
        })
    }

    onMount(() => {
        user = checkLogin("Teacher", true)

        if($page.url.searchParams.has('title')){
            title = decodeURIComponent($page.url.searchParams.get('title'))
            if($page.url.hash){
                title = title + decodeURIComponent($page.url.hash)
            }
        }

        getDetail()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Teacher" bind:isSidebarOpen={isSidebarOpen}/>
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
                            <InputField bind:value={title} id="title" 
                                rules={[{required: true}]} error={ errors ? errors.title ? errors.title : '' : '' }
                                placeholder="Judul Video" label="Judul" labelClass="body-medium-semi-bold"/>
                            
                            <div class="flex-column gap-2">
                                <label for="" class="body-medium-semi-bold">Unggah File Video</label>
                                <div class="flex gap-2">
                                    <Button classList="btn btn-main-outline" onClick={() => {
                                        inputfile.click()
                                        inputfile.onchange = (evt) => {
                                            let file = evt.target.files[0]
                                            video_file = file
                                            filename = file.name
                                        }
                                    }}>Unggah File</Button>
                                    <InputField id="filename" bind:value={filename} 
                                    rules={[{required: true}]} error={ errors ? errors.video_file ? errors.video_file : '' : '' }
                                    placeholder="Nama file" disabled={true} containerClass="grow-item" />
                                </div>
                                <input bind:this={inputfile} type="file" style="display: none;" accept="video/*"/>
                            </div>

                            <InputField bind:value={description} id="description" disabled={false}
                                rules={[{required: true}]} error={ errors ? errors.description ? errors.description : '' : '' }
                                placeholder="Deskripsi Video" label="Deskripsi" labelClass="body-medium-semi-bold" type="tinymce"/>
                        </div>
                    </div>
                </div>
                <div class="flex-row-reverse gap-3" transition:fly={{ delay: 450, duration: 300, x: -100, opacity: 0, easing: quintOut }}>
                    <Button classList="btn btn-main" onClick={handleSubmit}>Simpan Video</Button>
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