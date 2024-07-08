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
    let fullname, username, email, avatar_file, isMitra = false
    let corporates, option = [{value: "", text: "Pilih Mitra"}], corporate_id = option[0].value
    
    let errors = null
    let toastData = null
    let toastVisible = false
    let showSpinner = false
    let status = false

    const handleSubmit = (evt) => {
        let fd = new FormData()
        fd.append("role", "Student")
        fd.append("fullname", fullname)
        fd.append("username", username)
        fd.append("email", email)

        if(isMitra){
            if(corporate_id){
                fd.append("corporate_id", corporate_id)
            }else{
                return alert("Pilih perusahaan mitra!")
            }
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
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/account/student' })
                return
            }else if(!response.status){
                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
                toastVisible = true
            }

            showSpinner = false
        })
    }

    const getCorporates = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "account/get?role=Corporate Admin",
            authToken: user.token
        }).then(response => {
            corporates = response.data
            corporates.map(elm => {
                option.push({ value: elm.id, text: elm.name })
            })

            status = true
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin")

        getCorporates()
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
                    <a href="/superadmin/account/student" class="body-medium-semi-bold tc-neutral-disabled">
                        Manajemen Akun
                    </a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/student/add#" class="body-medium-semi-bold tc-primary-main">
                        Tambah Karyawan
                    </a>
                </div>
                {#if status}
                <div class="row">
                    <div class="col-12 col-md-8">
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Karyawan</div>
                                    <div class="body-small-reguler">Lengkapi form dengan data yang valid!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Nama Lengkap" id="fullname" 
                                        placeholder="Nama lengkap karyawan" bind:value={fullname}
                                        rules={[{ required: true }]} error={errors ? errors.fullname ? errors.fullname : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" bind:value={username}
                                        placeholder="Username untuk akun karyawan"
                                        label="Username" id="username" rules={[{ required: true }]} 
                                        error={errors ? errors.username ? errors.username : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" bind:value={email}
                                        placeholder="Email untuk akun karyawan"
                                        label="Email" id="email" rules={[{ required: true, type: 'email' }]} 
                                        error={errors ? errors.email ? errors.email : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" label="Jenis Karyawan"
                                        type="select-option" id="select-jenis" 
                                        containerClass="grow-item grow-auto-md"   
                                        inputClass="pr-8" bind:value={isMitra} option={[
                                            { value: false, text: 'Umum' },
                                            { value: true, text: 'Mitra' },
                                        ]}/>

                                    {#if isMitra}
                                    <InputField labelClass="body-medium-semi-bold" label="Mitra"
                                        type="select-option" id="select-mitra" 
                                        containerClass="grow-item grow-auto-md"   
                                        inputClass="pr-8" bind:value={corporate_id} option={option}/>
                                    {/if}
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={fullname && username && email ? false : true} 
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/account/student' classList="btn btn-main-outline">Batal</Button>
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
                {/if}
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Manajemen Akun | Tambah Karyawan</title>
    
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