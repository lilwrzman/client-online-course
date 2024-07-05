<script>
    import { onMount } from "svelte";

	import { getCurrentDay, getCurrentTime } from "$lib/Date";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import { getFlash } from "$lib/Flash";
	
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Toast from "@components/Toast.svelte";
    import { Hourglass } from "svelte-bootstrap-icons";

    let user = null
    let dashboard = null
    let status = false
    let toastData = null
    let toastVisible = false

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
    <Sidebar active="Dasbor" role="Superadmin"/>
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Dasbor" bind:user={user}/>
        <main>
            <div class="container flex-column py-4 gap-8">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color}/>
                {/if}
                <div class="card px-4 pt-4 pb-0 drop-shadow">
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
                                <img src="/icons/dashboard-total-student.svg" alt="sum-student-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_student : 0}</div>
                                    <div class="caption-light">Total Karyawan</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-content.svg" alt="sum-content-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_course : 0}</div>
                                    <div class="caption-light">Total Materi</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-corporate.svg" alt="sum-corporate-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_corporate : 0}</div>
                                    <div class="caption-light">Total Mitra</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-transaction.svg" alt="sum-transaction-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{status ? dashboard.count_transaction : 0}</div>
                                    <div class="caption-light">Total Transaksi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card p-4 drop-shadow">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="body-small-semi-bold">Transaksi Terbaru</div>
                            <a href="/" class="link caption-reguler-thin">Lihat Semua</a>
                        </div>
                        {#if status}
                            {#if dashboard.transaction_list.length > 0}
                                {#each dashboard.transaction_list as transaction }
                                <div class="flex-column gap-3">
                                    <div class="row px-4 rating-review-item">
                                        <div class="col-2 flex-column justify-content-center">
                                            <img src="/images/TestimoniSampleImage.svg" alt="">
                                        </div>
                                        <div class="col-10">
                                            <div class="flex-column justify-content-center h-100">
                                                <div class="body-small-semi-bold">Lorem Ipsum</div>
                                                <div class="caption-semi-light">Body standard phasellus justo purus, vene natis a sapien eu faucibus porttitor libero. Sapieds tortor, nec vulputate sem efficitur. standard phasellus justo purus, vene natis a sapien eu faucibus porttitor libero</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/each}
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
    .rating-review-item img{
        border-radius: 4px;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
</style>