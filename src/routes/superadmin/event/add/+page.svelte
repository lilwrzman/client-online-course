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
    let title, place, date, start, end, link, thumbnail_file

    const handleSubmit = () => {
        let formData = new FormData()

        formData.append('title', title)
        formData.append('place', place)
        formData.append('date', date)
        formData.append('start', start)
        formData.append('end', end)
        
        if(link){
            formData.append('link', link)
        }

        if(thumbnail_file){
            formData.append('thumbnail_file', thumbnail_file)
        }

        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "event/add",
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({title: "Berhasil", message: response.message, type: 'success', redirect: "/superadmin/event"})
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
        user = checkLogin("Superadmin")
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Manajemen Akun" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Akun" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}
                <div class="flex gap-2">
                    <a href="/superadmin/event" class="body-medium-semi-bold tc-neutral-disabled">
                        Manajemen Acara
                    </a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/event/add#" class="body-medium-semi-bold tc-primary-main">
                        Tambah Acara
                    </a>
                </div>
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

                                <div class="flex justify-content-end gap-2">
                                    <Button type='link' href='/superadmin/event' classList="btn btn-main-outline">Batal</Button>
                                    <Button disabled={title && place && date && start && end ? false : true} 
                                        onClick={handleSubmit}
                                        classList="btn btn-main">Simpan</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6" transition:fly={{ delay: 450, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
                        <div class="card radius-sm" style="aspect-ratio: 16/9;">
                            <div class="card-body gap-2">
                                <div class="body-large-semi-bold">Baner Acara</div>
                                <Dropzone bind:file={thumbnail_file} minHeight=0.5625/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

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