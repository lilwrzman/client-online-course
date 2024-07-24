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
    let title, place, date, start, end, link, thumbnail_file, thumbnail_url

    const handleSubmit = (evt) => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "event/update",
            data: { 
                id: detail.id, 
                title, 
                place, 
                date, 
                start: start.substring(0, 5), 
                end: end.substring(0, 5), 
                link 
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
            contentType: 'multipart/form-data',
            method: "POST",
            endpoint: 'event/change-thumbnail',
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
            endpoint: `event/get/${id}`
        }).then(response => {
            if(response.status){
                detail = response.data
                title = detail.title
                place = detail.place
                date = detail.date
                start = detail.start
                end = detail.end
                link = detail.link
                thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${detail.thumbnail}`
            }


            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    } 

    const deleteEvent = () => {
        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: "event/delete",
            data: {id: detail.id},
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({title: "Berhasil", message: response.message, type: 'success', redirect: "/superadmin/event"})
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
    <Sidebar isOpen={false} active="Manajemen Acara" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Acara"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex gap-2">
                    <a href="/superadmin/event" class="body-medium-semi-bold tc-neutral-disabled">Manajemen Acara</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/event/{id}#" class="body-medium-semi-bold tc-primary-main">Detail</a>
                </div>

                {#if detail}
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Nama Acara" id="title" 
                                        placeholder="Masukkan nama acara" bind:value={title}
                                        rules={[{ required: true }]} error={errors ? errors.title ? errors.title : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" bind:value={place}
                                        placeholder="Masukkan tempat acara"
                                        label="Tempat Acara" id="place" rules={[{ required: true }]} 
                                        error={errors ? errors.place ? errors.place : '' : '' }/>

                                    <div class="flex-column gap-2">
                                        <label for="date" class="body-medium-semi-bold">Tanggal Acara</label>
                                        <input type="date" id="date" bind:value={date}>
                                    </div>

                                    <div class="flex gap-2">
                                        <div class="flex-column gap-2 w-100">
                                            <label for="start" class="body-medium-semi-bold">Waktu Mulai</label>
                                            <input type="time" id="start" bind:value={start}>
                                            {#if errors}
                                            {#if errors.start}
                                            <p class="tc-danger-main">{errors.start}</p>
                                            {/if}
                                            {/if}
                                        </div>
                                        <div class="flex-column gap-2 w-100">
                                            <label for="end" class="body-medium-semi-bold">Waktu Selesai</label>
                                            <input type="time" id="end" bind:value={end}>
                                            {#if errors}
                                            {#if errors.end}
                                            <p class="tc-danger-main">{errors.end}</p>
                                            {/if}
                                            {/if}
                                        </div>
                                    </div>

                                    <InputField labelClass="body-medium-semi-bold" bind:value={link}
                                        placeholder="Masukkan link pendaftaran jika ada" containerClass="w-100"
                                        label="Link Pendaftaran <span class='body-small-reguler'>*Opsional</span>" id="link" rules={[{ required: false }]}
                                        error={errors ? errors.link ? errors.link : '' : ''}/>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={
                                        title != detail.title ||
                                        place != detail.place ||
                                        date != detail.date || 
                                        start != detail.start ||
                                        end != detail.end ||
                                        link != detail.link ? false : true} 
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/event' classList="btn btn-main-outline">Kembali</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6" transition:fly={{ delay: 450, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
                        <div class="flex-column gap-3">
                            <div class="card radius-sm" style="aspect-ratio: 16/9;">
                                <div class="card-body gap-2">
                                    <div class="body-large-semi-bold">Baner Acara</div>
                                    {#if isChangingThumbnail}
                                    <Dropzone bind:file={thumbnail_file} minHeight=0.5625/>
                                    {:else}
                                    <Dropzone bind:file={thumbnail_file} bind:url={thumbnail_url} minHeight=0.5625/>
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
                                    Hapus Acara
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
                <div class="h4">Hapus Acara</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus acara ini ? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteEvent}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => {
                    modalShow = false
                }}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>Manajemen Acara</title>
</svelte:head>

<style>
    input {
        border-radius: 8px;
        padding: 14px;
        gap: 8px;
        background-color: #F5F6F7;
        font-family: "Poppins", sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0.20000000298023224px;
        color: var(--neutral-primary);
        border: transparent;
    }

    input::placeholder {
        color: var(--neutral-disabled);
        padding-left: 0.25rem;
    }

    input:focus {
        background-color: var(--neutral-white);
        color: #185951;
        caret-color: #185951;
        outline: 1px solid #718284;
    }

    input:focus::placeholder {
        color: #185951;
        caret-color: #185951;
    }

    input:invalid {
        background-color: var(--neutral-white);
        outline: 1px solid var(--danger-main);
    }
</style>