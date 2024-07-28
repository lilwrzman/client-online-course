<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation'

    import { extract } from "$lib/Cookie.js"
	import { getCurrentDay, getCurrentTime } from "$lib/Date";
	
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import { Hourglass, StarFill } from "svelte-bootstrap-icons";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Button from "@components/Button.svelte";
	import { PUBLIC_SERVER_PATH } from "$env/static/public";

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

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Dasbor" role="Teacher" bind:isSidebarOpen={isSidebarOpen}/>
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Dasbor"  bind:isSidebarOpen={isSidebarOpen}/>
        <main>
            <div class="container flex-column py-4 gap-8">
                <div class="card px-4 pt-4 pb-0 drop-shadow radius-sm">
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
                                <img src="/static/icons/dashboard-total-student.svg" alt="sum-student-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{ status ? dashboard.count_student : '' }</div>
                                    <div class="caption-light">Total Karyawan</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/static/icons/dashboard-total-content.svg" alt="sum-content-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{ status ? dashboard.count_course : '' }</div>
                                    <div class="caption-light">Total Materi</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/static/icons/dashboard-total-corporate.svg" alt="sum-corporate-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{ status ? dashboard.count_student_done : '' }</div>
                                    <div class="caption-light">Total Karyawan Selesai</div>
                                </div>
                            </div>
                            <div class="flex-column align-items-center px-2 flex-item-md-3 flex-item-sm-6 flex-item-xs-12 mb-4">
                                <img src="/static/icons/dashboard-total-transaction.svg" alt="sum-transaction-icon" width="30">
                                <div class="flex-column align-items-center py-2">
                                    <div class="caption-reguler">{ status ? dashboard.count_feedback : '' }</div>
                                    <div class="caption-light">Total Umpan Balik</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card p-4 neutral-border radius-sm">
                    <div class="card-body gap-5">
                        <div class="flex justify-content-between">
                            <div class="body-small-semi-bold">Umpan Balik Terbaru</div>
                            <Button href="/teacher/feedback" type="link" classList="btn btn-no-padding link caption-reguler-thin tc-dark">Lihat Semua</Button>
                        </div>
                        {#if dashboard && dashboard.latest_feedback}
                        {#if dashboard.latest_feedback.length > 0}
                        {#each dashboard.latest_feedback as feedback, index (feedback.id)}
                        <div class="flex-column gap-3">
                            <div class="flex gap-3">
                                <div class="flex-column justify-content-center">
                                    <img src="{PUBLIC_SERVER_PATH}/storage/{feedback.user.avatar}" alt="avatar" class="avatar">
                                </div>
                                <div class="flex align-items-center justify-content-between w-100">
                                    <div class="flex-column justify-content-center h-100">
                                        <div class="body-small-semi-bold">{feedback.user.info.fullname}</div>
                                        <div class="caption-semi-light">{feedback.review}</div>
                                    </div>
                                    <div class="flex align-items-center gap-2">
                                        <p class="caption-reguler mb-0 mt-1">{feedback.rating}</p>
                                        <StarFill fill="#FF9933"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/each}
                        {:else}
                        <div class="flex justify-content-center align-items-center w-100 py-8">
                            <div class="flex-column align-items-center gap-3 py-8">
                                <Hourglass width=60 height=60 color="#3951A8"/>
                                <div class="caption-reguler tc-neutral-disabled">Ups, belum ada data umpan balik!</div>
                            </div>
                        </div>
                        {/if}
                        {:else}
                        <div class="flex justify-content-center align-items-center w-100 py-8">
                            <div class="flex-column align-items-center gap-3 py-8">
                                <Hourglass width=60 height=60 color="#3951A8"/>
                                <div class="caption-reguler tc-neutral-disabled">Memuat data...</div>
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
    <title>Dasbor</title>
</svelte:head>

<style>
    .avatar{
        aspect-ratio: 1/1;
        border-radius: .25rem;
        width: 100px;
        max-width: 100%;
        object-fit: cover;
        object-position: center;
    }
</style>