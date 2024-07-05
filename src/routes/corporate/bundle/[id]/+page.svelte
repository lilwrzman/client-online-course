<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { onMount } from "svelte";
    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"
    import { page } from "$app/stores"
    
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
    import {Copy, SquareFill} from "svelte-bootstrap-icons"

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
            endpoint: `bundle/get/${$page.params.id}`,
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

    onMount(() => {
        user = checkLogin('Corporate Admin', true)

        getDetail()
    })

</script>

<div class="flex">
    <Sidebar active="Paket Kursus" role="Corporate Admin" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Paket Kursus" bind:user={user}/>
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
                    <a href="/corporate/bundle" class="body-medium-semi-bold tc-neutral-disabled">Paket Kursus</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/corporate/bundle/{$page.params.id}#" class="body-medium-semi-bold tc-primary-main">{detail.bundle_code}</a>
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
                                                <InputField disabled={true} prefix="Rp." labelClass="body-medium-semi-bold" type="number" id="price" 
                                                    placeholder = "Masukkan nominal harga"
                                                    label="Harga" bind:value={price} containerClass="w-100"
                                                    error={errors ? errors.price ? errors.price : '' : '' }/>
                                                
                                                <InputField disabled={true} labelClass="body-medium-semi-bold" type="number" id="quota" 
                                                    placeholder = "Masukkan quota penukaran bundel"
                                                    label="Limit Penukaran" bind:value={quota} containerClass="w-100"
                                                    error={errors ? errors.quota ? errors.quota : '' : '' }/>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div class="col-12 col-md-4" transition:fly={{ delay: 350, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="flex-column gap-4">
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
                                                <div class="card-body gap-2">
                                                    <div class="w-100 position-relative">
                                                        <img src="{PUBLIC_SERVER_PATH}/storage/{item.course.thumbnail}" 
                                                            class="thumbnail" alt="course-thumbnail"
                                                            loading="lazy">
                                                    </div>
                                                    <div class="flex-column gap-1">
                                                        <div class="body-small-medium">{item.course.title}</div>
                                                        <div class="flex justify-content-between">
                                                            <div class="caption-small-reguler">{item.course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})}</div>
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

<svelte:head>
    <title>Paket Kursus | Tambah Baru</title>
</svelte:head>

<style>
    .course {
        cursor: pointer;
    }

    .thumbnail {
        aspect-ratio: 4 / 3;
        border-radius: .25rem;
        width: 100%;
    }
</style>