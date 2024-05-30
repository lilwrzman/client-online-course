<script>
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation"

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import ApiController from '$lib/ApiController.js';
    import { extract } from "$lib/Cookie.js"
    import { getFlash } from '$lib/Flash';
    
    import Navbar from '@components/Navbar.svelte'
    import Button from "@components/Button.svelte";
    import Toast from '@components/Toast.svelte';
    import Sidebar from '@components/Sidebar.svelte';
    import Spinner from '@components/Spinner.svelte';
    import Modal from '@components/Modal.svelte';
    import Tab from '@components/Tab.svelte';
    import SortMenu from '@components/SortMenu.svelte';
    import SearchMenu from '@components/SearchMenu.svelte';
    
    import { DataHandler } from '@vincjo/datatables'
	import checkLogin from '$lib/CheckLogin';

    let user, handler, rows

    let students, selectedStudent
    let toastData, toastVisible = false
    let showSpinner = false
    let modalShow = false
    let status = false

    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]

    const getStudent = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "account/get?role=Student",
            authToken: user.token
        }).then(response => {
            if(response.status){
                students = response.data
                handler = new DataHandler(students)
                rows = handler.getRows()
                handler.sortDesc('created_at')
                status = true

                if(callback != null && typeof callback === 'function'){
                    callback()
                }
            }
        })
    }

    const deleteCorporate = () => {
        if(!selectedStudent){
            return
        }

        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/delete",
            data: {id: selectedStudent.id},
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
        user = checkLogin("Superadmin")
        
        let flashes = getFlash()
        if(flashes){
            toastData = {
                    title: "Sukses",
                    message: flashes.message,
                    color: `toast-${flashes.type}`
                }
            toastVisible = true
        }

        getStudent()
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
                    {'title': 'Pemateri', 'href': '/superadmin/account/teacher'},
                    {'title': 'Mitra', 'href': '/superadmin/account/corporate'},
                    {'title': 'Karyawan', 'href': '/superadmin/account/student', active: true}
                ]}/>
                <div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                    <div class="flex-column mb-3">
                        <div class="body-medium-semi-bold">Akun Karyawan</div>
                        <div class="body-small-reguler">Kelola akun-akun untuk digunakan karyawan mitra atau umum!</div>
                    </div>
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
                        <Button type="link" href="/superadmin/account/student/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                            <div class="flex align-items-center justify-content-center gap-2">
                                <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                                <div>Tambah Baru</div>
                            </div>
                        </Button>
                    </div>

                    <div class="table-scroll radius-sm">
                        <table class="table number">
                            <thead>
                                <tr>
                                    <th class="text-center">No</th>
                                    <th>Nama</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th class="text-center">Karyawan</th>
                                    <th class="text-center">Jumlah Materi</th>
                                    <th class="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="table-border-bottom">
                                {#if status}
                                {#if $rows.length > 0}
                                {#each $rows as row, index}
                                <tr>
                                    <td class="text-center">{index + 1}</td>
                                    <td>{row.fullname}</td>
                                    <td>{row.username}</td>
                                    <td>{row.email}</td>
                                    <td class="text-center">{row.type}</td>
                                    <td class="text-center">{row.course_count} materi</td>
                                    <td class="text-center">
                                        <Button classList="btn btn-info py-1 px-2"
                                            onClick={() => goto(`/superadmin/account/student/${row.id}`)}>Detail</Button>
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
                    Apakah anda yakin ingin menghapus mitra {selectedStudent.name} ? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteCorporate}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => {
                    selectedStudent = null
                    modalShow = false
                }}>Tidak</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>Manajemen Akun | Karyawan</title>
</svelte:head>