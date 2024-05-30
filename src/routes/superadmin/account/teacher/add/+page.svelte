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

    let fullname, username, email, facebook_name, facebook_url, instagram_name, instagram_url, avatar_file

    const handleSubmit = (evt) => {
        let fd = new FormData()
        fd.append("role", "Teacher")
        fd.append("fullname", fullname)
        fd.append("username", username)
        fd.append("email", email)
        
        if(facebook_name){
            if(!facebook_url){
                errors.facebook_url = "Harap isi data ini!"
                return 
            }

            fd.append("facebook_name", facebook_name)
            fd.append("facebook_url", facebook_url)
        }

        if(instagram_name){
            if(!instagram_url){
                errors.instagram_url = "Harap isi data ini!"
                return 
            }

            fd.append("instagram_name", instagram_name)
            fd.append("instagram_url", instagram_url)
        }

        if(avatar_file){
            fd.append("avatar_file", avatar_file)
        }

        showSpinner = true  
        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/add",
            data: fd,
            authToken: user.token
        }).then(response => {
            if(response.error){
                showSpinner = false
                errors = response.error
                return
            }

            if(response.status){
                setFlash({ message: response.message, type: 'success', redirect: '/superadmin/account/teacher' })
            }else if(!response.status){
                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
                toastVisible = true
                showSpinner = false
            }
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin")
    })
</script>

<div class="flex">
    <Sidebar active="Manajemen Akun" role="Superadmin" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Akun" bind:user={user}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}
                <div class="flex gap-2">
                    <a href="/superadmin/account/teacher" class="body-medium-semi-bold tc-neutral-disabled">
                        Manajemen Akun
                    </a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/teacher/add" class="body-medium-semi-bold tc-primary-main">
                        Tambah Pemateri
                    </a>
                </div>
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

                                    <div class="flex-column gap-2">
                                        <div class="body-medium-semi-bold">Media Sosial</div>
                                        <div class="card neutral-border">
                                            <div class="card-body gap-3">
                                                <div class="flex gap-2">
                                                    <InputField labelClass="body-small-semi-bold" bind:value={facebook_name}
                                                        placeholder="Nama akun Facebook pemateri" containerClass="w-100"
                                                        label="Akun Facebook" id="facebook_name" />

                                                    <InputField labelClass="body-small-semi-bold" bind:value={facebook_url}
                                                        placeholder="Link akun Facebook pemateri" containerClass="w-100" 
                                                        label="Link Facebook" id="facebook_url" rules={[{ required: facebook_name ? true : false }]}
                                                        error={errors ? errors.facebook_url ? errors.facebook_url : '' : facebook_name && !facebook_url ? 'Harap isi data ini!' : '' }/>
                                                </div>
                                                <div class="flex gap-2">
                                                    <InputField labelClass="body-small-semi-bold" bind:value={instagram_name}
                                                        placeholder="Nama akun Instagram pemateri" containerClass="w-100"
                                                        label="Akun Instagram" id="instagram_name" />

                                                    <InputField labelClass="body-small-semi-bold" bind:value={instagram_url}
                                                        placeholder="Link akun Instagram pemateri" containerClass="w-100"
                                                        label="Link Instagram" id="instagram_url" rules={[{ required: instagram_name ? true : false }]}
                                                        error={errors ? errors.instagram_url ? errors.instagram_url : '' : instagram_name && !instagram_url ? 'Harap isi data ini!' : ''}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={fullname && username && email && 
                                        ( facebook_name ? facebook_url : true ) && 
                                        ( instagram_name ? instagram_url : true )
                                        ? false : true} 
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/account/teacher' classList="btn btn-main-outline">Batal</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 mb-3" transition:fly={{ delay: 450, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
                        <div class="card radius-sm" style="aspect-ratio: 1/1;">
                            <div class="card-body gap-2">
                                <div class="body-large-semi-bold">Foto Profil</div>
                                <Dropzone bind:file={avatar_file} minHeight=1/>
                            </div>
                        </div>
                    </div>
                </div>
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