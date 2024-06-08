<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation'

    import { extract } from "$lib/Cookie.js"
	import { getCurrentDay, getCurrentTime } from "$lib/Date";
	
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import { Hourglass } from "svelte-bootstrap-icons";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";

    let user = null

    let dashboard = null
    let status = false

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
        user = checkLogin("Teacher")

        getDashboard()
    })
</script>

<div class="flex">
    <Sidebar active="Dashboard" role="Teacher"/>
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Dashboard" bind:user={user}/>
        <main>
            <div class="container flex-column py-4 gap-8">
                <div class="card px-4 pt-4 pb-0 drop-shadow">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="flex-column">
                                <div class="body-small-semi-bold">Selamat datang di panel Pemateri LPK</div>
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
                                    <div class="caption-reguler">0</div>
                                    <div class="caption-light">Total Karyawan</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-content.svg" alt="sum-content-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">0</div>
                                    <div class="caption-light">Total Materi</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-corporate.svg" alt="sum-corporate-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">0</div>
                                    <div class="caption-light">Total Mitra</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-transaction.svg" alt="sum-transaction-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">0</div>
                                    <div class="caption-light">Total Transaksi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card p-4 drop-shadow">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="body-small-semi-bold">Umpan Balik Terbaru</div>
                            <a href="/" class="link caption-reguler-thin">Lihat Semua</a>
                        </div>

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

                            <div class="flex justify-content-center align-items-center w-100 py-8">
                                <div class="flex-column align-items-center gap-3 py-8">
                                    <Hourglass width=60 height=60 color="#3951A8"/>
                                    <div class="caption-reguler tc-neutral-disabled">Ups, belum ada data umpan balik!</div>
                                </div>
                            </div>

                        <div class="flex justify-content-center align-items-center w-100 py-8">
                            <div class="flex-column align-items-center gap-3 py-8">
                                <Hourglass width=60 height=60 color="#3951A8"/>
                                <div class="caption-reguler tc-neutral-disabled">Ups, belum ada data umpan balik!</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<style>
    .rating-review-item img{
        border-radius: 4px;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
</style>