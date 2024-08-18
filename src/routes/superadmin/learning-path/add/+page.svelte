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

    import { ImageFill, BookFill, ExclamationLg, NutFill, CheckLg, Hourglass } from "svelte-bootstrap-icons"
	import checkLogin from "$lib/CheckLogin";

    let user
    let active = 'Umum'
    let title, description, thumbnail_file
    let courses
    let selectedCourse = []
    
    let errors = null
    let toastData = null
    let toastVisible = false
    let showSpinner = false

    let isSidebarOpen = true

    const appendCourse = (id) => {
        let temp = selectedCourse
        if (temp.includes(id)) {
            selectedCourse = temp.filter(elm => elm != id)
        } else {
            selectedCourse = [...temp, id]
        }
    }

    const handleSubmit = (evt) => {
        if(!title || !description){
            active = 'Umum'
            return alert('Harap isi judul dan deskripsi Learning Path!')
        }

        showSpinner = true

        let fd = new FormData()
        fd.append("title", title)
        fd.append("description", description)
        
        if(thumbnail_file){
            fd.append("thumbnail_file", thumbnail_file)
        }

        if(selectedCourse.length > 0){
            fd.append("courses", selectedCourse)
        }

        ApiController.sendRequest({
            contentType: 'multipart/form-data',
            method: "POST",
            endpoint: "learning-path/add",
            data: fd,
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/learning-path' })
                return
            }else if(!response.status){
                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
                toastVisible = true
            }else{
                showSpinner = false
                errors = response.error
            }

            showSpinner = false
        })
    }

    const getMateri = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: 'course/no-learning-path/get'
        }).then(response => {
            courses = response.data
        })
    }

    onMount(() => {
        user = checkLogin('Superadmin')

        getMateri()
    })
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Alur Belajar" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
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
                <div class="flex gap-2">
                    <a href="/superadmin/learning-path" class="body-medium-semi-bold tc-neutral-disabled">Alur Pembelajaran</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/learning-path/add" class="body-medium-semi-bold tc-primary-main">Tambah Baru</a>
                </div>
                <div class="row">
                    <div class="col-12 col-md-4 col-xl-3 mb-3">
                        <div class="card radius-sm">
                            <div class="card-body gap-2">
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Umum'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Umum" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <NutFill width=20 height=20 color="{active == "Umum" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Umum" ? 'tc-primary-main' : 'tc-dark' }">Umum</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if title && description}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Thumbnail'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Thumbnail" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <ImageFill width=20 height=20 color="{active == "Thumbnail" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Thumbnail" ? 'tc-primary-main' : 'tc-dark' }">Thumbnail</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if thumbnail_file}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Materi'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Materi" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <BookFill width=20 height=20 color="{active == "Materi" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Materi" ? 'tc-primary-main' : 'tc-dark' }">Materi</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if selectedCourse.length > 0}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-8 col-xl-9">
                        {#if active == 'Umum'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Umum</div>
                                    <div class="body-small-reguler">Masukkan judul dan deskripsi alur belajar</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Judul" id="title" 
                                        placeholder="Judul alur pembelajaran" bind:value={title}
                                        rules={[{ required: true }]} error={errors ? errors.title ? errors.title : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" type="tinymce" bind:value={description}
                                        label="Deskripsi" id="description" rules={[{ required: true }]} placeholder="Masukkan deskripsi alur belajar"
                                        error={errors ? errors.description ? errors.description : '' : '' }/>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={title && description ? false : true} classList="btn btn-main" onClick={() => active = 'Thumbnail'}>Berikutnya</Button>
                                    <Button type='link' href='/superadmin/learning-path' classList="btn btn-main-outline">Batal</Button>
                                </div>
                            </div>
                        </div>
                        {:else if active == 'Thumbnail'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">

                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Thumbnail</div>
                                    <div class="body-small-reguler">
                                        <ul class="my-0">
                                            <li>Unggah file gambar JPG atau PNG (rasio gambar 4:3 maksimal 500kb)</li>
                                            <li>Opsional, apabila tidak mengunggah apapun, maka menggunakan gambar default.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="px-8">
                                    <Dropzone bind:file={thumbnail_file} />
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" onClick={() => active = 'Materi'}>Lewati</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => active = 'Umum'}>Sebelumnya</Button>
                                </div>
                            </div>
                        </div>
                        {:else if active == 'Materi'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">

                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Materi</div>
                                    <div class="body-small-reguler">Pilih materi-materi di bawah ini. (Opsional)</div>
                                </div>

                                {#if courses && courses.length > 0}
                                <div class="flex-column gap-2">
                                    {#each courses as course, index}
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div id="course-{index}" class="flex align-items-center p-3 gap-2 { selectedCourse.includes(course.id) ? 'success-border' : 'neutral-border' } radius-md course-data"
                                        on:click={() => appendCourse(course.id)}>
                                        <div class="body-small-semi-bold">{ course.title }</div>
                                    </div>
                                    {/each}
                                </div>
                                {:else}
                                <div class="flex justify-content-center align-items-center h-100">
                                    <div class="flex-column align-items-center justify-content-center gap-3">
                                        <Hourglass width=60 height=60 color="#3951A8"/>
                                        <div class="caption-reguler tc-neutral-disabled">Data tidak ditemukan...</div>
                                    </div>
                                </div>
                                {/if}

                                <div class="flex justify-content-between align-items-center">
                                    <div class="body-small-reguler">
                                        {#if courses}
                                        Materi yang dipilih: { selectedCourse.length }
                                        {/if}
                                    </div>
                                    <div class="gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => active = 'Thumbnail'}>Sebelumnya</Button>
                                        <Button classList="btn btn-main" onClick={handleSubmit}>
                                            {#if selectedCourse.length > 0}
                                            Simpan
                                            {:else}
                                            Lewati dan Simpan
                                            {/if}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/if}
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Alur Belajar | Tambah Baru</title>
    
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