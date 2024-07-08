<script>
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
    import { DataHandler } from "@vincjo/datatables/local"

    import { PencilFill, TrashFill } from "svelte-bootstrap-icons"
	import checkLogin from "$lib/CheckLogin.js";

    export let data
    let id = data.id

    let user
    let errors = null

    let toastData = null
    let toastVisible = false

    let showSpinner = false

    let teacher 
    let fullname, username, email, facebook_name, facebook_url, instagram_name, instagram_url, avatar_file, avatar_url
    let facebook = {}, instagram = {}
    let myCourses, handlerCourses, courses

    let isChangingAvatar = false
    let status = false
    let modalShow = false

    const handleSubmit = (evt) => {
        showSpinner = true

        let fd = new FormData()
        fd.append("id", id)
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
            myCourses = teacher.my_courses
            handlerCourses = new DataHandler(myCourses)
            courses = handlerCourses.getRows()
            
            if(teacher.social_media.length > 0){
                teacher.social_media.map(elm => {
                    if(elm.type == 'Facebook') {
                        facebook = elm
                        facebook_name = elm.username
                        facebook_url = elm.url
                    }else if(elm.type == 'Instagram'){
                        instagram = elm
                        instagram_name = elm.username
                        instagram_url = elm.url
                    }
                })
            }else{
                facebook.username = ""
                facebook.url = ""
                instagram.username = ""
                instagram.url = ""
            }

            avatar_url = `${PUBLIC_SERVER_PATH}/storage/${teacher.avatar}`
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    } 

    const deleteTeacher = () => {
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
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/account/teacher' })
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

    onMount(() => {
        user = checkLogin("Superadmin")

        getDetail()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={false} active="Manajemen Akun" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
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
                    <a href="/superadmin/account/student" class="body-medium-semi-bold tc-neutral-disabled">Manajemen Akun</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/teacher" class="body-medium-semi-bold tc-neutral-disabled">Pemateri</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/account/teacher/{id}#" class="body-medium-semi-bold tc-primary-main">Detail</a>
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
                                    
                                    <div class="flex-column gap-2">
                                        <div class="body-medium-semi-bold">Media Sosial</div>
                                        <div class="card neutral-border">
                                            <div class="card-body gap-3">
                                                <div class="flex gap-2">
                                                    <InputField labelClass="body-small-semi-bold" bind:value={facebook_name}
                                                        placeholder="Nama akun Facebook pemateri" containerClass="w-100"
                                                        label="Akun Facebook" id="facebook_name" />

                                                    <div class="flex-column w-100 gap-1">
                                                        <InputField labelClass="body-small-semi-bold" bind:value={facebook_url}
                                                            placeholder="Link akun Facebook pemateri" containerClass="w-100" 
                                                            label="Link Facebook" id="facebook_url" rules={[{ required: facebook_name ? true : false }]}
                                                            error={errors ? errors.facebook_name ? errors.facebook_name : '' : facebook_name && !facebook_url ? 'Harap isi data ini!' : ''}/>
                                                    </div>
                                                </div>
                                                <div class="flex gap-2">
                                                    <InputField labelClass="body-small-semi-bold" bind:value={instagram_name}
                                                        placeholder="Nama akun Instagram pemateri" containerClass="w-100"
                                                        label="Akun Instagram" id="instagram_name" />

                                                    <div class="flex-column w-100 gap-1">
                                                        <InputField labelClass="body-small-semi-bold" bind:value={instagram_url}
                                                            placeholder="Link akun Instagram pemateri" containerClass="w-100"
                                                            label="Link Instagram" id="instagram_url" rules={[{ required: instagram_name ? true : false }]}
                                                            error={errors ? errors.instagram_name ? errors.instagram_name : '' : instagram_name && !instagram_url ? 'Harap isi data ini!' : ''}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={((fullname != teacher.fullname && fullname) || 
                                        (username != teacher.username && username) || 
                                        (email != teacher.email && email) ||
                                        ( facebook_name != facebook.username ) || 
                                        ( facebook_url != facebook.url ) ||
                                        ( instagram_name != instagram.username ) || 
                                        ( instagram_url != instagram.url )) && 
                                        (( facebook_name ? facebook_url : true ) && ( instagram_name ? instagram_url : true ))
                                        ? false : true} 
                                        classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    <Button type='link' href='/superadmin/account/teacher' classList="btn btn-main-outline">Kembali</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 mb-3 flex-column gap-3" transition:fly={{ delay: 450, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
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

                <div class="card radius-sm gap-3" transition:fly={{ delay: 650, duration: 300, y: -100, opacity: 0, easing: quintOut }}>
                    <div class="card-body gap-3">
                        <div class="flex-column">
                            <div class="body-medium-semi-bold">Materi</div>
                            {#if $courses.length > 0}
                            <div class="body-small-reguler">Berikut adalah materi-materi yang dapat dikelola oleh akun {teacher.fullname}!</div>
                            {:else}
                            <div class="body-small-reguler">Akun {teacher.fullname} belum memiliki akese untuk mengelola materi apapun!</div>
                            {/if}
                        </div>
                        {#if $courses.length > 0}
                        <div class="row">
                            {#each $courses as course}
                            <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                                <div class="card radius-sm p-0">
                                    <div class="card-body">
                                        <div class="w-100">
                                            <img src="{PUBLIC_SERVER_PATH}/storage/{course.thumbnail}" 
                                                class="card-img-fluid radius-sm-top" alt="course-thumbnail"
                                                loading="lazy">
                                        </div>
                                        <div class="flex-column p-2">
                                            <div class="body-small-medium">{course.title}</div>
                                            <div class="caption-reguler-thin">{course.items} item</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/each}
                        </div>
                        {/if}
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
                <div class="h4">Hapus Pemateri</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus pemateri {teacher.fullname} ? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteTeacher}>Ya, hapus!</Button>
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