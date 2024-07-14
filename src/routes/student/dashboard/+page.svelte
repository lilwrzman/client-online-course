<script>
	import { onMount } from "svelte";

	import checkLogin from "$lib/CheckLogin";
    
    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";
    import Button from "@components/Button.svelte";
    import StudentSidebar from "@components/StudentSidebar.svelte";
    import { Bar } from "svelte-chartjs";
    import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors } from "chart.js"
	import ApiController from "$lib/ApiController";

    let user
    let data

    let latestProgress
    let labels = []
    let datas

    const getDashboard = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: 'dashboard',
            authToken: user.token
        }).then(response => {
            if(response.status){
                latestProgress = response.data
                labels = latestProgress.map(elm => elm.title)
                datas = latestProgress.map(elm => elm.progress_count)

                data = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Progress Pembelajaran',
                            data: datas,
                            borderWidth: 2,
                        },
                    ],
                }

                Chart.register(
                    Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors
                )
            }
        })
    }

    onMount(() => {
        user = checkLogin('Student', true)

        getDashboard()
    })
</script>

<Navbar variant="combined" />

<section id="header" class="section">
    <div class="container">
        <div class="flex-column gap-8">
            <div class="flex-column gap-2 tc-neutral-white">
                <h4 class="mb-0">Selamat Datang {user ? user.username + '!' : '' }</h4>
                <p class="body-medium-light">Dapatkan pengalaman belajar yang menyenangkan dan bermanfaat.</p>
            </div>
            <div class="card p-4 radius-sm">
                <div class="card-body">
                    <div class="flex justify-content-between align-items-center neutral-border p-4 radius-sm">
                        <p class="body-small-light" style="max-width: 60%;">Mari kembangkan diri dengan menjelajahi materi dari berbagai alur pembelajaran yang anda minati sekarang juga.</p>
                        <Button type="link" href="/courses" classList="btn btn-main">Jelajahi Sekarang</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section id="content" class="section">
    <div class="container">
        <div class="flex gap-4">
            <StudentSidebar bind:user={user} active="Dasbor"/>
            <main class="w-100">
                <div class="flex-column gap-4">
                    <div class="card neutral-border radius-sm p-0">
                        <div class="card-header neutral-border-bottom p-standard">
                            <p class="body-medium-semi-bold">Materi Saya</p>
                        </div>
                        <div class="card-body flex-column gap-3 p-standard">
                            {#if latestProgress}
                            {#if latestProgress.length > 0}
                            {#each latestProgress as progress, index (progress.id)}
                            <div class="flex justify-content-between align-items-center p-standard course-bg radius-sm">
                                <div class="flex-column">
                                    <p class="body-small-semi-bold">{progress.title}</p>
                                    {#if progress.items_count != progress.progress_count}
                                    <p class="body-medium-reguler">Progress terakhir: {progress.latest_progress.item.title}</p>
                                    {:else}
                                    <p class="body-medium-reguler">Pembelajaran Selesai!</p>
                                    {/if}
                                </div>
                                {#if progress.items_count != progress.progress_count}
                                <Button type="link" href="/student/my-courses/{progress.latest_progress.item.course_id}" classList="btn btn-main">Lanjut Belajar</Button>
                                {:else}
                                {#if progress.feedback}
                                <Button type="link" href="/student/my-courses/{progress.latest_progress.item.course_id}" classList="btn btn-main-outline">Lihat Sertifikat</Button>
                                {:else}
                                <Button type="link" href="/student/my-courses/{progress.latest_progress.item.course_id}" classList="btn btn-main-outline">Beri Umpan Balik</Button>
                                {/if}
                                {/if}
                            </div>    
                            {/each}
                            {/if}
                            {/if}
                            <div class="flex-row-reverse">
                                <Button type="link" href="/student/my-courses" classList="link">Lihat Selengkapnya</Button>
                            </div>
                        </div>
                    </div>
                    <div class="card neutral-border radius-sm p-0 h-100">
                        <div class="card-header neutral-border-bottom p-standard">
                            <p class="body-medium-semi-bold">Progress Belajar</p>
                        </div>
                        <div class="card-body flex-column gap-3 p-standard">
                            <div class="flex-column justify-content-center align-items-center h-100">
                                <Bar {data} options={{ 
                                    responsive: true, 
                                    indexAxis: 'y', 
                                    colors: { forceOveride: true }
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</section>

<Footer/>

<svelte:head>
    <title>Dasbor</title>
    <style>
        #header {
            background-image: url('/images/dashboard-header.svg');
        }
    
        aside {
            top: 100px !important;
        }
    
        .course-bg{
            background-color: var(--neutral-surface);
        }
    </style>
</svelte:head>