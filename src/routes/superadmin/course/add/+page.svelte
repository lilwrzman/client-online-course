<script>
    import { onMount } from "svelte";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

	import ApiController from "$lib/ApiController";
    import { setFlash } from "$lib/Flash";
    
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import InputField from "@components/InputField.svelte";
    import Button from "@components/Button.svelte";
    import Toast from "@components/Toast.svelte";
    import Dropzone from "@components/Dropzone.svelte";
    import Spinner from "@components/Spinner.svelte";

    import { ImageFill, ExclamationLg, NutFill, CheckLg, Hourglass, PersonWorkspace, Coin, PersonFill, X, PlusLg } from "svelte-bootstrap-icons"
	import checkLogin from "$lib/CheckLogin";
	import { text } from "@sveltejs/kit";

    let user, errors, teachers
    let title, description, price, thumbnail_file, teacher_id, facilities = [{order: 1, text: ''}]
    let active = 'Umum'

    let toastData = null
    let toastVisible = false
    let showSpinner = false
    let status = false

    const handleSubmit = () => {
        showSpinner = true
        let formData = new FormData()

        formData.append('title', title)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('teacher_id', teacher_id)

        facilities.forEach((facility, index) => {
            formData.append('facilities[]', facility.text)
        })
        
        if(thumbnail_file){
            formData.append('thumbnail_file', thumbnail_file)
        }

        ApiController.sendRequest({
            contentType: 'multipart/form-data',
            method: "POST",
            endpoint: "course/add",
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/course' })
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
            
            showSpinner = false
        }).catch(e => {
            let error = e.response.data
            console.error(error)
            showSpinner = false

            if(error.error){
                errors = error.error

                if(error.error['title'] || error.error['description'] || error.error['facilities.0']){
                    return active = "Umum"
                }

                if(error.error['thumbnail_file']){
                    return active = "Thumbnail"
                }

                if(error.error['price']){
                    return active = "Harga"
                }

                if(error.error['teacher_id']){
                    return active = "Pemateri"
                }
            }
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
        user = checkLogin('Superadmin')

        getTeachers()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Superadmin"  bind:isSidebarOpen={isSidebarOpen}/>
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
                    <a href="/superadmin/course" class="body-medium-semi-bold tc-neutral-disabled">Materi</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/course/add" class="body-medium-semi-bold tc-primary-main">Tambah Baru</a>
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
                                        {#if title && description && facilities[0].text != ""}
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

                                    <div class="flex-column gap-2">
                                        <label for="" class="body-medium-semi-bold">Fasilitas Pembelajaran</label>
                                        {#each facilities as facility, index}
                                        <div class="flex gap-2 align-items-center">
                                            <InputField id="facility-{index+1}" containerClass="w-100"
                                                placeholder="Masukkan fasilitas pembelajaran"
                                                bind:value={facilities[index].text} rules={[{ required: true }]} 
                                                error={errors ? errors[`facilities.${index}`] ? errors[`facilities.${index}`] : '' : '' }/>
                                            {#if facilities.length > 1}
                                            <Button classList="btn btn-no-padding" onClick={() => {
                                                facilities = facilities.filter(elm => elm.order != facility.order)
                                            }}>
                                                <div class="flex align-items-center px-2">
                                                    <X/>
                                                </div>
                                            </Button>
                                            {/if}
                                        </div>
                                        {/each}
                                        <div class="flex justify-content-center">
                                            <Button classList="btn btn-main-outline" onClick={() => {
                                                facilities[facilities.length] = {order: facilities[facilities.length-1].order + 1, text: ""}
                                            }}>
                                                <div class="flex gap-2 align-items-center">
                                                    <PlusLg/>
                                                    Tambah Fasilitas
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={title && description && facilities[0].text != "" ? false : true} classList="btn btn-main" onClick={() => active = 'Thumbnail'}>Berikutnya</Button>
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
                                    <div id="teacher-{index}" class="flex align-items-center p-3 gap-2 {teacher_id == teacher.id ? 'success-border' : 'neutral-border'} radius-md teacher-data"
                                        on:click={() => {
                                            if(!teacher_id){
                                                teacher_id = teacher.id
                                            }else{
                                                teacher_id = teacher_id == teacher.id ? null : teacher.id
                                            }
                                        }}>
                                        <PersonFill width=15 height=15 />
                                        <div class="body-small-semi-bold">{ teacher.fullname }</div>
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

<svelte:head>
    <title>Materi | Tambah Baru</title>

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