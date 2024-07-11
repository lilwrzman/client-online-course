<script>
    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Navbar from "@components/Navbar.svelte";
	import SearchMenu from "@components/SearchMenu.svelte";
	import Sidebar from "@components/Sidebar.svelte";
	import SortMenu from "@components/SortMenu.svelte";
	import { onMount } from "svelte";
    import {DataHandler} from "@vincjo/datatables"
	import Button from "@components/Button.svelte";

    let courses
    let user
    let handler, rows, pageNumber, rowsPerPage = 10, pageCount
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]

    const getCourseProgress = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "course/progress",
            authToken: user.token
        }).then(response => {
            if(response.status){
                courses = response.data
                handler = new DataHandler(courses, {rowsPerPage})
                rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
            }
        }).catch(e => {
            let error
            console.error(error)
        })
    }

    onMount(() => {
        user = checkLogin("Teacher", true)

        getCourseProgress()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Progres Karyawan" role="Teacher" bind:isSidebarOpen={isSidebarOpen}/>
    <div class="neutral-wrapper px-3">
        <Navbar variant="inside" pageTitle="Progres Karyawan" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
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
                    <div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                        <div class="table-scroll radius-sm">
                            <table class="table number">
                                <thead>
                                    <tr>
                                        <th class="text-center">No</th>
                                        <th>Judul Materi</th>
                                        <th class="text-center">Karyawan Terdaftar</th>
                                        <th class="text-center">Materi Selesai</th>
                                        <th class="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="table-border-bottom">
                                    {#if $rows}
                                    {#if $rows.length > 0}
                                    {#each $rows as course, index (course.id)}
                                    <tr>
                                        <td class="text-center">{index + 1}</td>
                                        <td>{course.title}</td>
                                        <td class="text-center">{course.count_student}</td>
                                        <td class="text-center">{course.count_student_complete}</td>
                                        <td class="text-center">
                                            <Button type="link" href="/teacher/progress/{course.id}" 
                                                classList="btn btn-info py-1 px-2">Detail</Button>
                                        </td>
                                    </tr>
                                    {/each}
                                    {/if}
                                    {/if}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
	<title>Progres Karyawan</title>
</svelte:head>