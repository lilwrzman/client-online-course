<script>
	import { onMount } from "svelte"
    import { goto } from "$app/navigation"

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import ApiController from "$lib/ApiController.js"
    import { extract } from "$lib/Cookie.js"
    import { getDay } from "$lib/Date"
    import { setFlash } from "$lib/Flash"

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Sidebar from "@components/Sidebar.svelte"
    import Toast from "@components/Toast.svelte"
    import Dropzone from "@components/Dropzone.svelte"
    import Spinner from "@components/Spinner.svelte"
    import { PencilFill, TrashFill } from "svelte-bootstrap-icons"
    import Tab from "@components/Tab.svelte"
    import { DataHandler } from "@vincjo/datatables/local"
    import Modal from "@components/Modal.svelte"
	import checkLogin from "$lib/CheckLogin.js"
    import { LockFill, UnlockFill } from "svelte-bootstrap-icons"

    export let data
    let id = data.id

    let user
    let errors = null

    let toastData = null
    let toastVisible = false

    let showSpinner = false, modalShow = false

    let detail, isMitra = false
    let myCourses, handlerCourses, courses
    let myTransaction, handleTransactions, transactions
    let fullname, username, email, avatar_file, avatar_url
    let status = false
    let isChangingAvatar = false
    let corporates, option = [], corporate_id

    let tab = 'Course Access'

    const getDetail = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `account/${id}`,
            authToken: user.token
        }).then(response => {
            console.log(response)
            detail = response.data
            fullname = detail.fullname
            username = detail.username
            email = detail.email
            avatar_url = `http://127.0.0.1:8000/storage/${detail.avatar}`

            myCourses = detail.my_courses
            handlerCourses = new DataHandler(myCourses)
            courses = handlerCourses.getRows()

            myTransaction = []
            handleTransactions = new DataHandler(myTransaction)
            transactions = handleTransactions.getRows()

            corporates = detail.corporates.map(elm => {
                return {value: elm.id, text: elm.info.name}
            })

            option = []
            option.push({value: null, text: "Pilih Mitra"})
            option.push(...corporates)
            isMitra = detail.corporate_id ? true : false
            corporate_id = isMitra ?  detail.corporate_id : option[0].value

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
        fd.append("fullname", fullname)
        fd.append("username", username)
        fd.append("email", email)

        if(isMitra){
            if(corporate_id){
                fd.append("corporate_id", corporate_id)
            }else{
                showSpinner = false
                return alert("Pilih perusahaan mitra!")
            }
        }else{
            fd.append("corporate_id", null)
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
                    isChangingAvatar = false
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

    const changeStatus = () => {

    }

    // const deleteStudent = () => {
    //     showSpinner = true

    //     ApiController.sendRequest({
    //         method: "POST",
    //         endpoint: "account/delete",
    //         data: {id: id},
    //         authToken: user.token
    //     }).then(response => {
    //         if(response.error){
    //             showSpinner = false
    //             return alert('Mohon coba lagi!')
    //         }

    //         if(response.status){
    //             setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/account/student' })
    //         }else{
    //             toastData = {
    //                 title: "Gagal",
    //                 message: response.message,
    //                 color: 'toast-danger'
    //             }
    //             modalShow = false
    //             showSpinner = false
    //             toastVisible = true
    //         }
    //     })
    // }

    onMount(() => {
        user = checkLogin("Superadmin")

        getDetail()
    })

    $:{
        if(!isMitra){
            corporate_id = null
        }
    }
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
                    <a href="/superadmin/account/student" class="body-medium-semi-bold tc-neutral-disabled">Manajemen Akun</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/student" class="body-medium-semi-bold tc-neutral-disabled">Karyawan</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/student/{id}#" class="body-medium-semi-bold tc-primary-main">Detail</a>
                </div>

                {#if status}
                <div class="row">
                    <div class="col-12 col-md-8">
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Karyawan</div>
                                    <div class="body-small-reguler">Berikut adalah informasi dari akun {detail.fullname}!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Nama Lengkap" id="fullname" 
                                        placeholder="Nama lengkap" bind:value={fullname}
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
                                    <Button disabled={fullname != detail.fullname || 
                                        username != detail.username || 
                                        email != detail.email ||
                                        corporate_id != detail.corporate_id ? false : true}
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/account/student' classList="btn btn-main-outline">Kembali</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 flex-column gap-3" transition:fly={{ delay: 450, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
                        <div class="card radius-sm">
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
                        <Button classList="btn {detail.status == 'Active' ? 'btn-warning' : 'btn-main'}" onClick={() => modalShow = true}>
                            <div class="flex gap-2 justify-content-center align-items-center">
                                {#if detail.status == 'Active'}
                                <LockFill/>
                                Non-Aktifkan
                                {:else if detail.status == 'Non-Active'}
                                <UnlockFill/>
                                Aktifkan
                                {/if}
                            </div>
                        </Button>
                    </div>
                </div>

                <div class="flex-column gap-3" transition:fly={{ delay: 650, duration: 300, y: -100, opacity: 0, easing: quintOut }}>
                    <Tab bind:value={tab} type="variabel" menus={[
                        {'title': 'Akses Materi', 'value': 'Course Access'},
                        {'title': 'Riwayat Transaksi', 'value': 'Transaction History'}
                    ]}/>

                    {#if tab == 'Course Access'}
                    <div class="card radius-sm gap-3">
                        <div class="flex-column">
                            <div class="body-medium-semi-bold">Akses Materi</div>
                            {#if $courses.length > 0}
                            <div class="body-small-reguler">Berikut adalah materi-materi yang dapat diakses oleh akun {detail.fullname}!</div>
                            {:else}
                            <div class="body-small-reguler">Akun {detail.fullname} belum memiliki akses ke materi apapun!</div>
                            {/if}
                        </div>
                        {#if $courses.length > 0}
                        <div class="row">
                            {#each $courses as course}
                            <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                                <div class="card radius-sm p-0">
                                    <div class="card-body">
                                        <div class="w-100">
                                            <img src="http://127.0.0.1:8000/storage/{course.thumbnail}" 
                                                class="card-img-fluid radius-sm-top" alt="course-thumbnail"
                                                loading="lazy">
                                        </div>
                                        <div class="flex-column p-2">
                                            <div class="body-small-medium">{course.title}</div>
                                            <div class="caption-small-reguler">Diakses sejak: {getDay(course.pivot.access_date)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/each}
                        </div>
                        {/if}
                    </div>
                    {:else if tab == 'Transaction History'}
                    <div class="card radius-sm gap-3">
                        <div class="flex-column">
                            <div class="body-medium-semi-bold">Riwayat Transaksi</div>
                            {#if $transactions.length > 0}
                            <div class="body-small-reguler">Berikut adalah transaksi yang pernah dilakukan oleh akun {detail.fullname}!</div>
                            {:else}
                            <div class="body-small-reguler">Akun {detail.fullname} belum melakukan transaksi apapun!</div>
                            {/if}
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
                <div class="h4">{detail.status == 'Active' ? 'Non-Aktifkan' : 'Aktifkan'} Akun Karyawan</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin {detail.status == 'Active' ? 'non-aktifkan' : 'aktifkan'} akun karyawan {detail.fullname} ?
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn {detail.status == 'Active' ? 'btn-warning' : 'btn-main'}" onClick={changeStatus}>Ya, {detail.status == 'Active' ? 'Non-Aktifkan' : 'Aktifkan'}!</Button>
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