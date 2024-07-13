<script>
    import { onMount } from "svelte"

    import checkLogin from "$lib/CheckLogin";
    import { getFlash } from "$lib/Flash";

    import Navbar from "@components/Navbar.svelte"
    import Sidebar from "@components/Sidebar.svelte"
    import Button from "@components/Button.svelte"
    import SearchMenu from "@components/SearchMenu.svelte"
    import SortMenu from "@components/SortMenu.svelte"
    import Toast from "@components/Toast.svelte"
    import Pagination from "@components/Pagination.svelte";
    import { DataHandler } from "@vincjo/datatables"
	import ApiController from "$lib/ApiController";
    import { Copy } from "svelte-bootstrap-icons";

    let user

    let toastVisible = false, toastData
    let handler, row, pageNumber, rowsPerPage = 5, bundles, status = false

    const getBundles = () => {
        ApiController.sendRequest({
            endpoint: "bundle/get",
            method: "GET",
            authToken: user.token
        }).then(response => {
            bundles = response.data
            handler = new DataHandler(bundles, {rowsPerPage})
            row = handler.getRows()
            pageNumber = handler.getPageNumber()
            status = true
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

        getBundles()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Paket Kursus" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Paket Kursus"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1;" class="flex-column">
            <div class="container flex-column py-4 gap-8" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                <div class="flex-column gap-3">
                    <div class="flex justify-content-between align-items-center">
                        <div class="flex gap-2">
                            <SortMenu />
                            <SearchMenu action={(evt) => handler.search(evt.target.value, ['bundle_code'])}/>
                        </div>
                        <Button type="link" href="/superadmin/bundle/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                            <div class="flex align-items-center justify-content-center gap-2">
                                <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                                <div>Tambah Baru</div>
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
                                            <th>Kode Paket</th>
                                            <th class="text-center">Isi Materi</th>
                                            <th>Harga</th>
                                            <th class="text-center">Kode Tukar</th>
                                            <th class="text-center">Penukaran</th>
                                            <th class="text-center">Limit</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-border-bottom">
                                        {#if status}
                                        {#if $row.length > 0}
                                        {#each $row as bundle, index}
                                        <tr>
                                            <td class="text-center">{$pageNumber === 1 ? index + 1 : rowsPerPage * ($pageNumber - 1) + (index + 1)}</td>
                                            <td>{bundle.bundle_code}</td>
                                            <td class="text-center">{bundle.bundle_items.length}</td>
                                            <td>{bundle.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</td>
                                            <td class="text-center">
                                                <div class="flex align-items-center justify-content-evenly">
                                                    <p>{bundle.redeem_code.code}</p>
                                                    <Button onClick={() => {
                                                        navigator.clipboard.writeText(bundle.redeem_code.code)
                                                        toastData = {
                                                            title: "Berhasil",
                                                            message: "Kode penukaran berhasil disalin!",
                                                            color: `toast-success`
                                                        }
                                                        toastVisible = true
                                                    }}
                                                        classList="btn btn-no-padding">
                                                        <Copy/>
                                                    </Button>
                                                </div>
                                            </td>
                                            <td class="text-center">{bundle.redeem_code.redeem_history.length}</td>
                                            <td class="text-center">{bundle.quota}x</td>
                                            <td>
                                                <Button type="link" href="/superadmin/bundle/{bundle.id}" classList="btn btn-info py-1 px-2 w-100">Detail</Button>
                                            </td>
                                        </tr>
                                        {/each}
                                        {:else}
                                        <tr>
                                            <td class="text-center" colspan="8">Data tidak ditemukan</td>
                                        </tr>
                                        {/if}
                                        {/if}
                                    </tbody>
                                </table>
                            </div>
                            {#if status}
                            <Pagination {handler} />
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Paket Kursus</title>
</svelte:head>