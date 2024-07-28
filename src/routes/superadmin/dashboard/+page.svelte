<script>
    import { onMount } from "svelte";

	import { getCurrentDay, getCurrentTime, getDay } from "$lib/Date";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import { getFlash } from "$lib/Flash";
	
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Toast from "@components/Toast.svelte";
    import { FileEarmarkText, Hourglass, Pass, PlayCircle } from "svelte-bootstrap-icons";
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import Button from "@components/Button.svelte";

    let user = null
    let dashboard = null
    let status = false
    let toastData = null
    let toastVisible = false

    let isSidebarOpen = true

    const getDashboard = () => {
        ApiController.sendRequest({
            endpoint: 'dashboard',
            method: 'GET',
            authToken: user.token
        }).then(response => {
            if(response.status){
                dashboard = response.data
                status = true
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
        
        user = checkLogin('Superadmin')

        getDashboard()
    })
</script>

<div class="flex">
    <Sidebar active="Dasbor" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Dasbor" bind:isSidebarOpen={isSidebarOpen} />
        <main>
            <div class="container flex-column py-4 gap-8">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color}/>
                {/if}
                <div class="card px-4 pt-4 pb-0 drop-shadow radius-sm">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="flex-column">
                                <div class="body-small-semi-bold">Selamat datang di panel Admin LPK</div>
                                <div class="caption-light">Semua dokumen di sini bersifat rahasia.</div>
                            </div>
                            <div class="flex-column">
                                <div class="caption-reguler">{ getCurrentDay() }</div>
                                <div class="caption-reguler">{ getCurrentTime() }</div>
                            </div>
                        </div>
                        <div class="flex justify-content-between flex-wrap">
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/static/icons/dashboard-total-student.svg" alt="sum-student-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_student : 0}</div>
                                    <div class="caption-light">Total Karyawan</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/static/icons/dashboard-total-content.svg" alt="sum-content-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_course : 0}</div>
                                    <div class="caption-light">Total Materi</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/static/icons/dashboard-total-corporate.svg" alt="sum-corporate-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_corporate : 0}</div>
                                    <div class="caption-light">Total Mitra</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/static/icons/dashboard-total-transaction.svg" alt="sum-transaction-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_transaction : 0}</div>
                                    <div class="caption-light">Total Transaksi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card p-4 neutral-border radius-sm">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="body-small-semi-bold">Transaksi Terbaru</div>
                            <Button href="/superadmin/transaction" type="link" classList="btn btn-no-padding link caption-reguler-thin tc-dark">Lihat Semua</Button>
                        </div>
                        {#if status}
                            {#if dashboard.transaction_list.length > 0}
                            <div class="flex-column gap-3">
                                {#each dashboard.transaction_list as transaction, index (transaction.id) }
                                <div class="card p-standard neutral-border radius-sm">
                                    <div class="card-body gap-standard">
                                        <div class="flex align-items-center gap-3">
                                            {#if transaction.status == 'success'}
                                            <div class="badge badge-success">SUKSES</div>
                                            {:else}
                                            <div class="badge badge-danger">GAGAL</div>
                                            {/if}
                                            <p class="body-small-reguler">{getDay(transaction.created_at)} | {getCurrentTime(transaction.created_at)}</p>
                                            <p class="body-small-reguler">ID Transaksi: #{transaction.id}</p>
                                        </div>
                                        <div class="flex align-items-center justify-content-between">
                                            <div class="flex gap-3">
                                                <div class="col-12 col-md-3">
                                                    <div class="flex align-items-center justify-content-center">
                                                        <img src="{PUBLIC_SERVER_PATH}/storage/{transaction.course.thumbnail}" alt="thumbnail" class="thumbnail">
                                                    </div>
                                                </div>
                                                <div class="col-12 col-md-4">
                                                    <div class="h-100 flex-column align-items-start justify-content-center gap-3">
                                                        <p class="body-large-semi-bold mb-0">{transaction.course.title}</p>
                                                        <div class="flex gap-3">
                                                            {#if transaction.course.items.filter(elm => elm.type == 'Video').length > 0}
                                                            <div class="flex align-items-center gap-2 p-2 neutral-border radius-sm">
                                                                <PlayCircle/>
                                                                <p class="caption-small-reguler my-0">{transaction.course.items.filter(elm => elm.type == 'Video').length} Video</p>
                                                            </div>
                                                            {/if}
                                                            {#if transaction.course.items.filter(elm => elm.type == 'Quiz').length > 0}
                                                            <div class="flex align-items-center gap-2 p-2 neutral-border radius-sm">
                                                                <FileEarmarkText/>
                                                                <p class="caption-small-reguler my-0">{transaction.course.items.filter(elm => elm.type == 'Quiz').length} Kuis</p>
                                                            </div>
                                                            {/if}
                                                            {#if transaction.course.items.filter(elm => elm.type == 'Exam').length > 0}
                                                            <div class="flex align-items-center gap-2 p-2 neutral-border radius-sm">
                                                                <Pass/>
                                                                <p class="caption-small-reguler my-0">{transaction.course.items.filter(elm => elm.type == 'Exam').length} Ujian</p>
                                                            </div>
                                                            {/if}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex-column gap-2 align-items-end">
                                                <p class="body-small-reguler tc-neutral-disabled" style="white-space: nowrap;">Harga Materi</p>
                                                <p class="body-medium-semi-bold">{transaction.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/each}
                            </div>
                            {:else}
                            <div class="flex justify-content-center align-items-center w-100 py-8">
                                <div class="flex-column align-items-center gap-3 py-8">
                                    <Hourglass width=60 height=60 color="#3951A8"/>
                                    <div class="caption-reguler tc-neutral-disabled">Ups, belum ada data transaksi!</div>
                                </div>
                            </div>
                            {/if}
                        {:else}
                        <div class="flex justify-content-center align-items-center w-100 py-8">
                            <div class="flex-column align-items-center gap-3 py-8">
                                <Hourglass width=60 height=60 color="#3951A8"/>
                                <div class="caption-reguler tc-neutral-disabled">Ups, belum ada data transaksi!</div>
                            </div>
                        </div>
                        {/if}
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Beranda</title>
</svelte:head>

<style>
    .thumbnail{
        aspect-ratio: 4/3;
        border-radius: .25rem;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }

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