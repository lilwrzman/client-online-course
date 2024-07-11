<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import { onMount } from "svelte";

	import ApiController from "$lib/ApiController";
    import { getFlash } from "$lib/Flash";

    import Sidebar from "@components/Sidebar.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Button from "@components/Button.svelte";
    import Toast from "@components/Toast.svelte";
    import { Hourglass } from "svelte-bootstrap-icons";
    import {DataHandler} from "@vincjo/datatables"
    import Tab from "@components/Tab.svelte";
    import SortMenu from "@components/SortMenu.svelte";
    import SearchMenu from "@components/SearchMenu.svelte";
	import checkLogin from "$lib/CheckLogin";

    let user, courses, myCourses
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]
    let sortBy = options[0].val

    let handler, rows

    let toastData = null
    let toastVisible = false
    let status = false

    let active = 'all'

    const getCourses = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: 'course/get',
            authToken: user.token
        }).then(response => {
            if(response.data){
                courses = response.data.courses
                myCourses = response.data.my_courses

                handler = new DataHandler(courses)
                rows = handler.getRows()
                
                status = true
            }
        }).catch(e => {
            let error = r.response.data
            console.error(error)
        })
    }

    onMount(() => {
        let flashes = getFlash()
        if(flashes){
            toastData = {
                title: flashes.title,
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }
        
        user = checkLogin("Teacher")

        getCourses()
    })

    $: {
        if(active == 'all'){
            handler = new DataHandler(courses)
            rows = handler.getRows()
        }else if(active == 'some'){
            handler = new DataHandler(myCourses)
            rows = handler.getRows()
        }
    }

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Teacher" bind:isSidebarOpen={isSidebarOpen}/>
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Materi" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                <div class="flex-column gap-3">
                    <Tab bind:value={active} type="variable" menus={[
                        {title: 'Semua Materi', value: 'all'},
                        {title: 'Materi Anda', value: 'some'}
                    ]}/>
    
                    <div class="flex flex-wrap gap-3">
                        <SortMenu options={options} action={(evt) => {
                            let value = evt.target.value
                            
                            if(value == 'newest'){
                                handler.sortDesc('created_at')
                            }else if(value == 'asc'){
                                handler.sortAsc('title')
                            }else if(value == 'desc'){
                                handler.sortDesc('title')
                            }else{
                                handler.sort('id')
                            }
                        }}/>
                        <SearchMenu action={(evt) => handler.search(evt.target.value, ['title'])} />
                    </div>
                </div>

                {#if !status}
                <div class="flex justify-content-center align-items-center h-100">
                    <div class="flex-column align-items-center justify-content-center gap-3">
                        <Hourglass width=60 height=60 color="#3951A8"/>
                        <div class="caption-reguler tc-neutral-disabled">Memuat Data...</div>
                    </div>
                </div>
                {:else}
                {#if $rows.length > 0}
                <div class="row">
                    {#each $rows as course, index (course.id)}
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                        <div class="card radius-sm">
                            <div class="card-body">
                                <div class="w-100 position-relative">
                                    <img src="{PUBLIC_SERVER_PATH}/storage/{course.thumbnail}" 
                                        class="card-img-fluid radius-sm" alt="course-thumbnail"
                                        loading="lazy">
                                </div>
                                {#if course.learning_path}
                                <p class="label-bullet body-small-medium" style="color: {course.learning_path.color};">{course.learning_path.title}</p>
                                {:else}
                                <p class="label-bullet body-small-medium">Belum ada alur belajar</p>
                                {/if}
                                <div class="flex-column gap-1">
                                    <div class="body-small-medium">{course.title}</div>
                                    <div class="flex justify-content-between">
                                        <div class="caption-small-reguler">{course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})}</div>
                                        <div class="caption-small-reguler">{course.items} Item</div>
                                    </div>
                                </div>
                                <Button type="link" href="/teacher/course/{course.id}" classList="btn btn-main radius-sm">Lihat Detail</Button>
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
</svelte:head>

<style>
    .card-img-fluid {
        object-fit: cover;
        object-position: center;
        aspect-ratio: 4/3;
    }
</style>