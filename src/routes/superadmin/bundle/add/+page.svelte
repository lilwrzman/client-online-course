<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { onMount } from "svelte";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"
    
	import checkLogin from "$lib/CheckLogin";
	import ApiController from "$lib/ApiController";
    import {setFlash} from "$lib/Flash"

    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Button from "@components/Button.svelte";
    import Toast from "@components/Toast.svelte";
    import Spinner from "@components/Spinner.svelte";
    import InputField from "@components/InputField.svelte"
    import {PeopleFill , CheckLg, ExclamationLg, BookFill, Coin, Hourglass} from "svelte-bootstrap-icons"

    let user
    let showSpinner = false, toastVisible = false, toastData, active = "Mitra"
    let errors

    let status = false
    let corporate, selectedCourse = [], quota, price
    let courses, corporates

    const appendCourse = (id) => {
        let temp = selectedCourse
        if (temp.includes(id)) {
            selectedCourse = temp.filter(elm => elm != id)
        } else {
            selectedCourse = [...temp, id]
        }
    }

    const getCourses = () => {
        ApiController.sendRequest({
            endpoint: 'course/get',
            method: "GET",
            authToken: user.token
        }).then(response => {
            courses = response.data.courses
            status = true
        })
    }

    const getCorporates = () => {
        ApiController.sendRequest({
            endpoint: 'account/get?role=Corporate Admin',
            method: "GET",
            authToken: user.token
        }).then(response => {
            getCourses()
            corporates = response.data
        })
    }

    const handleSubmit = () => {
        if(!corporate) {
            active = 'Mitra'
            return alert("Mohon pilih mitra yang akan diberikan akses bundel!")
        }

        if(selectedCourse.length == 0){
            active = 'Materi'
            return alert("Mohon pilih materi yang akan dimasukkan ke bundel!")
        }

        if(!price){
            active = 'Price'
            return alert("Mohon tentukan harga bundel!")
        }

        if(!quota){
            active = 'Price'
            return alert("Mohon tentukan kuota penukaran bundel!")
        }

        let courses = selectedCourse.map(elm => elm.id)
        corporate = parseInt(corporate.split(' | ')[0])

        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: 'bundle/add',
            data: { corporate, courses, price, quota },
            authToken: user.token
        }).then(response => {
            if(response.error){
                errors = response.error
                showSpinner = false
                return
            }

            if(response.status){
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/bundle' })
                return
            }else{
                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
                toastVisible = true
            }

            showSpinner = false
        })
    }

    onMount(() => {
        user = checkLogin('Superadmin')

        getCorporates()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Paket Kursus" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Paket Kursus"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex gap-2">
                    <a href="/superadmin/bundle" class="body-medium-semi-bold tc-neutral-disabled">Paket Kursus</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/bundle/add#" class="body-medium-semi-bold tc-primary-main">Tambah Baru</a>
                </div>

                {#if status}
                <div class="row">
                    <div class="col-12 col-md-4 col-xl-3 mb-3">
                        <div class="card radius-sm">
                            <div class="card-body gap-2">
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Mitra'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Mitra" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <PeopleFill width=20 height=20 color="{active == "Mitra" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Mitra" ? 'tc-primary-main' : 'tc-dark' }">Mitra</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if corporate}
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
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Harga'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Harga" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <Coin width=20 height=20 color="{active == "Harga" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Harga" ? 'tc-primary-main' : 'tc-dark' }">Harga & Kuota</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if price && quota}
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
                        {#if active == 'Mitra'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Mitra</div>
                                    <div class="body-small-reguler">Pilih perusahaan mitra yang akan diberikan akses</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField type="datalist" labelClass="body-medium-semi-bold" 
                                        option={corporates.map(elm => {
                                            return {value: elm.id, text: elm.info.name}
                                        })}
                                        label="Nama Perusahaan" id="corporate" placeholder="Masukkan nama perusahaan" bind:value={corporate}
                                        rules={[{required: true}]} error={errors ? errors.corporate ? errors.corporate : '' : ''}/>
                                </div>

                                <div class="flex-row-reverse gap-2">
                                    <Button disabled={corporate ? false : true} classList="btn btn-main" onClick={() => active = 'Materi'}>Berikutnya</Button>
                                    <Button type='link' href='/superadmin/bundle' classList="btn btn-main-outline">Batal</Button>
                                </div>
                            </div>
                        </div>

                        {:else if active == 'Materi'}
                        <div class="flex-column gap-3">
                            <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                                <div class="card-body gap-4">
                                    <div class="flex-column gap-1">
                                        <div class="body-large-semi-bold">Materi</div>
                                        <div class="body-small-reguler">Cari dan pilih materi-materi yang akan dimasukkan ke paket kursus</div>
                                    </div>

                                    <div class="flex-column gap-2">
                                        <label for="" class="body-medium-semi-bold">Nama Materi</label>
                                        {#if courses && courses.length > 0}
                                        <div class="flex-column gap-2">
                                            {#each courses as course, index}
                                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                                            <div id="course-{index}" class="flex align-items-center p-3 gap-2 course radius-md neutral-border"
                                                on:click={() => {
                                                    courses = courses.filter(elm => elm != course)
                                                    appendCourse(course)
                                                }}>
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
                                    </div>
                                </div>
                            </div>

                            {#if selectedCourse.length > 0}
                            <div class="card radius-sm" transition:fly={{ delay: 350, duration: 300, x: 100, opacity: 0, easing: quintOut }}>
                                <div class="card-body gap-4">

                                    <div class="flex-column gap-1">
                                        <div class="body-large-semi-bold">Paket Kursus</div>
                                        <div class="body-small-reguler">Klik kotak untuk membatalkan materi yang sudah dimasukkan</div>
                                    </div>

                                    <div class="row">
                                        {#each selectedCourse as c}
                                        <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                                            <div class="card radius-sm neutral-border course" on:click={() => {
                                                courses[courses.length] = c
                                                courses = courses.sort((a,b) => a.id - b.id)
                                                selectedCourse = selectedCourse.filter(elm => elm != c)
                                            }}>
                                                <div class="card-body gap-3">
                                                    <div class="w-100 position-relative">
                                                        <img src="{PUBLIC_SERVER_PATH}/storage/{c.thumbnail}" 
                                                            class="card-img-fluid radius-sm" alt="course-thumbnail"
                                                            loading="lazy">
                                                    </div>
                                                    <div class="flex-column gap-1">
                                                        <div class="body-small-medium">{c.title}</div>
                                                        <div class="flex justify-content-between">
                                                            <div class="caption-small-reguler">{c.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</div>
                                                            <div class="caption-small-reguler">{c.items} Item</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/each}
                                    </div>

                                    <div class="flex justify-content-between align-items-center">
                                        <div class="body-small-reguler">
                                            {#if courses}
                                            Materi yang dipilih: { selectedCourse.length }
                                            {/if}
                                        </div>
                                        <div class="gap-2">
                                            <Button classList="btn btn-main-outline" 
                                                onClick={() => active = 'Mitra'}>Kembali</Button>
                                            <Button classList="btn btn-main" onClick={() => active = 'Harga'}
                                                disabled={selectedCourse.length > 0 ? false : true}>
                                                Berikutnya
                                            </Button>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                            {/if}

                        </div>

                        {:else if active == 'Harga'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Harga dan Kuota</div>
                                    <div class="body-small-reguler">Masukkan harga dan kuota paket kursus</div>
                                </div>
                                
                                <div class="flex gap-2">
                                    <InputField prefix="Rp." labelClass="body-medium-semi-bold" type="number" id="price" 
                                        placeholder = "Masukkan nominal harga"
                                        label="Harga" bind:value={price} containerClass="w-100"
                                        error={errors ? errors.price ? errors.price : '' : '' }/>
                                    
                                    <InputField labelClass="body-medium-semi-bold" type="number" id="quota" 
                                        placeholder = "Masukkan kuota"
                                        label="Kuota" bind:value={quota} containerClass="w-100"
                                        error={errors ? errors.quota ? errors.quota : '' : '' }/>
                                </div>
                                
                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" onClick={handleSubmit}
                                        disabled={corporate && selectedCourse.length > 0 && price && quota ? false : true}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => active = 'Materi'}>Sebelumnya</Button>
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
    <title>Paket Kursus | Tambah Baru</title>
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

    .course {
        cursor: pointer;
    }
</style>