<script>
    import {page} from "$app/stores"
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
	import ProgressBar from "@components/ProgressBar.svelte";

    let course
    let user
    let handler, rows, pageNumber, rowsPerPage = 10, pageCount
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]
    let progress

    const getCourseProgressDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/progress/detail/${$page.params.id}`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                course = response.data
                progress = course.course_accesses
                handler = new DataHandler(progress, {rowsPerPage})
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

        getCourseProgressDetail()
    })
</script>

<div class="flex">
    <Sidebar active="Progres Karyawan" role="Teacher"/>
    <div class="neutral-wrapper px-3">
        <Navbar variant="inside" pageTitle="Progres Karyawan" bind:user={user}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                <div class="flex gap-2">
                    <a href="/teacher/progress" class="body-medium-semi-bold tc-neutral-disabled">Progress Karyawan</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/teacher/progress/{$page.params.id}" class="body-medium-semi-bold tc-primary-main">{ course ? course.title : '' }</a>
                </div>

                <div class="flex-column gap-3">
                    {#if $rows}
                    {#if $rows.length > 0}
                    {#each $rows as access (access.id)}
                    <div class="card radius-sm neutral-border p-standard">
                        <div class="row justify-content-between">
                            <div class="col-12 col-md-5 py-2">
                                <div class="flex-column gap-2">
                                    <p class="mb-0 body-small-medium">{access.student.info.fullname}</p>
                                    <p class="mb-0 caption-light">Telah menyelesaikan {access.student.progress} dari {course.items} item</p>
                                </div>
                            </div>
                            <div class="col-12 col-md-5">
                                <div class="flex-column h-100 justify-content-center">
                                    <ProgressBar percentage={access.student.progress == 0 ? 0 : (access.student.progress / course.items) * 100}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/each}
                    {:else}
                    <div class="flex-column h-100 gap-3 align-items-center justify-content-center">
                        Belum ada karyawan yang membeli materi ini.
                    </div>
                    {/if}
                    {/if} 
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
	<title>Progres Karyawan</title>
</svelte:head>