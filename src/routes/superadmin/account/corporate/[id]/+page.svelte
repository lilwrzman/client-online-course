<script>
	import { onMount } from "svelte"
    import { goto } from "$app/navigation"

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import ApiController from "$lib/ApiController.js"
    import { extract } from "$lib/Cookie.js"

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Sidebar from "@components/Sidebar.svelte"
    import Toast from "@components/Toast.svelte"
    import Dropzone from "@components/Dropzone.svelte"
    import Spinner from "@components/Spinner.svelte"
    import { PencilFill, TrashFill, Copy } from "svelte-bootstrap-icons"
    import Modal from "@components/Modal.svelte"
    import Tab from "@components/Tab.svelte"
    import { DataHandler } from "@vincjo/datatables/local"
	import checkLogin from "$lib/CheckLogin.js";

    export let data
    let id = data.id

    let user
    
    let corporate
    let name, address, contact, username, email, avatar_file, avatar_url

    let status = false
    let isChangingAvatar = false
    let modalShow = false
    let showSpinner = false
    let errors = null
    let toastData = null
    let toastVisible = false
    let tab = 'Students'
    let myStudents, handlerStudents, students 

    const getDetail = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `account/${id}`,
            authToken: user.token
        }).then(response => {
            corporate = response.data
            name = corporate.name
            address = corporate.address
            contact = corporate.contact
            username = corporate.username
            email = corporate.email
            avatar_url = `http://127.0.0.1:8000/storage/${corporate.avatar}`
            myStudents = corporate.my_students
            handlerStudents = new DataHandler(myStudents)
            students = handlerStudents.getRows()

            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    } 

    const handleSubmit = (evt) => {
        showSpinner = true

        let fd = new FormData()
        fd.append("id", id)
        fd.append("name", name)
        fd.append("address", address)
        fd.append("contact", contact)
        fd.append("username", username)
        fd.append("email", email)

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

    const deleteCorporate = () => {
        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/delete",
            data: {id: id},
            authToken: user.token
        }).then(response => {
            if(response.error){
                showSpinner = false
                return alert('Mohon coba lagi!')
            }

            if(response.status){
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/account/corporate' })
            }else{
                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
                modalShow = false
                showSpinner = false
                toastVisible = true
            }
        })
    }

    const toClipboard = () => {
        navigator.clipboard.writeText(corporate.referral).then(() => {
            toastData = { title: "Berhasil", message: "Link referral berhasil disalin", color: 'toast-success'}
            toastVisible = true
        }).catch(error => {
            toastData = { title: "Gagal", message: error, color: 'toast-danger'}
            toastVisible = true
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin")

        getDetail()
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
                {#if status}
                <div class="flex gap-2">
                    <a href="/superadmin/account/student" class="body-medium-semi-bold tc-neutral-disabled">Manajemen Akun</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/corporate" class="body-medium-semi-bold tc-neutral-disabled">Admin Mitra</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/corporate/{id}#" class="body-medium-semi-bold tc-primary-main">Detail</a>
                </div>
                <div class="row">
                    <div class="col-12 col-md-8">
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Mitra</div>
                                    <div class="body-small-reguler">Lengkapi form dengan data yang valid!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Nama Perusahaan" id="name" 
                                        placeholder="Nama perusahaan" bind:value={name}
                                        rules={[{ required: true }]} error={errors ? errors.name ? errors.name : '' : '' }/>
                                    
                                    <InputField labelClass="body-medium-semi-bold" label="Alamat Perusahaan" id="address" 
                                        placeholder="Alamat perusahaan" bind:value={address}
                                        rules={[{ required: true }]} error={errors ? errors.address ? errors.address : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" label="Kontak" id="contact" 
                                        placeholder="Nomor telepon perusahaan" bind:value={contact}
                                        rules={[{ required: true }]} error={errors ? errors.contact ? errors.contact : '' : '' }/>

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
                                    <Button disabled={name != corporate.name || 
                                        address != corporate.address || 
                                        contact != corporate.contact || 
                                        username != corporate.username || 
                                        email != corporate.email ? false : true} 
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/account/corporate' classList="btn btn-main-outline">Kembali</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 mb-3 flex-column gap-3">
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
                        <div class="card radius-sm">
                            <div class="card-body">
                                <div class="flex justify-content-between align-items-center">
                                    <div class="flex-column gap-1">
                                        <div class="caption-reguler-thin">Kode Referral</div>                                
                                        <div class="body-medium-semi-bold">{corporate.referral}</div>
                                    </div>
                                    <Button classList="btn p-0" onClick={toClipboard}>
                                        <div class="flex align-items-center justify-content-center">
                                            <Copy/>
                                        </div>
                                    </Button>   
                                </div>
                            </div>
                        </div>
                        <Button classList="btn btn-danger" onClick={() => {
                            modalShow = true
                        }}>
                            <div class="flex gap-2 justify-content-center align-items-center">
                                <TrashFill/>
                                Hapus Akun
                            </div>
                        </Button>
                    </div>
                </div>

                <div class="flex-column gap-3" transition:fly={{ delay: 650, duration: 300, y: -100, opacity: 0, easing: quintOut }}>
                    <Tab bind:value={tab} type="variabel" menus={[
                        {'title': 'Karyawan Mitra', 'value': 'Students'},
                        {'title': 'Materi Bundel', 'value': 'Courses'}
                    ]}/>

                    {#if tab == 'Students'}
                    <div class="card radius-sm gap-3">
                        <div class="flex-column">
                            <div class="body-medium-semi-bold">Karyawan Mitra</div>
                            <div class="body-small-reguler">Berikut adalah karyawan-karyawan dari akun mitra {corporate.name}!</div>
                        </div>
                        <div class="table-scroll radius-sm">
                            <table class="table number">
                                <thead>
                                    <tr>
                                        <th class="text-center">No</th>
                                        <th>Nama</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody class="table-border-bottom">
                                    {#if $students.length > 0}
                                    {#each $students as row, index}
                                    <tr>
                                        <td class="text-center">{index + 1}</td>
                                        <td>{row.fullname}</td>
                                        <td>{row.username}</td>
                                        <td>{row.email}</td>
                                    </tr>
                                    {/each}
                                    {:else}
                                    <tr>
                                        <td colspan="9">Tidak ada data...</td>
                                    </tr>
                                    {/if}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {:else if tab == 'Courses'}
                    <div class="card radius-sm gap-3">
                        <div class="flex-column">
                            <div class="body-medium-semi-bold">Materi Bundel</div>
                            <div class="body-small-reguler">Berikut adalah materi bundel untuk akun mitra {corporate.name}!</div>
                        </div>
                    </div>
                    {/if}
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
                <div class="h4">Hapus Mitra</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus mitra {corporate.name} ? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteCorporate}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => {
                    modalShow = false
                }}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>Manajemen Akun | Detail</title>
    
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