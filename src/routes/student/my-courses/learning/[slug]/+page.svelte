<script>
    import {onMount} from "svelte"
    import {page} from "$app/stores"

    import checkLogin from "$lib/CheckLogin"
    import videojs from 'video.js';
	import 'video.js/dist/video-js.css';

    import Navbar from "@components/Navbar.svelte"
    import Button from "@components/Button.svelte"
    import Tab from "@components/Tab.svelte"
    import { Arrow90degLeft, PlayCircle, CheckCircleFill, FileEarmarkText, Pass } from "svelte-bootstrap-icons"

    let user
    let slug = $page.params.slug
    let player
    let tabActive = 'Deskripsi'

    onMount(() => {
        let user = checkLogin('Student', true)

        player = videojs(document.getElementById('video-js-player'), {
			controls: true,
            autoplay: false,
            preload: "auto",
            techOrder: ["youtube"],
			sources: [
				{
					src: 'https://www.youtube.com/watch?v=PCTTTLtEweg',
                    type: "video/youtube"
				}
			],
		})
    })
</script>

<Navbar bind:user={user}/>

<section id="learning" class="section">
    <div class="container">
        <div class="flex gap-4">
            <aside>
                <div class="flex-column gap-4 align-items-start">
                    <Button type="link" href="/student/my-courses" classList="btn btn-neutral-outline radius-sm">
                        <div class="flex gap-2 align-items-center">
                            <Arrow90degLeft/>
                            <p class="body-small-reguler">Kembali</p>
                        </div>
                    </Button>
                    <div class="silabus-nav">
                        <p class="body-super-large-semi-bold">Daftar Silabus</p>
                        <ul class="silabus-item-container">
                            <li class="silabus-item">
                                <div class="flex gap-2 align-items-center">
                                    <PlayCircle width=20 height=20/>
                                    <p class="body-medium-reguler">1. Pengenalan Sales Marketing</p>
                                </div>
                                <div class="flex align-items-center justify-content-center">
                                    <CheckCircleFill width=20 height=20 color="#A1E0C5"/>
                                </div>
                            </li>
                            <li class="silabus-item">
                                <div class="flex gap-2 align-items-center">
                                    <FileEarmarkText width=20 height=20/>
                                    <p class="body-medium-reguler">2. Kuis Awalan Materi</p>
                                </div>
                                <div class="flex align-items-center justify-content-center">
                                    <CheckCircleFill width=20 height=20 color="#A1E0C5" />
                                </div>
                            </li>
                            <li class="silabus-item">
                                <div class="flex gap-2 align-items-center">
                                    <Pass width=20 height=20/>
                                    <p class="body-medium-reguler">3. Ujian Akhir</p>
                                </div>
                                <div class="flex align-items-center justify-content-center">
                                    <CheckCircleFill width=20 height=20 color="#A1E0C5" />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
            <main class="grow-item">
                <div class="flex-column gap-4">
                    <div class="flex-column gap-3">
                        <div class="video-js-container">
                            <video id="video-js-player" class="video-js vjs-default-skin"></video>
                        </div>
                        <div class="flex align-items-center justify-content-between">
                            <div class="flex-column">
                                <h4 class="mb-0">Pengenalan Sales Marketing</h4>
                                <p class="body-large-reguler">Sales Marketing</p>
                            </div>
                            <Button classList="btn btn-main">Berikutnya</Button>
                        </div>
                    </div>

                    <div class="flex-column gap-3">
                        <Tab bind:value={tabActive} type="variable" menus={[
                            {value: "Deskripsi", title: "Deskripsi"},
                            {value: "Forum Diskusi", title: "Forum Diskusi"},
                        ]}/>

                        <p>
                            Sales marketing adalah konsep yang mencakup berbagai strategi dan taktik yang digunakan oleh perusahaan untuk menjual produk atau jasa mereka kepada pelanggan. Sales, atau penjualan, berfokus pada interaksi langsung dengan pelanggan, yang melibatkan proses mulai dari prospekting, pendekatan, presentasi produk, menangani keberatan, hingga menutup penjualan dan melakukan tindak lanjut. Sementara itu, marketing, atau pemasaran, memiliki cakupan yang lebih luas yaitu mencakup berikut dibawah ini. Sales marketing adalah konsep yang mencakup berbagai strategi dan taktik yang digunakan oleh perusahaan untuk menjual produk atau jasa mereka kepada pelanggan. Sales, atau penjualan, berfokus pada interaksi langsung dengan pelanggan, yang melibatkan proses mulai dari prospekting, pendekatan, presentasi produk, menangani keberatan, hingga menutup penjualan dan melakukan tindak lanjut. Sementara itu, marketing, atau pemasaran, memiliki cakupan yang lebih luas yaitu mencakup berikut dibawah ini. Sales marketing adalah konsep yang mencakup berbagai strategi dan taktik yang digunakan oleh perusahaan untuk menjual produk atau jasa mereka kepada pelanggan. Sales, atau penjualan, berfokus pada interaksi langsung dengan pelanggan, yang melibatkan proses  
                            riset pasar, segmentasi
                            penargetan
                            positioning produk
                        </p>
                    </div>
                </div>
            </main>
        </div>
    </div>
</section>

<style>
    .video-js-container { 
        width: 100%;
        border-radius: .25rem;
    }

    .video-js {
        border-radius: .25rem;
        aspect-ratio: 16 / 9;
        width: 100%;
        height: 100%;
    }

    aside {
        height: fit-content;
		position: sticky;
		position: -webkit-sticky;
		top: 104px;
    }

    .silabus-nav {
        display: flex;
        flex-direction: column;
        padding: .875rem;
        gap: 1.5rem;
        border-radius: .25rem;
        border: 1px solid var(--neutral-border);
        background-color: var(--neutral-white);
    }

    .silabus-item-container {
        min-width: 18rem;
        max-width: 20rem;
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: .875rem;
    }

    .silabus-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: .875rem;
        background-color: var(--neutral-white);
        border: 1px solid var(--neutral-border);
        border-radius: .25rem;
        transition: all 0.25s ease;
        cursor: pointer;
    }

    .silabus-item:hover {
        background-color: var(--hover);
        padding: 1.25rem 0.875rem;
    }
</style>