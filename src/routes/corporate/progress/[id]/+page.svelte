<script>
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import Sidebar from "@components/Sidebar.svelte";
	import Navbar from "@components/Navbar.svelte";
	import Button from "@components/Button.svelte";
	import ProgressBar from "@components/ProgressBar.svelte";
	import SortMenu from "@components/SortMenu.svelte";
	import SearchMenu from "@components/SearchMenu.svelte";
	import { DataHandler } from "@vincjo/datatables";

    let user
    let courses
    let student

    let handler, rows, pageNumber, rowsPerPage = 10, pageCount
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]

    const getProgress = () => {
        ApiController.sendRequest({
            endpoint: `corporate/progress/${$page.params.id}`,
            method: "GET",
            authToken: user.token
        }).then(response => {
            if(response.status){
                courses = response.data.courses
                student = response.data.student
                
                handler = new DataHandler(courses, {rowsPerPage})
                rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    onMount(() => {
        user = checkLogin("Corporate Admin", true)

        getProgress()
    })
</script>

<div class="flex">
    <Sidebar active="Progres Karyawan" role="Corporate Admin"/>
    <div class="neutral-wrapper px-3">
        <Navbar variant="inside" pageTitle="Progres Karyawan" bind:user={user}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                <div class="flex-column gap-3">
                    <div class="flex flex-wrap gap-3 grow-item">
                        <SortMenu options={options} action={(evt) => {
                            let sortBy = evt.target.value

                            if(sortBy == 'newest'){
                                handler.sortDesc('created_at')
                            }else if(sortBy == 'asc'){
                                handler.sortAsc('fullname')
                            }else if(sortBy == 'desc'){
                                handler.sortDesc('fullname')
                            }else{
                                handler.sort('id')
                            }
                        }}/>

                        <SearchMenu action={(evt) => handler.search(evt.target.value, ['fullname'])}/>
                    </div>
                    
                    {#if $rows}
                    {#if $rows.length > 0}
                    {#each $rows as course (course.id)}
                    <div class="card radius-sm neutral-border p-standard">
                        <div class="row justify-content-between">
                            <div class="col-12 col-md-5 py-2">
                                <div class="flex-column gap-2">
                                    <p class="mb-0 body-small-medium">{course.course.title}</p>
                                    <p class="mb-0 caption-light">Telah menyelesaikan {course.completed_items} dari {course.total_items} item</p>
                                </div>
                            </div>
                            <div class="col-12 col-md-5">
                                <div class="flex-column h-100 justify-content-center">
                                    <ProgressBar percentage={course.completed_items == 0 ? 0 : (course.completed_items / course.total_items) * 100}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/each}
                    {:else}
                    <div class="flex-column h-100 gap-3 align-items-center justify-content-center">
                        Karyawan ini belum memiliki materi apapun. Tidak ada progres yang ditampilkan.
                    </div>
                    {/if}
                    {/if} 
                </div>
            </div>
        </main>
    </div>
</div>