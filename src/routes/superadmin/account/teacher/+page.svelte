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

    let user
    let handler, rows, pageNumber, rowsPerPage = 10, pageCount
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]

    let toastData = null
    let toastVisible = false
    let modalShow = false
    let showSpinner = false

    let teachers, status = false
    let selectedTeacher

    const getTeachers = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "account/get?role=Teacher",
            authToken: user.token
        }).then(response => {
            teachers = response.data
            handler = new DataHandler(teachers, {rowsPerPage})
            rows = handler.getRows()
            pageCount = handler.getPageCount()
            pageNumber = handler.getPageNumber()
            handler.sortDesc('created_at')
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    }

    const deleteTeacher = () => {
        if(!selectedTeacher){
            return
        }

        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/delete",
            data: {id: selectedTeacher.id},
            authToken: user.token
        }).then(response => {
            if(response.error){
                showSpinner = false
                return alert('Mohon coba lagi!')
            }

            if(response.status){
                getTeachers(() => {
                    toastData = {
                        title: "Berhasil",
                        message: response.message,
                        color: 'toast-success'
                    }
                    modalShow = false
                    showSpinner = false
                    toastVisible = true
                })
            }else{
                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
                modalShow = false
                showSpinner = false
                toastVisible = true
            }
        })
    }

    onMount(() => {
        user = checkLogin('Superadmin')
        
        let flashes = getFlash()
        if(flashes){
            toastData = {
                title: flashes.title,
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }

        getTeachers()
    })
</script>

<div class="flex">
    <Sidebar active="Manajemen Akun" role="Superadmin" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Akun" bind:user={user}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <Tab menus={[
                    {'title': 'Karyawan', 'href': '/superadmin/account/student'},
                    {'title': 'Pemateri', 'href': '/superadmin/account/teacher#', active: true},
                    {'title': 'Admin Mitra', 'href': '/superadmin/account/corporate'}
                ]}/>

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
                        <Button type="link" href="/superadmin/account/teacher/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
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
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Jumlah Materi</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="table-border-bottom">
                                    {#if status}
                                    {#if $rows.length > 0}
                                    {#each $rows as row, index}
                                    <tr>
                                        <td class="text-center">{index + 1}</td>
                                        <td>{row.fullname}</td>
                                        <td>{row.email}</td>
                                        <td>{row.course_count} materi</td>
                                        <td>
                                            <Button type="link" href="/superadmin/account/teacher/{row.id}" 
                                                classList="btn btn-info py-1 px-2 w-100">Detail</Button>
                                        </td>
                                    </tr>
                                    {/each}
                                    {:else}
                                    <tr>
                                        <td colspan="5">Tidak ada data...</td>
                                    </tr>
                                    {/if}
                                    {:else}
                                    <tr>
                                        <td colspan="5">Loading...</td>
                                    </tr>
                                    {/if}
                                </tbody>
                            </table>
                        </div>
                        {#if status && handler && $pageCount > 1}
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