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
    let id = data.id
    
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

    const getLearningPath = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `learning-path/get/${id}?with_courses=yes`
        }).then(response => {
            learningPath = response.data
            learningPath.courses = learningPath.courses.sort((a, b) => a.order - b.order)
            items = JSON.parse(JSON.stringify(learningPath.courses))
            courses = learningPath.lone_course
            
            title = learningPath.title
            description = learningPath.description
            thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${learningPath.thumbnail}`
            
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    }

    onMount(() => {
        user = checkLogin('Teacher', true)
        
        getLearningPath()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Alur Belajar" role="Teacher" bind:isSidebarOpen={isSidebarOpen}/>
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
                    <a href="/teacher/learning-path" class="body-medium-semi-bold tc-neutral-disabled">Alur Pembelajaran</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/teacher/learning-path/{id}" class="body-medium-semi-bold tc-primary-main">{ learningPath ? learningPath.title : '' }</a>
                </div>
                <div class="row">
                    <div class="col-12 col-md-4 col-xl-3">
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
                            </div>
                        </div>
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
                                        disabled={true}
                                        placeholder="Judul alur pembelajaran" bind:value={title}
                                        rules={[{ required: true }]} error={errors ? errors.title ? errors.title : '' : '' }/>

                                    <InputField labelClass="body-medium-semi-bold" type="tinymce" bind:value={description}
                                        disabled={true}
                                        label="Deskripsi" id="description" rules={[{ required: true }]} 
                                        error={errors ? errors.description ? errors.description : '' : '' }/>
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
                                    {#if isChangingThumbnail}
                                    <Dropzone bind:file={thumbnail_file} />
                                    {:else}
                                    <Dropzone bind:file={thumbnail_file} bind:url={thumbnail_url} />
                                    {/if}
                                </div>
                            </div>
                        </div>
                        {:else if active == 'Materi'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Materi</div>
                                    <div class="body-small-reguler">Susun materi-materi untuk Learning Path {title}!</div>
                                </div>

                                <div class="flex-column gap-2">
                                    {#if items.length > 0}
                                    {#each items as course, index (course.id)}
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div id="old-course-{index}" 
                                        class="flex align-items-center justify-content-between p-3 neutral-border radius-md">
                                        <div class="flex gap-2 align-items-center">
                                            <div class="body-small-semi-bold">{ course.title }</div>
                                        </div>
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

<svelte:head>
    <title>{learningPath ? learningPath.title : 'Loading'}</title>
</svelte:head>

<style>
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