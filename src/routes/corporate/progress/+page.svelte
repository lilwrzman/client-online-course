<script>
	import { onMount } from "svelte";
    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"
    
	import checkLogin from "$lib/CheckLogin";
    import ApiController from "$lib/ApiController"

    import Sidebar from "@components/Sidebar.svelte";   
    import Navbar from "@components/Navbar.svelte";
    import SortMenu from "@components/SortMenu.svelte"
    import SearchMenu from "@components/SearchMenu.svelte"
    import Button from "@components/Button.svelte"
    import {DataHandler} from "@vincjo/datatables"

    let user
    let handler, rows, pageNumber, rowsPerPage = 10, pageCount
    let status = false
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]

    const getList = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "corporate/progress",
            authToken: user.token
        }).then(response => {
            if(response.status){
                handler = new DataHandler(response.data, {rowsPerPage})
                rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
                status = true
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    onMount(() => {
        user = checkLogin("Corporate Admin", true)
        getList()
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

                    <div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                        <div class="table-scroll radius-sm">
                            <table class="table number">
                                <thead>
                                    <tr>
                                        <th class="text-center">No</th>
                                        <th>Nama Karyawan</th>
                                        <th class="text-center">Total Materi</th>
                                        <th class="text-center">Materi Selesai</th>
                                        <th class="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="table-border-bottom">
                                    {#if status}
                                    {#if $rows.length > 0 }
                                    {#each $rows as row, index (row.id)}
                                    <tr>
                                        <td class="text-center">{index + 1}</td>
                                        <td>{row.info.fullname}</td>
                                        <td class="text-center">{row.accessed_courses}</td>
                                        <td class="text-center">{row.completed_courses}</td>
                                        <td class="text-center">
                                            <Button type="link" href="/corporate/progress/{row.id}" 
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