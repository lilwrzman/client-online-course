<script>
    import { onMount } from "svelte";

	import { getCurrentDay, getCurrentTime } from "$lib/Date";
	import ApiController from "$lib/ApiController";
    import checkLogin from "$lib/CheckLogin";

    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Button from "@components/Button.svelte";
    import ProgressBar from "@components/ProgressBar.svelte";

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
        user = checkLogin('Corporate Admin')
        getDashboard()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Dasbor" role="Corporate Admin" bind:isSidebarOpen={isSidebarOpen}/>
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Beranda"  bind:isSidebarOpen={isSidebarOpen}/>
        <main>
            <div class="container flex-column py-4 gap-8">
                <div class="card radius-sm px-4 pt-4 pb-0 drop-shadow">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="flex-column">
                                <div class="body-small-semi-bold">Selamat datang di panel Admin Mitra</div>
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

                <div class="card radius-sm p-4 neutral-border">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="body-small-semi-bold">Progress Karyawan Terbaru</div>
                            <Button type="link" href="#" classList="btn btn-no-padding link">Lihat Semua</Button>
                        </div>
                        <div class="flex-column gap-3">
                            <div class="card">
                                <div class="row justify-content-between">
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column">
                                            <div class="flex flex-wrap gap-2">
                                                <p class="mb-0 body-small-medium">Michael Hernandez</p>
                                                <p class="mb-0 body-small-reguler">|</p>
                                                <p class="mb-0 body-small-medium">Pengenalan Sales Marketing</p>
                                            </div>
                                            <p class="mb-0 caption-light">Telah menyelesaikan 7 dari 10 item</p>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column h-100 justify-content-center">
                                            <ProgressBar percentage=70/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="row justify-content-between">
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column">
                                            <div class="flex flex-wrap gap-2">
                                                <p class="mb-0 body-small-medium">Michael Hernandez</p>
                                                <p class="mb-0 body-small-reguler">|</p>
                                                <p class="mb-0 body-small-medium">Pengenalan Sales Marketing</p>
                                            </div>
                                            <p class="mb-0 caption-light">Telah menyelesaikan 5 dari 10 item</p>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column h-100 justify-content-center">
                                            <ProgressBar percentage=50/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="row justify-content-between">
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column">
                                            <div class="flex flex-wrap gap-2">
                                                <p class="mb-0 body-small-medium">Michael Hernandez</p>
                                                <p class="mb-0 body-small-reguler">|</p>
                                                <p class="mb-0 body-small-medium">Pengenalan Sales Marketing</p>
                                            </div>
                                            <p class="mb-0 caption-light">Telah menyelesaikan 2 dari 10 item</p>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column h-100 justify-content-center">
                                            <ProgressBar percentage=20/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="row justify-content-between">
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column">
                                            <div class="flex flex-wrap gap-2">
                                                <p class="mb-0 body-small-medium">Michael Hernandez</p>
                                                <p class="mb-0 body-small-reguler">|</p>
                                                <p class="mb-0 body-small-medium">Pengenalan Sales Marketing</p>
                                            </div>
                                            <p class="mb-0 caption-light">Telah menyelesaikan 10 dari 10 item</p>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column h-100 justify-content-center">
                                            <ProgressBar percentage=100/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- <div class="flex justify-content-center align-items-center w-100 py-8">
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
                        </div> -->
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Beranda Admin Mitra</title>
</svelte:head>