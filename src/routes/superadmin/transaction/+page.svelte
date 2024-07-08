<script>
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Navbar from "@components/Navbar.svelte";
	import SearchMenu from "@components/SearchMenu.svelte";
	import Sidebar from "@components/Sidebar.svelte";
	import SortMenu from "@components/SortMenu.svelte";
	import Toast from "@components/Toast.svelte";
	import { onMount } from "svelte";
    import { DataHandler } from "@vincjo/datatables"
	import { getDay } from "$lib/Date";
	import Button from "@components/Button.svelte";
	import { BoxArrowInRight } from "svelte-bootstrap-icons";
    import Pagination from "@components/Pagination.svelte";
    import Spinner from "@components/Spinner.svelte"

    let user

    let toastVisible = false
    let toastData

    let histories
    let handler, rows, pageNumber, rowsPerPage = 10, bundles, pageCount
    let showSpinner = false

    let options = [
        {val: "newest", label:"Terbaru"},
        {val: "oldest", label:"Terlama"},
        {val: "priciest", label:"Termahal"},
        {val: "cheapest", label:"Termurah"},
        {val: "asc", label: 'Materi A-Z'}, 
        {val: "desc", label: "Materi Z-A"},
    ]

    const getTransaction = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "transaction/histories",
            authToken: user.token
        }).then(response => {
            if(response.status){
                histories = response.data
                handler = new DataHandler(histories, {rowsPerPage})
                handler.sortDesc('created_at')
                rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    const getExport = () => {
        showSpinner = true
        ApiController.sendRequest({
            method: "GET",
            endpoint: "transaction/export",
            authToken: user.token,
            responseType: 'blob'
        }).then(response => {
            if(response){
                showSpinner = false
                const url = window.URL.createObjectURL(new Blob([response]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'transactions.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                toastData = {
                    title: "Berhasil",
                    message: "Data transaksi berhasil di ekspor. Tunggu proses unduh selesai",
                    color: 'toast-success'
                }
                toastVisible = true
            }
        }).catch(e => {
            let error = e.response.data
            showSpinner = false
            console.error(error)
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin", true)

        getTransaction()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Transaksi" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Transaksi" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1;" class="flex-column">
            <div class="container flex-column py-4 gap-8" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex-column gap-3">
                    <div class="flex justify-content-between align-items-center">
                        <div class="flex gap-2">
                            <SortMenu options={options} action={(evt) => {
                                let sortBy = evt.target.value

                                if(sortBy == 'newest'){
                                    handler.sortDesc('created_at')
                                }else if(sortBy == 'oldest'){
                                    handler.sortAsc('created_at')
                                }else if(sortBy == 'asc'){
                                    let temp = histories
                                    temp = temp.sort((a, b) => {
                                        let tA = a.course.title.toLowerCase()
                                        let tB = b.course.title.toLowerCase()

                                        if(tA < tB) return -1
                                        if(tA > tB) return 1
                                        return 0
                                    })
                                    handler = new DataHandler(temp, {rowsPerPage})
                                    rows = handler.getRows()
                                }else if(sortBy == 'desc'){
                                    let temp = histories
                                    temp = temp.sort((a, b) => {
                                        let tA = a.course.title.toLowerCase()
                                        let tB = b.course.title.toLowerCase()

                                        if(tA > tB) return -1
                                        if(tA < tB) return 1
                                        return 0
                                    })
                                    handler = new DataHandler(temp, {rowsPerPage})
                                    rows = handler.getRows()
                                }else if(sortBy == 'priciest'){
                                    handler.sortDesc('price')
                                }else if(sortBy == 'cheapest'){
                                    handler.sortAsc('price')
                                }else{
                                    handler.sort('id')
                                }

                                console.log($rows)
                            }}/>
                            <SearchMenu action={(evt) => handler.search(evt.target.value, ['bundle_code'])}/>
                        </div>
                        <Button classList="btn btn-main" onClick={getExport}>
                            <div class="flex gap-2 align-items-center justify-content-center">
                                <BoxArrowInRight/>
                                Ekspor Data
                            </div>
                        </Button>
                    </div>

                    <div class="card radius-sm">
                        <div class="card-body">
                            <div class="table-responsive radius-sm">
                                <table class="table number">
                                    <thead>
                                        <tr>
                                            <th class="text-center">No</th>
                                            <th class="text-center">Waktu Pembelian</th>
                                            <th>Nama Karyawan</th>
                                            <th>Nama Materi</th>
                                            <th>Harga</th>
                                            <th class="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-border-bottom">
                                    {#if $rows}
                                    {#if $rows.length > 0}
                                    {#each $rows as r, index (r.id)}
                                    <tr>
                                        <td class="text-center">{index + 1}</td>
                                        <td class="text-center">{getDay(r.created_at)}</td>
                                        <td>{r.student.info.fullname}</td>
                                        <td>{r.course.title}</td>
                                        <td>{r.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</td>
                                        <td>
                                            {#if r.status == 'success'}
                                            <div class="badge badge-success">SUKSES</div>
                                            {:else}
                                            <div class="badge badge-danger">GAGAL</div>
                                            {/if}
                                        </td>
                                    </tr>
                                    {/each}
                                    {/if}
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
            </div>
        </main>
    </div>
</div>

<style>
    .badge {
        padding: .5rem;
        border-radius: .25rem;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        text-align: center;
    }

    .badge-success {
        background-color: var(--success-focus);
        color: var(--success-main);
    }

    .badge-danger {
        background-color: var(--danger-focus);
        color: var(--danger-main);
    }
</style>

<svelte:head>
    <title>Transaksi</title>
</svelte:head>