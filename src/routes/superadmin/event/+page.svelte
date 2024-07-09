<script>
    import { onMount } from "svelte";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import { getFlash } from "$lib/Flash";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";

    import { DataHandler } from "@vincjo/datatables"
    
    import Sidebar from "@components/Sidebar.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Tab from "@components/Tab.svelte"
    import Button from "@components/Button.svelte"
    import Toast from "@components/Toast.svelte";
    import Modal from "@components/Modal.svelte";
    import Spinner from "@components/Spinner.svelte";
    import SortMenu from "@components/SortMenu.svelte";
    import SearchMenu from "@components/SearchMenu.svelte";
    import Pagination from '@components/Pagination.svelte';
	import { getDay } from "$lib/Date";

    let user
    let handler, rows, pageNumber, rowsPerPage = 10, pageCount
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]

    let events
    let toastData = null
    let toastVisible = false
    let modalShow = false
    let showSpinner = false

    const getEvents = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "events/get"
        }).then(response => {
            if(response.status){
                events = response.data
                handler = new DataHandler(events, {rowsPerPage})
                rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
                handler.sortDesc('created_at')
            }
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
        
        user = checkLogin('Superadmin', true)
        getEvents()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Manajemen Acara" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Acara" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex-column gap-3">
                    <div class="flex flex-wrap justify-content-between align-items-center gap-4">
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
                        <Button type="link" href="/superadmin/event/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                            <div class="flex align-items-center justify-content-center gap-2">
                                <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                                <div>Tambah Baru</div>
                            </div>
                        </Button>
                    </div>

                    <div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                        <div class="table-responsive radius-sm">
                            <table class="table number">
                                <thead>
                                    <tr>
                                        <th class="text-center">No</th>
                                        <th>Nama Acara</th>
                                        <th>Tempat</th>
                                        <th class="text-center">Tanggal</th>
                                        <th class="text-center">Waktu</th>
                                        <th class="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="table-border-bottom">
                                    {#if $rows}
                                    {#if $rows.length > 0}
                                    {#each $rows as event, index (event.id)}
                                    <tr>
                                        <td class="text-center">{index + 1}</td>
                                        <td>{event.title}</td>
                                        <td>{event.place}</td>
                                        <td class="text-center">{getDay(event.date)}</td>
                                        <td class="text-center">{event.start.substring(0, 5)} - {event.end.substring(0, 5)}</td>
                                        <td class="text-center">
                                            <Button type="link" href="/superadmin/event/{event.id}" 
                                                classList="btn btn-info py-1 px-2 w-100">Detail</Button>
                                        </td>
                                    </tr>
                                    {/each}
                                    {:else}
                                    <tr>
                                        <td colspan="6">Tidak ada data...</td>
                                    </tr>
                                    {/if}
                                    {:else}
                                    <tr>
                                        <td colspan="6">Loading...</td>
                                    </tr>
                                    {/if}
                                </tbody>
                            </table>
                        </div>
                        {#if handler && $pageCount > 1}
                        <Pagination {handler} />
                        {/if}
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

{#if modalShow}
    <Modal bind:modalShow>
        <div class="card-body gap-5">
            <div class="flex-column">
                <div class="h4">Hapus Pemateri</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus pemateri ? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteTeacher}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => {
                    selectedTeacher = null
                    modalShow = false
                }}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>Manajemen Akun | Pemateri</title>
</svelte:head>