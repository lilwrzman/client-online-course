<script>
    import {page} from "$app/stores"
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import { onMount } from "svelte"

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import ApiController from "$lib/ApiController.js"
    import { setFlash } from "$lib/Flash"

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Sidebar from "@components/Sidebar.svelte"
    import Toast from "@components/Toast.svelte"
    import Dropzone from "@components/Dropzone.svelte"
    import Spinner from "@components/Spinner.svelte"
    import Modal from "@components/Modal.svelte"

    import { PencilFill, TrashFill } from "svelte-bootstrap-icons"
	import checkLogin from "$lib/CheckLogin.js";

    let id = $page.params.id

    let user
    let errors = null

    let toastData = null
    let toastVisible = false

    let showSpinner = false

    let fullname, username, email, facebook_name, facebook_url, instagram_name, instagram_url, avatar_file, avatar_url

    let isChangingThumbnail = false
    let modalShow = false

    let detail
    let title, content, place, date, start, end, link, thumbnail_file, thumbnail_url

    const handleSubmit = (evt) => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "article/update",
            data: { 
                id: detail.id, 
                title, 
                content
            },
            authToken: user.token
        }).then(response => {
            if(response.status){
                getDetail(() => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success'}
                    toastVisible = true
                    showSpinner = false
                })
            }
        }).catch(e => {
            let error = e.response.data
            showSpinner = false

            if(error.errors){
                errors = error.errors
                return
            }

            if(error.error){
                toastData = { title: "Gagal", message: error.error, color: 'toast-danger' }
                toastVisible = true
            }
        })
    }

    const changeThumbnail = () => {
        if(!thumbnail_file){
            return alert('Mohon pilih foto thumbnail!')
        }

        showSpinner = true

        let fd = new FormData()
        fd.append("id", detail.id)
        fd.append("thumbnail_file", thumbnail_file)

        ApiController.sendRequest({
            method: "POST",
            endpoint: 'article/change-thumbnail',
            data: fd,
            authToken: user.token
        }).then(response => {
            if(response.status){
                getDetail(() => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success'}
                    toastVisible = true
                    showSpinner = false
                })
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    const getDetail = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `article/get/${id}`
        }).then(response => {
            if(response.status){
                detail = response.data
                title = detail.title
                content = detail.content
                thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${detail.thumbnail}`
            }


            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    } 

    const deleteArticle = () => {
        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: "article/delete",
            data: {id: detail.id},
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({title: "Berhasil", message: response.message, type: 'success', redirect: "/superadmin/article"})
                return
            }
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin", true)

        getDetail()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={false} active="Manajemen Artikel" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Artikel"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex gap-2">
                    <a href="/superadmin/article" class="body-medium-semi-bold tc-neutral-disabled">Manajemen Artikel</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/article/{id}#" class="body-medium-semi-bold tc-primary-main">Detail</a>
                </div>

                {#if detail}
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

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={
                                        title != detail.title ||
                                        content != detail.content ? false : true} 
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/article' classList="btn btn-main-outline">Kembali</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4" transition:fly={{ delay: 450, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
                        <div class="flex-column gap-3">
                            <div class="card radius-sm" style="aspect-ratio: 4/3;">
                                <div class="card-body gap-2">
                                    <div class="body-large-semi-bold">Thumbnail Artikel</div>
                                    {#if isChangingThumbnail}
                                    <Dropzone bind:file={thumbnail_file}/>
                                    {:else}
                                    <Dropzone bind:file={thumbnail_file} bind:url={thumbnail_url}/>
                                    {/if}
    
                                    {#if !isChangingThumbnail}
                                    <Button classList="btn btn-main-outline" onClick={() => isChangingThumbnail = true}>
                                        <div class="flex gap-2 align-items-center justify-content-center">
                                            <PencilFill width=14 height=14 />
                                            Ubah
                                        </div>
                                    </Button>
                                    {:else}
                                    <div class="flex gap-2">
                                        <Button classList="btn btn-main-outline w-100" onClick={() => {
                                            thumbnail_file = null
                                            isChangingThumbnail = false
                                        }}>Batal</Button>
                                        <Button classList="btn btn-main w-100" onClick={changeThumbnail}>Simpan</Button>
                                    </div>
                                    {/if}
                                </div>
                            </div>
                            <Button classList="btn btn-danger" onClick={() => modalShow = true}>
                                <div class="flex gap-2 justify-content-center align-items-center">
                                    <TrashFill/>
                                    Hapus Artikel
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </main>
    </div>
</div>

{#if modalShow}
    <Modal bind:modalShow>
        <div class="card-body gap-5">
            <div class="flex-column">
                <div class="h4">Hapus Artikel</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus artikel ini ? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteArticle}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => {
                    modalShow = false
                }}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>Manajemen Artikel</title>
</svelte:head>