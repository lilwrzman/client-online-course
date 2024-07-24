<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { onMount } from "svelte";
    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"
    
	import checkLogin from "$lib/CheckLogin";
	import ApiController from "$lib/ApiController.js";
    import { getDay } from "$lib/Date"

    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Button from "@components/Button.svelte";
    import Toast from "@components/Toast.svelte";
    import Spinner from "@components/Spinner.svelte";
    import InputField from "@components/InputField.svelte"
    import Modal from "@components/Modal.svelte"
    import {Copy, UnlockFill, LockFill, SquareFill} from "svelte-bootstrap-icons"

    // Get params data from URL
    export let data
    let id

    let user
    let active = "Mitra"

    let errors

    // Variables for Toast Components
    let toastVisible = false
    let toastData
    
    // State
    let showSpinner = false
    let modalShow = false
    let status = false

    let detail
    let price
    let quota

    // Higher Order Function
    const getDetail = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `bundle/get/${id}`,
            authToken: user.token
        }).then(response => {
            console.log(response.data)
            detail = response.data
            price = detail.price
            quota = detail.quota
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    }

    const toggleAccess = () => {
        showSpinner = true
        ApiController.sendRequest({
            endpoint: `bundle/${id}/change-access`,
            method: "POST",
            authToken: user.token
        }).then(response => {
            if(response.status) {
                detail.is_active = !detail.is_active
                toastData = {title: "Berhasil", message: response.message, color: "toast-success"}
                toastVisible = true
                modalShow = false
                showSpinner = false
            }
        })
    }

    const handleSubmit = () => {
        if(!price){
            active = 'Price'
            return alert("Mohon tentukan harga bundel!")
        }

        if(!quota){
            active = 'Price'
            return alert("Mohon tentukan kuota penukaran bundel!")
        }

        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: 'bundle/update',
            data: { id, price, quota },
            authToken: user.token
        }).then(response => {
            if(response.error){
                errors = response.error
                showSpinner = false
                return
            }

            if(response.status) {
                detail.price = price
                detail.quota = quota
                
                toastData = {
                    title: "Berhasil",
                    message: response.message,
                    color: 'toast-success'
                }
            }else{
                price = detail.price
                quota = detail.quota

                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
            }

            showSpinner = false
            toastVisible = true     
        })
    }

    onMount(() => {
        id = data.id
        user = checkLogin('Superadmin')

        getDetail()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Paket Kursus" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Paket Kursus"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                {#if status}
                <div class="flex gap-2">
                    <a href="/superadmin/bundle" class="body-medium-semi-bold tc-neutral-disabled">Paket Kursus</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/bundle/{id}#" class="body-medium-semi-bold tc-primary-main">{detail.bundle_code}</a>
                </div>

                <div class="flex-column gap-4">
                    <div class="row">
                        <div class="col-12 col-md-8">
                            <div class="flex-column gap-4">
                                <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                                    <div class="card-body gap-4">
                                        <div class="flex-column gap-1">
                                            <div class="body-large-semi-bold">Informasi Paket Kursus</div>
                                            <div class="body-small-reguler">Atur informasi detail sesuai dengan kebutuhan</div>
                                        </div>
        
                                        <div class="flex-column gap-3">
                                            <div class="flex gap-2">
                                                <InputField disabled={true} containerClass="w-100" labelClass="body-medium-semi-bold"
                                                    label="Nama Perusahaan" id="corporate" value={detail.corporate.info.name}/>
                                                <InputField disabled={true} containerClass="w-100" labelClass="body-medium-semi-bold"
                                                    label="Kode Paket" id="bundle-code" value={detail.bundle_code}/>
                                            </div>
        
                                            <div class="flex gap-2">
                                                <InputField prefix="Rp." labelClass="body-medium-semi-bold" type="number" id="price" 
                                                    placeholder = "Masukkan nominal harga"
                                                    label="Harga" bind:value={price} containerClass="w-100"
                                                    error={errors ? errors.price ? errors.price : '' : '' }/>
                                                
                                                <InputField labelClass="body-medium-semi-bold" type="number" id="quota" 
                                                    placeholder = "Masukkan quota penukaran bundel"
                                                    label="Limit Penukaran" bind:value={quota} containerClass="w-100"
                                                    error={errors ? errors.quota ? errors.quota : '' : '' }/>
                                            </div>
                                        </div>
        
                                        {#if price != detail.price || quota != detail.quota}
                                        <div class="flex-row-reverse gap-2">
                                            <Button classList="btn btn-main" onClick={handleSubmit}>Simpan Perubahan</Button>
                                            <Button classList="btn btn-main-outline" onClick={() => {
                                                price = detail.price
                                                quota = detail.quota
                                            }}>Batal</Button>
                                        </div>
                                        {/if}
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div class="col-12 col-md-4" transition:fly={{ delay: 350, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="flex-column gap-4">
                                <Button classList="btn w-100 { detail.is_active ? "btn-warning" : "btn-main"}" onClick={() => modalShow = true}>
                                    <div class="flex gap-2 align-items-center justify-content-center">
                                        {#if detail.is_active}
                                        <LockFill/>
                                        Non-Aktifkan
                                        {:else}
                                        <UnlockFill/>
                                        Aktifkan
                                        {/if}
                                    </div>
                                </Button>
                                <div class="card border-sm">
                                    <div class="card-body">
                                        <div class="flex-column gap-1">
                                            <div class="body-small-reguler">Jumlah Penukaran</div> 
                                            <div class="body-medium-semi-bold">{detail.redeem_code.redeem_history.length} kali</div>
                                        </div>
                                        <div class="flex justify-content-between align-items-center">
                                            <div class="flex-column gap-1">
                                                <div class="body-small-reguler">Kode Tukar</div> 
                                                <div class="body-medium-semi-bold">{detail.redeem_code.code}</div>
                                            </div>
                                            <Button classList="btn btn-no-padding" onClick={() => {
                                                navigator.clipboard.writeText(detail.redeem_code.code)
                                                toastData = {title: "Berhasil", message: "Berhasil menyalin kode tukar ke Clipboard!", color: "toast-success"}
                                                toastVisible = true
                                            }}>
                                                <Copy/>
                                            </Button>
                                        </div>
                                        <div class="flex-column gap-1">
                                            <div class="body-small-reguler">Status Paket</div> 
                                            <div class="flex justify-content-between align-items-center">
                                                <div class="body-medium-semi-bold">{detail.is_active ? 'Aktif' : 'Non-Aktif'} </div>
                                                <SquareFill color={detail.is_active ? '#2ECC71' : '#E74C3C'}/>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div class="card radius-sm" transition:fly={{ delay: 650, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                                <div class="card-body gap-4">
                                    <div class="flex-column gap-1">
                                        <div class="body-large-semi-bold">Riwayat Penukaran</div>
                                        <div class="body-small-reguler">Berikut riwayat penukaran paket kursus</div>
                                    </div>
    
                                    <div class="table-responsive radius-sm">
                                        <table class="table number">
                                            <thead>
                                                <tr>
                                                    <th class="text-center">No</th>
                                                    <th>Nama</th>
                                                    <th class="text-center">Tanggal Tukar</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-border-bottom">
                                                {#if detail.redeem_code.redeem_history.length > 0}
                                                {#each detail.redeem_code.redeem_history as history, index}
                                                <tr>
                                                    <td class="text-center">{index + 1}</td>
                                                    <td>{history.owner.info.fullname}</td>
                                                    <td class="text-center">{getDay(history.created_at)}</td>
                                                </tr>
                                                {/each}
                                                {:else}
                                                <tr>
                                                    <td colspan="3" class="text-center">Belum ada penukaran</td>
                                                </tr>
                                                {/if}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="card radius-sm">
                                <div class="card-body gap-4">
                                    <div class="flex-column gap-1">
                                        <div class="body-large-semi-bold">Paket Kursus</div>
                                        <div class="body-small-reguler">Berikut materi pada paket!</div>
                                    </div>
    
                                    <div class="row">
                                        {#each detail.bundle_items as item}
                                        <div class="col-md-4 col-sm-6 col-12">
                                            <div class="card radius-sm neutral-border course">
                                                <div class="card-body gap-3">
                                                    <div class="w-100 position-relative">
                                                        <img src="{PUBLIC_SERVER_PATH}/storage/{item.course.thumbnail}" 
                                                            class="card-img-fluid radius-sm" alt="course-thumbnail"
                                                            loading="lazy">
                                                    </div>
                                                    <div class="flex-column gap-1">
                                                        <div class="body-small-medium">{item.course.title}</div>
                                                        <div class="flex justify-content-between">
                                                            <div class="caption-small-reguler">{item.course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</div>
                                                            <div class="caption-small-reguler">{item.course.items} Item</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </main>
    </div>
</div>

{#if modalShow}
    <Modal bind:modalShow>
        <div class="card-body gap-5">
            {#if detail.is_active}
            <div class="flex-column">
                <div class="h4">Non-aktifkan Bundel</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin non-aktifkan Bundel {detail.bundle_code}? Apabila non-aktif, maka bundel tidak dapat ditukar!.
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-main" onClick={toggleAccess}>Ya, non-aktifkan!</Button>
                <Button classList="btn btn-main-outline" onClick={() => modalShow = false}>Tidak</Button>
            </div>
            {:else}
            <div class="flex-column">
                <div class="h4">Aktifkan Bundel</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin aktifkan akses Bundel {detail.bundle_code}? Apabila aktif, maka bundel dapat ditukar kembali!.
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-main" onClick={toggleAccess}>Ya, aktifkan!</Button>
                <Button classList="btn btn-main-outline" onClick={() => modalShow = false}>Tidak</Button>
            </div>
            {/if}
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>Paket Kursus | Tambah Baru</title>
</svelte:head>

<style>
    .course {
        cursor: pointer;
    }
</style>