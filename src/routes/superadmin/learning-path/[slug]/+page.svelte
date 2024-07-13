<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import { onMount } from "svelte"
    import { goto, replaceState } from "$app/navigation"

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

    import { ImageFill, BookFill, ExclamationLg, NutFill, CheckLg, Hourglass, List, Trash, PlusLg, LightbulbFill, PencilFill, TrashFill } from "svelte-bootstrap-icons"
	import checkLogin from "$lib/CheckLogin.js";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";

    export let data
    let slug = data.slug
    
    let user
    let active = 'Umum'
    let title, description, thumbnail_file, thumbnail_url
    let learningPath
    let items = []
    let courses
    let selectedCourse = []
    
    let errors = null
    let toastData = null
    let toastVisible = false
    let showSpinner = false
    let courseListExpand = false
    let isChangingThumbnail = false
    let modalShow = false
    let status = false

    let timeoutId = null

    const flipDurationMs = 300
    const handleDndConsider = (e) => items = e.detail.items
    const handleSort = (e) => { 
        items = e.detail.items.map((elm, index) => {
            return {...elm, order: index + 1}
        })

        if(timeoutId){
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            reorderItems(items.map(item => ({id: item.id, order: item.order})))
            timeoutId = null
        }, 1500)
    }

    const reorderItems = (datas) => {
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'course/reorder',
            data: JSON.stringify(datas),
            authToken: user.token
        }).then(response => {
            if(response.status){
                toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                toastVisible = true
                return
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const appendCourse = (id, index) => {
        let temp = selectedCourse
        if (temp.includes(id)) {
            selectedCourse = temp.filter(elm => elm != id)
        } else {
            selectedCourse = [...temp, id]
        }
    }

    const handleSubmit = (section) => {
        showSpinner = true

        let sendData = new FormData()
        sendData.append('section', section)
        sendData.append('id', learningPath.id)

        if(section == 'General'){
            sendData.append('title', title)
            sendData.append('description', description)
        }else if(section == 'Thumbnail'){
            sendData.append("thumbnail_file", thumbnail_file)
        }else{
            sendData.append("selected_course", selectedCourse)
        }

        ApiController.sendRequest({
            method: "POST",
            endpoint: 'learning-path/update',
            data: sendData,
            authToken: user.token
        }).then(response => {
            if(response.error){
                errors = response.error
                showSpinner = false
                return
            }

            if(response.status){
                if(section == 'Thumbnail'){
                    thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${response.data.thumbnail}`
                    isChangingThumbnail = false
                }else if(section == 'Course'){
                    selectedCourse = []
                }

                getLearningPath(response.data.slug, () => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                    toastVisible = true
                    showSpinner = false
                })
            }else{
                toastData = { title: "Gagal", message: response.message, color: 'toast-danger' }
                toastVisible = true
                showSpinner = false
            }
        })
    }

    const getLearningPath = (newSlug = null, callback = null) => {
        slug = newSlug ?  newSlug : slug
        ApiController.sendRequest({
            method: "GET",
            endpoint: `learning-path/get/${slug}?with_courses=yes`
        }).then(response => {
            learningPath = response.data
            learningPath.courses = learningPath.courses.sort((a, b) => a.order - b.order)
            items = JSON.parse(JSON.stringify(learningPath.courses))
            courses = learningPath.lone_course
            
            title = learningPath.title
            description = learningPath.description
            thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${learningPath.thumbnail}`
            
            replaceState(`/superadmin/learning-path/${learningPath.slug}`)
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    }

    const removeCourse = (courseId) => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'learning-path/remove-course',
            authToken: user.token,
            data: {
                learning_path_id: learningPath.id,
                course_id: courseId
            }
        }).then(response => {
            if(response.status){
                getLearningPath(null, () => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                    showSpinner = false
                    toastVisible = true
                })
            }
        })
    }

    const deletePath = () => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'learning-path/delete',
            data: { id: learningPath.id },
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
                errors = response.error
            }
            
            modalShow = false
            showSpinner = false
        })
    }

    let isSidebarOpen = true

    onMount(() => {
        user = checkLogin('Superadmin')
        
        getLearningPath()
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
                {#if status}
                <div class="flex gap-2">
                    <a href="/superadmin/learning-path" class="body-medium-semi-bold tc-neutral-disabled">Alur Pembelajaran</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/learning-path/{slug}" class="body-medium-semi-bold tc-primary-main">{ learningPath ? learningPath.title : '' }</a>
                </div>
                <div class="row">
                    <div class="col-12 col-md-4 col-xl-3 mb-3 flex-column gap-3">
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
                                        {#if thumbnail_file || learningPath.thumbnail}
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
                                        {#if learningPath.courses.length > 0}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Publikasi'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Publikasi" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <LightbulbFill width=20 height=20 color="{active == "Publikasi" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Publikasi" ? 'tc-primary-main' : 'tc-dark' }">Publikasi</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button classList="btn btn-danger" onClick={() => {
                            modalShow = true
                        }}>
                            <div class="flex gap-2 justify-content-center align-items-center">
                                <TrashFill/>
                                Hapus
                            </div>
                        </Button>
                    </div>
                    <div class="col-12 col-md-8 col-xl-9">
                        {#if active == 'Umum'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Umum</div>
                                    <div class="body-small-reguler">Atur judul dan deskripsi alur belajar!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Judul" id="title" 
                                        placeholder="Judul alur pembelajaran" bind:value={title}
                                        rules={[{ required: true }]} error={errors ? errors.title ? errors.title : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" type="tinymce" bind:value={description}
                                        label="Deskripsi" id="description" rules={[{ required: true }]} 
                                        error={errors ? errors.description ? errors.description : '' : '' }/>
                                </div>

                                {#if title != learningPath.title || description != learningPath.description }
                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" onClick={() => handleSubmit('General')}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => {
                                        title = learningPath.title
                                        description = learningPath.description
                                    }}>Batal</Button>
                                </div>
                                {/if}
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
                                    {#if isChangingThumbnail}
                                    <Dropzone bind:file={thumbnail_file} />
                                    {:else}
                                    <Dropzone bind:file={thumbnail_file} bind:url={thumbnail_url} />
                                    {/if}
                                </div>

                                {#if isChangingThumbnail}
                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" onClick={() => handleSubmit('Thumbnail')}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => isChangingThumbnail = false}>Batal</Button>
                                </div>
                                {:else}
                                <div class="flex justify-content-center gap-2">
                                    <Button classList='btn pt-0' onClick={() => {
                                        isChangingThumbnail = true
                                    }}>
                                        <div class="flex tc-primary-main justify-content-center align-items-center gap-2">
                                            <PencilFill />
                                            Ubah
                                        </div>
                                    </Button>
                                </div>
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Materi'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Materi</div>
                                    <div class="body-small-reguler">Susun materi-materi untuk Learning Path {title}!</div>
                                </div>

                                <div class="flex-column gap-2" use:dragHandleZone={{ items, flipDurationMs }} on:consider={handleDndConsider} on:finalize="{handleSort}">
                                    {#if items.length > 0}
                                    {#each items as course, index (course.id)}
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div id="old-course-{index}" 
                                        class="flex align-items-center justify-content-between p-3 neutral-border radius-md">
                                        <div class="flex gap-2 align-items-center">
                                            <div class="draggable flex align-items-center" use:dragHandle aria-label="drag-handle for {course.id}"
                                            style="cursor: grab;"><List /></div>
                                            <div class="body-small-semi-bold">{ course.title }</div>
                                        </div>
                                        <Button classList='btn p-0' onClick={() => removeCourse(course.id)}>
                                            <div class="flex align-items-center">
                                                <Trash />
                                            </div>
                                        </Button>
                                    </div>
                                    {/each}
                                    
                                    {:else}
                                    {#if !courseListExpand}
                                    <div class="flex justify-content-center">
                                        <div class="body-small-reguler">
                                            Belum ada materi, silahkan tambah materi ke learning path {learningPath.title}!
                                        </div>
                                    </div>
                                    {/if}
                                    {/if}
                                    
                                    {#if !courseListExpand}
                                    <Button classList="btn btn-neutral-outline" onClick={() => courseListExpand = true}>
                                        <div class="flex body-small-semi-bold tc-dark justify-content-center align-items-center gap-2">
                                            <PlusLg/>
                                            Tambah
                                        </div>
                                    </Button>
                                    {/if}
                                </div>

                                {#if courseListExpand}
                                {#if courses && courses.length > 0}
                                <div class="flex-column gap-2">
                                    <div class="body-small-reguler">Pilih materi dibawah ini!</div>
                                    {#each courses as course, index}
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div id="course-{index}" class="flex align-items-center p-3 gap-2 radius-md course-data 
                                        {selectedCourse.includes(course.id) ? 'success-border' : 'neutral-border'}"
                                        on:click={() => appendCourse(course.id, index)}>
                                        <div class="body-small-semi-bold">{ course.title }</div>
                                    </div>
                                    {/each}
                                </div>
                                <div class="flex justify-content-between align-items-center">
                                    <div class="body-small-reguler">
                                        Materi yang dipilih: { selectedCourse.length }
                                    </div>
                                    <div class="gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => courseListExpand = false}>Batal</Button>
                                        <Button classList="btn btn-main" onClick={() => {
                                            handleSubmit('Course')
                                        }}>Simpan</Button>
                                    </div>
                                </div>
                                {:else}
                                <div class="flex justify-content-center align-items-center h-100">
                                    <div class="flex-column align-items-center justify-content-center gap-3">
                                        <Hourglass width=60 height=60 color="#3951A8"/>
                                        <div class="flex-column gap-1">
                                            <div class="caption-reguler tc-neutral-disabled">Semua Materi telah diinput ke Alur Belajar!</div>
                                            <Button classList="btn p-0" onClick={() => courseListExpand = false}>
                                                <div class="caption-reguler-thin tc-primary-main" style="text-decoration: underline;">Tutup</div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {/if}
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Publikasi'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Publikasi</div>
                                    <div class="body-small-reguler">Pastikan poin-poin dibawah ini telah terpenuhi sebelum mempublikasi Learning Path {title}!</div>
                                </div>
                            </div>
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
                <div class="h4">Hapus Alur Belajar</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus alur belajar {learningPath.title}? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deletePath}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => modalShow = false}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>{learningPath ? learningPath.title : 'Loading'}</title>

    <style>
        .draggable{
            cursor: move;
        }
    
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