<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	import ApiController from "$lib/ApiController";
	import { extract } from "$lib/Cookie";
    import { getFlash } from "$lib/Flash";

    import Sidebar from "@components/Sidebar.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Button from "@components/Button.svelte";
    import InputField from "@components/InputField.svelte";
    import Toast from "@components/Toast.svelte";
    import { PlusLg, Hourglass, ThreeDotsVertical } from "svelte-bootstrap-icons";
    import {DataHandler} from "@vincjo/datatables"
	import checkLogin from "$lib/CheckLogin";

    let user, courses
    let option = [
        {value: "newest", text:"Terbaru"}, 
        {value: "asc", text: 'A-Z'}, 
        {value: "desc", text: "Z-A"}
    ]
    let sortBy = option[0].value

    let handler, rows

    let toastData = null
    let toastVisible = false

    const handleSort = (evt) => {
        sortBy = evt.target.value

        if(sortBy == 'newest'){
            handler.sortDesc('created_at')
        }else if(sortBy == 'asc'){
            handler.sortAsc('title')
        }else if(sortBy == 'desc'){
            handler.sortDesc('title')
        }
    }

    const getCourses = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: 'course/get',
        }).then(response => {
            if(response.data){
                courses = response.data.courses
                handler = new DataHandler(courses)
                rows = handler.getRows()
                handler.sortDesc('created_at')
            }
        })
    }

    onMount(() => {
        user = checkLogin('Superadmin')
        
        let flashes = getFlash()
        if(flashes){
            toastData = {
                title: "Sukses",
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }

        getCourses()
    })
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Superadmin" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Bank Kursus" bind:user={user}/>
        <main style="flex-grow: 1;" class="flex-column">
            <div class="container flex-column py-4 gap-8" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                <div class="flex flex-wrap justify-content-between align-items-center gap-4">
                    <div class="flex flex-wrap gap-3 grow-item">
                        <InputField type="select-option" id="select-default" 
                            containerClass="grow-item grow-auto-md"   
                            inputClass="input-bg-light pr-8" 
                            onInput={handleSort}
                            value={sortBy} option={option}/>
                        <InputField type="search" id="search" placeholder="Search..." 
                            containerClass="grow-item grow-auto-md"   
                            inputClass="input-bg-light"/>
                    </div>
                    <Button type="link" href="/superadmin/course/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                        <div class="flex align-items-center justify-content-center gap-2">
                            <!-- <PlusLg/> -->
                            <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                            <div>Tambah Baru</div>
                        </div>
                    </Button>
                </div>
                {#if !$rows}
                <div class="flex justify-content-center align-items-center h-100">
                    <div class="flex-column align-items-center justify-content-center gap-3">
                        <Hourglass width=60 height=60 color="#3951A8"/>
                        <div class="caption-reguler tc-neutral-disabled">Memuat Data...</div>
                    </div>
                </div>
                {:else}
                {#if $rows.length > 0}
                <div class="row">
                    {#each $rows as course, index}
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                        <div class="card radius-sm">
                            <div class="card-body gap-3">
                                <div class="w-100 position-relative">
                                    <img src="http://127.0.0.1:8000/storage/{course.thumbnail}" 
                                        class="card-img-fluid radius-sm" alt="course-thumbnail"
                                        loading="lazy">
                                </div>
                                <p class="label-bullet body-small-medium" style="color: {course.learning_path.color};">{course.learning_path.title}</p>
                                <div class="flex-column gap-1">
                                    <div class="body-small-medium">{course.title}</div>
                                    <div class="flex justify-content-between">
                                        <div class="caption-small-reguler">{course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})}</div>
                                        <div class="caption-small-reguler">{course.items} Item</div>
                                    </div>
                                </div>
                                <Button type="link" href="/superadmin/course/{course.slug}" classList="btn btn-main radius-sm">Lihat Detail</Button>
                            </div>
                        </div>
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
            </div> 
        </main>
    </div>  
</div>

<svelte:head>
    <title>Materi</title>

    <style>
        .card-img-fluid {
            aspect-ratio: 4/3;
        }
    </style>
</svelte:head>