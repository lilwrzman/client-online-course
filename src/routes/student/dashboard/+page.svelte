<script>
	import { onMount } from "svelte";

	import checkLogin from "$lib/CheckLogin";
    
    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";
    import Button from "@components/Button.svelte";
    import StudentSidebar from "@components/StudentSidebar.svelte";
    import { Bar } from "svelte-chartjs";
    import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors } from "chart.js"

    let user
    const data = {
        labels: ['Building Trust', 'Building Need', 'Handling Objection', 'Trying to Clos', 'Closing'],
        datasets: [
            {
                label: 'Progress Pembelajaran',
                data: [9, 10, 8, 5, 2],
                borderWidth: 2,
            },
        ],
    }

    Chart.register(
        Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors
    )

    onMount(() => {
        user = checkLogin('Student', true)
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
                            <div class="flex justify-content-between align-items-center p-standard course-bg radius-sm">
                                <div class="flex-column">
                                    <p class="body-small-semi-bold">Materi 01</p>
                                    <p class="body-medium-reguler">Progress terakhir di submateri berapa</p>
                                </div>
                                <Button classList="btn btn-main">Lanjut Belajar</Button>
                            </div>
                            <div class="flex justify-content-between align-items-center p-standard course-bg radius-sm">
                                <div class="flex-column">
                                    <p class="body-small-semi-bold">Materi 01</p>
                                    <p class="body-medium-reguler">Progress terakhir di submateri berapa</p>
                                </div>
                                <Button classList="btn btn-main">Lanjut Belajar</Button>
                            </div>
                            <div class="flex justify-content-between align-items-center p-standard course-bg radius-sm">
                                <div class="flex-column">
                                    <p class="body-small-semi-bold">Materi 01</p>
                                    <p class="body-medium-reguler">Progress terakhir di submateri berapa</p>
                                </div>
                                <Button classList="btn btn-main-outline">Lihat Sertifikat</Button>
                            </div>
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