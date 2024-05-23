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

    import { PencilFill } from "svelte-bootstrap-icons"

    export let data
    let id = data.id

    let user
    let errors = null

    let toastData = null
    let toastVisible = false

    let showSpinner = false

    let teacher 
    let fullname, username, email, avatar_file, avatar_url

    let isChangingAvatar = false
    let status = false

    const handleSubmit = (evt) => {
        showSpinner = true

        let fd = new FormData()
        fd.append("id", id)
        fd.append("fullname", fullname)
        fd.append("username", username)
        fd.append("email", email)

        if(avatar_file){
            fd.append("avatar_file", avatar_file)
        }

        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/update",
            data: fd,
            authToken: user.token
        }).then(response => {
            if(response.error){
                showSpinner = false
                errors = response.error
                return
            }

            if(response.status){
                getDetail(() => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success'}
                    toastVisible = true
                    showSpinner = false
                })
            }else if(!response.status){
                toastData = { title: "Gagal", message: response.message, color: 'toast-danger'}
                toastVisible = true
                showSpinner = false
            }
        })
    }

    const changeAvatar = () => {
        if(!avatar_file){
            return alert('Mohon pilih foto profil!')
        }

        showSpinner = true

        let fd = new FormData()
        fd.append("id", id)
        fd.append("avatar_file", avatar_file)

        ApiController.sendRequest({
            method: "POST",
            endpoint: 'account/update/avatar',
            data: fd,
            authToken: user.token
        }).then(response => {
            if(response.error){
                showSpinner = false
                errors = response.error
                return
            }

            if(response.status){
                getDetail(() => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success'}
                    toastVisible = true
                    showSpinner = false
                })
            }else if(!response.status){
                toastData = { title: "Gagal", message: response.message, color: 'toast-danger'}
                toastVisible = true
                showSpinner = false
            }
        })
    }

    const getDetail = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `account/${id}`,
            authToken: user.token
        }).then(response => {
            teacher = response.data
            fullname = teacher.fullname
            username = teacher.username
            email = teacher.email
            avatar_url = `http://127.0.0.1:8000/storage/${teacher.avatar}`

            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    } 

    onMount(() => {
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
        }

        getDetail()
    })
</script>

<div class="flex">
    <Sidebar isOpen={false} active="Manajemen Akun" role="{user ? user.role : ''}" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Akun"/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}
                <div class="flex gap-2">
                    <a href="/superadmin/account/teacher" class="body-medium-semi-bold tc-primary-main">
                        Manajemen Akun
                    </a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/teacher/add" class="body-medium-semi-bold tc-neutral-disabled">
                        Tambah Pemateri
                    </a>
                </div>
                {#if status}
                <div class="row">
                    <div class="col-12 col-md-8">
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Pemateri</div>
                                    <div class="body-small-reguler">Lengkapi form dengan data yang valid!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Nama Lengkap" id="fullname" 
                                        placeholder="Nama lengkap pemateri" bind:value={fullname}
                                        rules={[{ required: true }]} error={errors ? errors.fullname ? errors.fullname : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" bind:value={username}
                                        placeholder="Username untuk akun pemateri"
                                        label="Username" id="username" rules={[{ required: true }]} 
                                        error={errors ? errors.username ? errors.username : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" bind:value={email}
                                        placeholder="Email untuk akun pemateri"
                                        label="Email" id="email" rules={[{ required: true, type: 'email' }]} 
                                        error={errors ? errors.email ? errors.email : '' : '' }/>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={fullname != teacher.fullname || 
                                        username != teacher.username || 
                                        email != teacher.email ? false : true} 
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/account/teacher' classList="btn btn-main-outline">Kembali</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 mb-3">
                        <div class="card radius-sm" style="aspect-ratio: 1/1;">
                            <div class="card-body gap-2">
                                <div class="body-large-semi-bold">Foto Profil</div>
                                {#if isChangingAvatar}
                                <Dropzone bind:file={avatar_file} minHeight=1/>
                                {:else}
                                <Dropzone bind:file={avatar_file} bind:url={avatar_url} minHeight=1/>
                                {/if}

                                {#if !isChangingAvatar}
                                <Button classList="btn btn-main-outline" onClick={() => isChangingAvatar = true}>
                                    <div class="flex gap-2 align-items-center justify-content-center">
                                        <PencilFill width=14 height=14 />
                                        Ubah
                                    </div>
                                </Button>
                                {:else}
                                <div class="flex gap-2">
                                    <Button classList="btn btn-main-outline w-100" onClick={() => {
                                        avatar_file = null
                                        isChangingAvatar = false
                                    }}>Batal</Button>
                                    <Button classList="btn btn-main w-100" onClick={changeAvatar}>Simpan</Button>
                                </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Manajemen Akun | Tambah Pemateri</title>
    
    <style>
        .course-data {
            cursor: pointer;
        }
    
        .row-menu-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            cursor: pointer;
            border-radius: 4px;
            transition: all .25s ease;
        }
    
        .row-menu-container:hover{
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            background-color: var(--hover);
        }
    
        .row-menu-active::before{
            border-color: var(--primary-main) !important;
        }
    
        .row-menu::before{
            content: "";
            height: 90%;
            border-radius: 3px;
            border: 2px solid transparent;
        }
    </style>
</svelte:head>