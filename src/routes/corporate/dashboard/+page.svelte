<script>
    import { onMount } from "svelte";

	import { getCurrentDay, getCurrentTime } from "$lib/Date";
	import ApiController from "$lib/ApiController";
    import checkLogin from "$lib/CheckLogin";

    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Button from "@components/Button.svelte";
    import ProgressBar from "@components/ProgressBar.svelte";
	import { Copy, Hourglass } from "svelte-bootstrap-icons";

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

                console.log(dashboard)

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
                                    <div class="caption-reguler">{ dashboard ? dashboard.count_student : '' }</div>
                                    <div class="caption-light">Total Karyawan</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-content.svg" alt="sum-content-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{ dashboard ? dashboard.count_bundle : '' }</div>
                                    <div class="caption-light">Total paket Kursus</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-corporate.svg" alt="sum-corporate-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{ dashboard ? dashboard.count_student_done : '' }</div>
                                    <div class="caption-light">Total Karyawan Selesai</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/icons/dashboard-total-transaction.svg" alt="sum-transaction-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="flex gap-2 align-items-center">
                                        <div class="caption-reguler">{ dashboard ? dashboard.referall_code.code : '' }</div>
                                        <Button classList="btn btn-no-padding" onClick={() => {
                                            navigator.clipboard.writeText(dashboard.referall_code.code)
                                            return alert("Berhasil menyalin " + dashboard.referall_code.code + " ke papan klip!")
                                        }}>
                                            <div class="flex align-items-center justify-content-center">
                                                <Copy/>
                                            </div>
                                        </Button>
                                    </div>
                                    <div class="caption-light">Kode Referal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card radius-sm p-4 neutral-border">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="body-small-semi-bold">Progress Karyawan Terbaru</div>
                            <Button href="/corporate/progress" type="link" classList="btn btn-no-padding link caption-reguler-thin tc-dark">Lihat Semua</Button>
                        </div>
                        <div class="flex-column gap-3">
                            {#if dashboard && dashboard.latest_progresses}
                            {#if dashboard.latest_progresses.length > 0}
                            {#each dashboard.latest_progresses as progress, index (progress.latest_progress.id)}
                            <div class="card">
                                <div class="row justify-content-between">
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column">
                                            <div class="flex flex-wrap gap-2">
                                                <p class="mb-0 body-small-medium">{progress.student.info.fullname}</p>
                                                <p class="mb-0 body-small-reguler">|</p>
                                                <p class="mb-0 body-small-medium">{progress.course.title}</p>
                                            </div>
                                            <p class="mb-0 caption-light">Telah menyelesaikan {progress.progress_count} dari {progress.total_items_count} item</p>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-5">
                                        <div class="flex-column h-100 justify-content-center">
                                            <ProgressBar percentage={progress.progress_count == 0 ? 0 : (progress.progress_count / progress.total_items_count) * 100}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/each}
                            {:else}
                            <div class="flex justify-content-center align-items-center w-100 py-8">
                                <div class="flex-column align-items-center gap-3 py-8">
                                    <Hourglass width=60 height=60 color="#3951A8"/>
                                    <div class="caption-reguler tc-neutral-disabled">Ups, belum ada data progres belajar!</div>
                                </div>
                            </div>
                            {/if}
                            {:else}
                            <div class="flex justify-content-center align-items-center w-100 py-8">
                                <div class="flex-column align-items-center gap-3 py-8">
                                    <Hourglass width=60 height=60 color="#3951A8"/>
                                    <div class="caption-reguler tc-neutral-disabled">memuat data...</div>
                                </div>
                            </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Beranda Admin Mitra</title>
</svelte:head>