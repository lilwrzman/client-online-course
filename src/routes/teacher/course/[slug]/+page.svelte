<script>
    import { onMount } from "svelte";
    import { replaceState } from "$app/navigation";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

	import ApiController from "$lib/ApiController.js";
    
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import InputField from "@components/InputField.svelte";
    import Toast from "@components/Toast.svelte";
    import Dropzone from "@components/Dropzone.svelte";
    import Spinner from "@components/Spinner.svelte";

    import { ImageFill, ExclamationLg, NutFill, CheckLg, PersonWorkspace, Coin, PersonFill, PassFill, LightbulbFill, Trash, TrashFill } from "svelte-bootstrap-icons"
	import checkLogin from "$lib/CheckLogin.js";

    export let data
    let slug = data.slug
    let detail

    let user, errors, teachers, status = false
    let title, description, price, thumbnail_url, thumbnail_file, selected_teacher

    let toastData = null
    let toastVisible = false

    let active = 'Umum'

    let teacherListExpand = false
    let isChangingThumbnail = false
    let showSpinner = false
    let modalShow = false

    const getDetail = (newSlug = null, callback = null) => {
        slug = newSlug ? newSlug : slug
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/get/${slug}?with_teachers=yes`,
        }).then(response => {
            detail = response.data
            title = detail.title
            description = detail.description
            price = detail.price
            selected_teacher = detail.teacher
            teachers = detail.teachers
            thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${detail.thumbnail}`
            
            replaceState(`/teacher/course/${detail.slug}`)
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    }

    onMount(() => {
        user = checkLogin('Teacher')

        getDetail()
    })
</script>

<div class="flex">
    <Sidebar active="Materi" role="Teacher" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Materi" bind:user={user}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex gap-2">
                    <a href="/teacher/course" class="body-medium-semi-bold tc-neutral-disabled">Materi</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/teacher/course/{slug}" class="body-medium-semi-bold tc-primary-main">{ detail ? detail.title : '' }</a>
                </div>
                
                {#if status}
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
                                        {#if thumbnail_file || detail.thumbnail}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Pemateri'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Pemateri" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <PersonWorkspace width=20 height=20 color="{active == "Pemateri" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Pemateri" ? 'tc-primary-main' : 'tc-dark' }">Pemateri</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if selected_teacher && selected_teacher.id}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Harga'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Harga" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <Coin width=20 height=20 color="{active == "Harga" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Harga" ? 'tc-primary-main' : 'tc-dark' }">Harga</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if price}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Submateri'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Submateri" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <PassFill width=20 height=20 color="{active == "Submateri" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Submateri" ? 'tc-primary-main' : 'tc-dark' }">Submateri</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if price}
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
                                        {#if price}
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
                                    <div class="body-small-reguler">Judul dan deskripsi materi!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField disabled={true} labelClass="body-medium-semi-bold" label="Judul" 
                                        id="title" placeholder="Masukkan judul" value={title} />

                                    <InputField labelClass="body-medium-semi-bold" type="tinymce" label="Deskripsi" id="description" 
                                        value={description} disabled={true} />
                                </div>
                            </div>
                        </div>
                        {:else if active == 'Thumbnail'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Thumbnail</div>
                                    <div class="body-small-reguler">Thumbnail untuk materi!</div>
                                </div>

                                <div class="px-8">
                                    <Dropzone bind:url={thumbnail_url} />
                                </div>
                            </div>
                        </div>
                        {:else if active == 'Pemateri'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Pemateri</div>
                                    <div class="body-small-reguler">Belum ada Pemateri yang bertanggung jawab mengelola materi {detail.title}!</div>
                                </div>

                                {#if detail.teacher}
                                <div class="flex gap-2 align-items-center p-3 neutral-border radius-md">
                                    <PersonFill width=15 height=15 />
                                    <div class="body-small-semi-bold">{ detail.teacher.info.fullname }</div>  
                                </div>
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Harga'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Harga</div>
                                    <div class="body-small-reguler">Harga jual materi {detail.title}!</div>
                                </div>
                                <InputField prefix="Rp." labelClass="body-medium-semi-bold" type="number" id="price" 
                                    label="Harga" value={price} disabled={true}/>
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
    <title>Materi | { title ? title : 'Loading' }</title>

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
    
        .teacher-data:hover{
            cursor: pointer;
        }
    </style>
</svelte:head>