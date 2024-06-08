<script>
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';

    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";
    import Button from "@components/Button.svelte";
    import StarFill from "svelte-bootstrap-icons/lib/StarFill.svelte"
</script>

<Navbar active="beranda"/>

<main>
    <section id="header" class="section">
        <div class="container">
            <div class="row">
                <div class="col align-self-center">
                    <div class="flex-column gap-2">
                        <div class="h3 tc-dark">
                            Lorem Ipsum dolor sit amet 
                            consectetur adipiscing elita 
                            venetatis.
                        </div>
                        <div class="body-large-semi-bold tc-dark">
                            Lorem ipsum dolor sit amet, consectetur
                        </div>
                    </div>
                    <Button type="link" href="/learning-paths" classList="btn btn-main mt-6" id="btn-header">Ayo Belajar</Button>
                </div>
                <div class="col flex justify-content-end">
                    <img src="/images/thumbnail.png" alt="header">
                </div>
            </div>
        </div>
    </section>

    <section id="materi" class="section" style="scroll-margin-top: 6rem;">
        <div class="container flex-column gap-4">
            <div class="flex justify-content-between">
                <div class="h4 tc-dark">Materi Favorit</div>
                <Button type="link" classList="link body-large-reguler tc-dark" href="/materi">Lihat Semua</Button>
            </div>
            <div class="row justify-content-between">
                <div class="col-lg-3 col-md-6 col-xs-12 flex-column gap-3 mb-6">
                    <img src="/images/sales-marketing-courses-image.png" alt="">
                    <div class="flex-column gap-1">
                        <div class="body-small-medium" style="color:#29939D;">Sales Marketing</div>
                        <p class="body-small-reguler">
                            Hubungan antar masyarakat
                        </p>
                        <div class="flex justify-content-between align-items-center">
                            <p class="caption-small-reguler">Rp 142.000</p>
                            <p class="caption-small-reguler">9 Item</p>
                        </div>
                    </div>
                    <Button type="link" href="/courses/detail" classList="btn btn-main" >Lihat Detail</Button>
                </div>
                <div class="col-lg-3 col-md-6 col-xs-12 flex-column gap-3 mb-6">
                    <img src="/images/building-trust-courses-image.png" alt="">
                    <div class="flex-column gap-1">
                        <div class="body-small-medium" style="color:#9B51E0;">Building Trust</div>
                        <p class="body-small-reguler">
                            Membangun percaya diri
                        </p>
                        <div class="flex justify-content-between align-items-center">
                            <p class="caption-small-reguler">Rp 240.000</p>
                            <p class="caption-small-reguler">7 Item</p>
                        </div>
                    </div>
                    <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                </div>
                <div class="col-lg-3 col-md-6 col-xs-12 flex-column gap-3 mb-6">
                    <img src="/images/sales-marketing2-courses-image.png" alt="materi">
                    <div class="flex-column gap-1">
                        <div class="body-small-medium" style="color:#29939D;">Sales Marketing</div>
                        <p class="body-small-reguler">
                            Pemasaran media sosial
                        </p>
                        <div class="flex justify-content-between align-items-center">
                            <p class="caption-small-reguler">Rp 179.000</p>
                            <p class="caption-small-reguler">12 Item</p>
                        </div>
                    </div>
                    <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                </div>
                <div class="col-lg-3 col-md-6 col-xs-12 flex-column gap-3 mb-6">
                    <img src="/images/sales-marketing3-courses-image.png" alt="materi">
                    <div class="flex-column gap-1">
                        <div class="body-small-medium" style="color:#29939D;">Sales Marketing</div>
                        <p class="body-small-reguler">
                            Pemasaran interaktif
                        </p>
                        <div class="flex justify-content-between align-items-center">
                            <p class="caption-small-reguler">Rp 220.000</p>
                            <p class="caption-small-reguler">14 Item</p>
                        </div>
                    </div>
                    <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                </div>
            </div>
        </div>
    </section>

    <section id="event" class="section">
        <div class="container">
            <Splide aria-label="My Favorite Images" options={{
                type: 'loop',
                perPage: 1,
                autoplay: true,
                lazyLoad: true,
                padding: '8rem'
            }}>
                <SplideSlide>
                    <div class="container flex justify-content-center">
                        <img src="/images/EventSampleImage.svg" alt="event"/>
                    </div>
                </SplideSlide>
                <SplideSlide>
                    <div class="container flex justify-content-center">
                        <img src="/images/EventSampleImage.svg" alt="event"/>
                    </div>
                </SplideSlide>
                <SplideSlide>
                    <div class="container flex justify-content-center">
                        <img src="/images/EventSampleImage.svg" alt="event"/>
                    </div>
                </SplideSlide>
            </Splide>
        </div>
    </section>

    <section id="testimoni" class="section">
        <div class="container flex-column pb-6 gap-4">
            <div class="flex justify-content-between">
                <div class="h4 tc-dark">Testimoni Karyawan</div>
                <Button type="link" classList="link body-large-reguler tc-dark" href="/testimonials">Lihat Semua</Button>
            </div>
            <div class="row justify-content-between">
                <div class="col-lg-4 flex gap-2 mb-3">
                    <img src="/images/testimoni-karyawan-image.png" alt="">
                    <div class="flex-column gap-2">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex-column gap-1">
                                <div class="body-large-semi-bold tc-dark">
                                    Michael Hernandez
                                </div>
                                <div class="body-small-reguler tc-dark">
                                    Sales Marketing
                                </div>
                            </div>
                            <div class="flex gap-1 align-items-baseline">
                                <div class="body-small-semi-bold tc-dark">4.9</div>
                                <StarFill fill="#FF9933" />
                            </div>
                        </div>
                        <div class="caption-light tc-dark">
                            Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas ilmunya yang bermanfaat.
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 flex gap-2 mb-3">
                    <img src="/images/testimoni-karyawan-image.png" alt="">
                    <div class="flex-column gap-2">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex-column gap-1">
                                <div class="body-large-semi-bold tc-dark">
                                    Michael Hernandez
                                </div>
                                <div class="body-small-reguler tc-dark">
                                    Sales Marketing
                                </div>
                            </div>
                            <div class="flex gap-1 align-items-baseline">
                                <div class="body-small-semi-bold tc-dark">4.9</div>
                                <StarFill fill="#FF9933" />
                            </div>
                        </div>
                        <div class="caption-light tc-dark">
                            Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas ilmunya yang bermanfaat.
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 flex gap-2 mb-3">
                    <img src="/images/testimoni-karyawan-image.png" alt="">
                    <div class="flex-column gap-2">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex-column gap-1">
                                <div class="body-large-semi-bold tc-dark">
                                    Michael Hernandez
                                </div>
                                <div class="body-small-reguler tc-dark">
                                    Sales Marketing
                                </div>
                            </div>
                            <div class="flex gap-1 align-items-baseline">
                                <div class="body-small-semi-bold tc-dark">4.9</div>
                                <StarFill fill="#FF9933" />
                            </div>
                        </div>
                        <div class="caption-light tc-dark">
                            Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas ilmunya yang bermanfaat.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<Footer/>