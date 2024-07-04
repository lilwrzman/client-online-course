<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import { extract } from "$lib/Cookie"
    import { getFlash } from "$lib/Flash";

    import Sidebar from "@components/Sidebar.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Tab from "@components/Tab.svelte"
    import Button from "@components/Button.svelte"
    import {DataHandler} from "@vincjo/datatables"
	import ApiController from "$lib/ApiController";
    import Toast from "@components/Toast.svelte";
    import Modal from "@components/Modal.svelte";
    import Spinner from "@components/Spinner.svelte";
    import SortMenu from '@components/SortMenu.svelte';
    import SearchMenu from '@components/SearchMenu.svelte';
	import checkLogin from "$lib/CheckLogin";
    import Pagination from "@components/Pagination.svelte";
    import { Copy } from "svelte-bootstrap-icons"

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

    let corporates, status = false
    let selectedCorporate

    const handleSort = (evt) => {
        sortBy = evt.target.value

        if(sortBy == 'newest'){
            handler.sortDesc('created_at')
        }else if(sortBy == 'asc'){
            handler.sortAsc('fullname')
        }else if(sortBy == 'desc'){
            handler.sortDesc('fullname')
        }
    }

    const getCorporates = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "account/get?role=Corporate Admin",
            authToken: user.token
        }).then(response => {
            corporates = response.data
            handler = new DataHandler(corporates, {rowsPerPage})
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

    const deleteCorporate = () => {
        if(!selectedCorporate){
            return
        }

        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/delete",
            data: {id: selectedCorporate.id},
            authToken: user.token
        }).then(response => {
            if(response.error){
                showSpinner = false
                return alert('Mohon coba lagi!')
            }

            if(response.status){
                getCorporates(() => {
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
        let flashes = getFlash()
        if(flashes){
            toastData = {
                title: flashes.title,
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }
        
        user = checkLogin("Superadmin")

        getCorporates()
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
                    {'title': 'Pemateri', 'href': '/superadmin/account/teacher'},
                    {'title': 'Admin Mitra', 'href': '/superadmin/account/corporate#', active: true}
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
                        <Button type="link" href="/superadmin/account/corporate/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                            <div class="flex align-items-center justify-content-center gap-2">
                                <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                                <div>Tambah Baru</div>
                            </div>
                        </Button>
                    </div>
                </div>

                <div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                    <div class="table-scroll radius-sm">
                        <table class="table number">
                            <thead>
                                <tr>
                                    <th class="text-center">No</th>
                                    <th>Perusahaan</th>
                                    <th>Email</th>
                                    <th class="text-center">Referral</th>
                                    <th>Karyawan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="table-border-bottom">
                                {#if status}
                                {#if $rows.length > 0}
                                {#each $rows as row, index}
                                <tr>
                                    <td class="text-center">{index + 1}</td>
                                    <td>{row.name}</td>
                                    <td>{row.email}</td>
                                    <td class="text-center">
                                        <div class="flex justify-content-center align-items-center gap-2">
                                            {row.referral_code}
                                            <Button classList="btn btn-no-padding" onClick={() => {
                                                navigator.clipboard.writeText(row.referral_code)
                                                toastData = {title: "Berhasil", message: "Berhasil menyalin kode referral!", color: "toast-success"}
                                                toastVisible = true
                                            }}> 
                                                <Copy/> 
                                            </Button>
                                        </div>
                                    </td>
                                    <td>{row.student_count} orang</td>
                                    <td>
                                        <Button type="link" href="/superadmin/account/corporate/{row.id}" 
                                            classList="btn btn-info py-1 px-2 w-100">Detail</Button>
                                    </td>
                                </tr>
                                {/each}
                                {:else}
                                <tr>
                                    <td colspan="9">Tidak ada data...</td>
                                </tr>
                                {/if}
                                {:else}
                                <tr>
                                    <td colspan="9">Loading...</td>
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
        </main>
    </div>
</div>

{#if modalShow}
    <Modal bind:modalShow>
        <div class="card-body gap-5">
            <div class="flex-column">
                <div class="h4">Hapus Mitra</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus mitra {selectedCorporate.name} ? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteCorporate}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => {
                    selectedCorporate = null
                    modalShow = false
                }}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>Manajemen Akun | Mitra</title>
</svelte:head>