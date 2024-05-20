<script>
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

	import ApiController from "$lib/ApiController";
    import { extract } from "$lib/Cookie";
    import showToast from "$lib/Toast";
	import { getValue } from "$lib/Input";
    import { setFlash } from "$lib/Flash";
    
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import InputField from "@components/InputField.svelte";
    import Button from "@components/Button.svelte";
    import Toast from "@components/Toast.svelte";
    import Dropzone from "@components/Dropzone.svelte";
    import Spinner from "@components/Spinner.svelte";

    import { ImageFill, ExclamationLg, NutFill, CheckLg, Hourglass, PersonWorkspace, Coin, PersonFill } from "svelte-bootstrap-icons"

    let user, errors, teachers, status = false
    let title, description, price, thumbnail_file, teacher_id

    let toastData = null
    let toastVisible = false

    let active = 'Umum'

    let showSpinner = false

    const handleSubmit = () => {
        showSpinner = true
        let formData = new FormData()

        formData.append('title', title)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('teacher_id', teacher_id)
        
        if(thumbnail_file){
            formData.append('thumbnail_file', thumbnail_file)
        }

        ApiController.sendRequest({
            method: "POST",
            endpoint: "course/add",
            data: formData,
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

    const getTeachers = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: 'account/get?role=Teacher',
            authToken: user.token
        }).then(response => {
            teachers = response.data
            status = true
        })
    }

    onMount(() => {
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
        }

        getTeachers()
    })
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="{user ? user.role : ''}" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Bank Kursus"/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex gap-2">
                    <a href="/superadmin/course" class="body-medium-semi-bold tc-primary-main">
                        Materi
                    </a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/course/add" class="body-medium-semi-bold tc-neutral-disabled">
                        Tambah Baru
                    </a>
                </div>
                {#if status}
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
                                <div class="row-menu-container" on:click={() => active = 'Pemateri'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Pemateri" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <PersonWorkspace width=20 height=20 color="{active == "Pemateri" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Pemateri" ? 'tc-primary-main' : 'tc-dark' }">Pemateri</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if teacher_id}
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
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-8 col-xl-9">
                        {#if active == 'Umum'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Umum</div>
                                    <div class="body-small-reguler">Masukkan judul dan deskripsi materi.</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Judul" id="title" placeholder="Masukkan judul" 
                                        bind:value={title} rules={[{required: true}]} error={errors ? errors.title ? errors.title : '' : ''}/>

                                    <InputField labelClass="body-medium-semi-bold" type="tinymce" label="Deskripsi" id="description" 
                                        bind:value={description} rules={[{ required: true }]} 
                                        error={errors ? errors.description ? errors.description : '' : '' }/>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={title && description ? false : true} classList="btn btn-main" onClick={() => active = 'Thumbnail'}>Berikutnya</Button>
                                    <Button type='link' href='/superadmin/course' classList="btn btn-main-outline">Batal</Button>
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
                                    <Button classList="btn btn-main" onClick={() => active = 'Pemateri'}>Berikutnya</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => active = 'Umum'}>Sebelumnya</Button>
                                </div>
                            </div>
                        </div>
                        {:else if active == 'Pemateri'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Pemateri</div>
                                    <div class="body-small-reguler">Pilih pemateri di bawah ini.</div>
                                </div>
                                {#if teachers && teachers.length > 0}
                                <div class="flex-column gap-2">
                                    {#each teachers as teacher, index}
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <div id="teacher-{index}" class="flex align-items-center p-3 gap-2 neutral-border radius-md teacher-data"
                                        on:click={() => {
                                            let target = document.getElementById(`teacher-${index}`)
                                            let siblings = [...target.parentElement.children].filter(elm => elm != target)

                                            if(teacher_id != teacher.id){
                                                teacher_id = teacher.id

                                                target.classList.add('success-border')
                                            }else{
                                                teacher_id = null
                                                target.classList.remove('success-border')
                                            }

                                            siblings.forEach(elm => {
                                                elm.classList.remove('success-border')
                                            })
                                        }}>
                                        <PersonFill width=15 height=15 />
                                        <div class="body-small-semi-bold">{ teacher.info.fullname }</div>
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

                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" disabled={teacher_id ? false : true} onClick={() => active = 'Harga'}>Berikutnya</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => active = 'Thumbnail'}>Sebelumnya</Button>
                                </div>
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
                                
                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" disabled={title && description && teacher_id && price ? false : true} onClick={handleSubmit}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => active = 'Pemateri'}>Sebelumnya</Button>
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