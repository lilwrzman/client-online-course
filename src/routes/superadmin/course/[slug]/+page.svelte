<script>
    import { onMount } from "svelte";
    import { goto, replaceState } from "$app/navigation";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

	import ApiController from "$lib/ApiController";
    import { extract } from "$lib/Cookie";
    import { setFlash } from "$lib/Flash.js";
    
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import InputField from "@components/InputField.svelte";
    import Button from "@components/Button.svelte";
    import Toast from "@components/Toast.svelte";
    import Dropzone from "@components/Dropzone.svelte";
    import Spinner from "@components/Spinner.svelte";
    import Modal from "@components/Modal.svelte";

    import { ImageFill, ExclamationLg, NutFill, CheckLg, Hourglass, PersonWorkspace, Coin, PersonFill, PencilFill, PassFill, LightbulbFill, Trash, TrashFill } from "svelte-bootstrap-icons"
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

    const handleSubmit = (section) => {
        showSpinner = true

        let formData = new FormData()
        formData.append('section', section)
        formData.append('id', detail.id)

        if(section == 'General'){
            formData.append('title', title)
            formData.append('description', description)
        }else if(section == 'Thumbnail'){
            formData.append('thumbnail_file', thumbnail_file)
        }else if(section == 'Teacher'){
            formData.append('teacher_id', selected_teacher.id)
        }else if(section == 'Price'){
            formData.append('price', price)
        }else{
            return
        }

        ApiController.sendRequest({
            method: "POST",
            endpoint: "course/update",
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.error){
                errors = response.error
                showSpinner = false
                return
            }

            if(response.status){
                if(section == 'Thumbnail'){
                    thumbnail_url = `http://127.0.0.1:8000/storage/${response.data.thumbnail}`
                    isChangingThumbnail = false
                }else if(section == 'Teacher'){
                    teacherListExpand = false
                }

                getDetail(response.data.slug, () => {
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
            thumbnail_url = `http://127.0.0.1:8000/storage/${detail.thumbnail}`
            
            replaceState(`/superadmin/course/${detail.slug}`)
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    }

    const removeTeacher = () => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: `course/${detail.id}/remove_teacher`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                getDetail(null, () => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                    toastVisible = true
                    showSpinner = false
                })
            }
        })
    }

    const deleteCourse = () => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'course/delete',
            data: { id: detail.id },
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({ message: response.message, type: 'success', redirect: '/superadmin/course' })
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

            showSpinner = false
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin")

        getDetail()
    })
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Superadmin" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Bank Kursus" bind:user={user}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex gap-2">
                    <a href="/superadmin/course" class="body-medium-semi-bold tc-neutral-disabled">Materi</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/course/{slug}" class="body-medium-semi-bold tc-primary-main">{ detail ? detail.title : '' }</a>
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
                                    <div class="body-small-reguler">Atur judul dan deskripsi materi!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Judul" id="title" placeholder="Masukkan judul" 
                                        bind:value={title} rules={[{required: true}]} error={errors ? errors.title ? errors.title : '' : ''}/>

                                    <InputField labelClass="body-medium-semi-bold" type="tinymce" label="Deskripsi" id="description" 
                                        bind:value={description} rules={[{ required: true }]} 
                                        error={errors ? errors.description ? errors.description : '' : '' }/>
                                </div>

                                {#if title != detail.title || description != detail.description}
                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={title && description ? false : true} 
                                        classList="btn btn-main" onClick={() => handleSubmit('General')}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => {
                                        title = detail.title
                                        description = detail.description
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
                        {:else if active == 'Pemateri'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Pemateri</div>
                                    <div class="body-small-reguler">Atur pemateri untuk materi {title} dibawah ini!</div>
                                </div>

                                <div class="flex-column gap-2">
                                    {#if !detail.teacher}
                                    <div class="body-small-reguler">Belum ada Pemateri untuk Materi ini!</div>
                                    {:else}
                                    <div class="flex align-items-center p-3 justify-content-between 
                                        neutral-border radius-md">
                                        <div class="flex gap-2 align-items-center">
                                            <PersonFill width=15 height=15 />
                                            <div class="body-small-semi-bold">{ detail.teacher.info.fullname }</div>    
                                        </div>
                                        <Button classList="btn btn-no-padding" onClick={removeTeacher}>
                                            <div class="flex align-items-center">
                                                <Trash width=15 height=15/>
                                            </div>
                                        </Button>
                                    </div>
                                    {/if}
                                    {#if !teacherListExpand}
                                    <Button classList="btn btn-neutral-outline" onClick={() => teacherListExpand = true}>
                                        <div class="flex body-small-semi-bold tc-dark justify-content-center align-items-center gap-2">
                                            <PencilFill/>
                                            {#if detail.teacher}
                                            Ubah Pemateri
                                            {:else}
                                            Atur Pemateri
                                            {/if}
                                        </div>
                                    </Button>
                                    {/if}
                                </div>

                                {#if teacherListExpand}
                                    {#if teachers && teachers.length > 0}
                                        <div class="flex-column gap-2">
                                            <div class="body-small-reguler">Pilih pemateri dibawah ini!</div>
                                            {#each teachers as item}
                                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                                            <div on:click={() => {
                                                if(!selected_teacher){
                                                    selected_teacher = item
                                                }else{
                                                    selected_teacher = selected_teacher == item ? null : item
                                                }
                                            }} 
                                                class="flex align-items-center p-3 gap-2 radius-md teacher-data
                                                {selected_teacher && selected_teacher.id == item.id ? 'success-border' : 'neutral-border'}">
                                                <PersonFill width=15 height=15 />
                                                <div class="body-small-semi-bold">{ item.info.fullname }</div>
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
                                {/if}

                                {#if teacherListExpand}
                                <div class="flex justify-content-between align-items-center">
                                    <div class="body-small-reguler">
                                        {#if !detail.teacher && selected_teacher}
                                            Atur {selected_teacher.info.fullname} sebagai pemateri {detail.title}?
                                        {:else}
                                            {#if selected_teacher != detail.teacher}
                                                Ganti Pemateri {detail.teacher.info.fullname} menjadi {selected_teacher.info.fullname}?
                                            {/if}
                                        {/if}
                                    </div>
                                    <div class="flex gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => {
                                            selected_teacher = detail.teacher
                                            teacherListExpand = false
                                        }}>Batal</Button>
                                        <Button classList="btn btn-main" onClick={() => handleSubmit('Teacher')}>Simpan</Button>
                                    </div>
                                </div>
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Harga'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Harga</div>
                                    <div class="body-small-reguler">Masukkan harga di bawah ini.</div>
                                </div>
                                
                                <InputField prefix="Rp." labelClass="body-medium-semi-bold" type="number" id="price" 
                                    placeholder = "Masukkan nominal harga"
                                    label="Harga" bind:value={price}
                                    error={errors ? errors.price ? errors.price : '' : '' }/>
                                
                                {#if price != detail.price}
                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" disabled={price ? false : true} onClick={() => handleSubmit('Price')}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => price = detail.price}>Batal</Button>
                                </div>
                                {/if}
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
                    Apakah anda yakin ingin menghapus alur belajar {detail.title}? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteCourse}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => modalShow = false}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>{ title ? title : 'Loading' }</title>

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