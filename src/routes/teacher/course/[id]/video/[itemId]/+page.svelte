<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
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
    import VideoPlayer from "@components/VideoPlayer.svelte"

    let user, detail
    let toastData, toastVisible = false, showSpinner = false, status = false
    let id = $page.params.id
    let itemId = $page.params.itemId
    let errors
    let title, description, video_file
    let inputfile, filename
    let isChange = false

    const handleSubmit = () => {
        if(!title){
            return alert("Isi judul video!")
        }

        if(!description){
            return alert("Isi deskripsi video!")
        }

        let fd = new FormData()
        fd.append("title", title)
        fd.append("description", description)

        if(video_file){
            fd.append("video_file", video_file)
        }

        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: `video/${itemId}/update`,
            data: fd,
            authToken: user.token,
            contentType: 'multipart/form-data'
        }).then(response => {
            if(response.status){
                getDetail()
                toastData = { 
                    title: 'Berhasil', 
                    message: response.message, 
                    color: 'toast-success'
                }

                toastVisible = true
                showSpinner = false
            }
        }).catch(e => {
            console.error(e)

            toastData = { 
                title: 'Gagal', 
                message: "Gagal mengubah data, cek console!", 
                color: 'toast-danger'
            }

            toastVisible = true
            showSpinner = false
        })
    }

    const getDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `items/get/${itemId}?type=video`,
            authToken: user.token
        }).then(response => {
            detail = response.data
            title = detail.title
            description = detail.description

            console.log(detail)

            status = true
        }).catch(e => {
            let error = e.response.data

            if(error.error){
                if(error.error == 'Unauthenticated.'){
                    checkLogin()
                    return
                }

                errors = error.error
            }
        })
    }

    onMount(() => {
        user = checkLogin("Teacher")
        getDetail()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Teacher" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Bank Kursus"  bind:isSidebarOpen={isSidebarOpen}/>
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
                    <a href="/teacher/course/{id}?active=Submateri" class="body-medium-semi-bold tc-neutral-disabled">Submateri</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/teacher/course/{id}/video/{itemId}#" class="body-medium-semi-bold tc-primary-main">Video</a>
                </div>

                <div class="card radius-sm p-4" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                    <div class="card-body gap-4">
                        <div class="flex-column gap-3">
                            <div class="flex-column gap-2">
                                <div class="flex align-items-center justify-content-between">
                                    <p class="body-medium-semi-bold">Video</p>
                                    {#if !isChange}
                                    <Button classList="btn btn-main-outline" onClick={() => isChange = true}>Ubah Video</Button>
                                    {:else}
                                    <Button classList="btn btn-main-outline" onClick={() => isChange = false}>Batal</Button>
                                    {/if}
                                </div>
                                {#if !isChange}
                                <VideoPlayer finish={true} token={user.token} 
                                    url="{PUBLIC_SERVER_PATH}/api/video/playlist/{id}/{detail.info.playlist.split('.')[0]}/{detail.info.playlist}" />
                                {:else}
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
                                {/if}
                            </div>
                            <InputField id="title" placeholder="Judul Video" label="Judul" bind:value={title}
                                labelClass="body-medium-semi-bold" rules={[{required: true}]}
                                error={errors ? errors.title ? errors.title : '' : ''}/>
                            <InputField id="description" placeholder="Deskripsi Video" bind:value={description}
                                label="Deskripsi" labelClass="body-medium-semi-bold" type="tinymce"/>
                        </div>
                    </div>
                </div>
                <div class="flex-row-reverse gap-3" transition:fly={{ delay: 450, duration: 300, x: -100, opacity: 0, easing: quintOut }}>
                    {#if detail.title != title || detail.description != description || video_file}
                    <Button classList="btn btn-main" onClick={handleSubmit}>Simpan Perubahan</Button>
                    <Button classList="btn btn-main-outline" onClick={() => {
                        title = detail.title
                        description = detail.description
                        isChange = false
                        video_file = null
                    }}>Batal</Button>
                    {/if}
                </div>
                {/if}
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>{ detail ? "Materi " + detail.title : 'Loading' }</title>
</svelte:head>