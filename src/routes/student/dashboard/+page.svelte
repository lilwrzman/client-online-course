<script>
    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";
    import Button from "@components/Button.svelte";
    import { Bar } from "svelte-chartjs";
    import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors } from "chart.js"

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
</script>

<Navbar/>

<main>
    <section id="header" class="section">
        <div class="container">
            <div class="flex-column gap-8">
                <div class="flex-column gap-2 tc-neutral-white">
                    <h4 class="mb-0">Selamat Datang Username!</h4>
                    <p class="body-medium-light">Dapatkan pengalaman belajar yang menyenangkan dan bermanfaat.</p>
                </div>
                <div class="card p-4 radius-sm">
                    <div class="card-body">
                        <div class="flex justify-content-between align-items-center neutral-border p-4 radius-sm">
                            <p class="body-small-light" style="max-width: 60%;">Anda belum mengikuti kelas apapun. Jelajahi materi dari berbagai alur pembelajaran yang anda minati sekarang juga.</p>
                            <Button type="link" href="/courses" classList="btn btn-main">Jelajahi Sekarang</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="content" class="section">
        <div class="container">
            <div class="row">
                <div class="col-md-5">
                    <div class="flex-column justify-content-center align-items-center h-100">
                        <Bar {data} options={{ 
                            responsive: true, 
                            indexAxis: 'y', 
                            colors: { forceOveride: true }
                        }} />
                    </div>
                </div>
                <div class="col-md-7">
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
                                <Button type="link" href="#" classList="link">Lihat Selengkapnya</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<Footer/>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<style>
    #header {
        background-image: url('/images/dashboard-header.svg');
    }

    .course-bg{
        background-color: var(--neutral-surface);
    }
</style>