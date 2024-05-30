<script>
    import Button from "@components/Button.svelte";
	import Footer from "@components/Footer.svelte";
    import InputField from "@components/InputField.svelte";
    import Navbar from "@components/Navbar.svelte";
    import StarFill from "svelte-bootstrap-icons/lib/StarFill.svelte"

    let option = [
        {value: "newest", text:"Terbaru"},
        {value: "asc", text: 'A-Z'},
        {value: "desc", text:'Z-A'}
    ]

    let sortBy = option[0].value

    const handleSort = (evt) => {
        sortBy = evt.target.value

        if(sortBy == 'newest'){
            handler.sortDesc('created_at')
        }else if(sortBy == 'asc'){
            handler.sortAsc('title')
        }else if(sortBy == 'desc'){
            handler.sortDesc('title')
        }
    }

</script>

<Navbar active="materi"/>

<main class="mb-6">
    <section id="courses" class="section">
        <div class="container">
            <div class="flex-column gap-3">
                <div class="flex justify-content-between align-items-center">
                    <h4>Materi</h4>
                    <InputField type="select-option" id="select-default"
                    containerClass="grow-item grow-auto-md"
                    inputClass="input-bg-light pr-8"
                    onInput={handleSort}
                    value={sortBy} option={option}/>
                </div>

                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/sales-marketing-courses-image.png" alt="gambar courses" />
                                <div class="flex-column gap-1">
                                    <p class="body-small-medium" style="color:#29939D;">Sales Marketing</p>
                                    <p class="body-small-medium" >Hubungan Antar Masyarakat</p>
                                    <div class="flex justify-content-between align-items-center"> 
                                        <p class="caption-small-reguler">Rp 142.000</p>
                                        <p class="caption-small-reguler">9 Item</p>                         
                                    </div>                          
                                </div>
                                <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/building-trust-courses-image.png" alt="gambar courses" />
                                <div class="flex-column gap-1">
                                    <p class="body-small-medium" style="color: #9B51E0;">Building Trust</p>
                                    <p class="body-small-medium" >Membangun Percaya Diri</p>
                                    <div class="flex justify-content-between align-items-center"> 
                                        <p class="caption-small-reguler">Rp 240.000</p>
                                        <p class="caption-small-reguler">7 Item</p>                         
                                    </div>                          
                                </div>
                                <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/sales-marketing2-courses-image.png" alt="gambar courses" />
                                <div class="flex-column gap-1">
                                    <p class="body-small-medium" style="color:#29939D;">Sales Marketing</p>
                                    <p class="body-small-medium" >Pemasaran Media Sosial</p>
                                    <div class="flex justify-content-between align-items-center"> 
                                        <p class="caption-small-reguler">Rp 179.000</p>
                                        <p class="caption-small-reguler">12 Item</p>                         
                                    </div>                          
                                </div>
                                <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/sales-marketing3-courses-image.png" alt="gambar courses" />
                                <div class="flex-column gap-1">
                                    <p class="body-small-medium" style="color:#29939D;">Sales Marketing</p>
                                    <p class="body-small-medium" >Pemasaran Interaktif</p>
                                    <div class="flex justify-content-between align-items-center"> 
                                        <p class="caption-small-reguler">Rp 220.000</p>
                                        <p class="caption-small-reguler">14 Item</p>                         
                                    </div>                          
                                </div>
                                <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/sales-marketing4-courses-image.png" alt="gambar courses" />
                                <div class="flex-column gap-1">
                                    <p class="body-small-medium" style="color:#29939D;">Sales Marketing</p>
                                    <p class="body-small-medium" >Pengenalan Sales Marketing</p>
                                    <div class="flex justify-content-between align-items-center"> 
                                        <p class="caption-small-reguler">Rp 140.000</p>
                                        <p class="caption-small-reguler">10 Item</p>                         
                                    </div>                          
                                </div>
                                <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/building-trust2-courses-image.png" alt="gambar courses" />
                                <div class="flex-column gap-1">
                                    <p class="body-small-medium" style="color: #9B51E0;">Building Trust</p>
                                    <p class="body-small-medium" >Profiling Diri</p>
                                    <div class="flex justify-content-between align-items-center"> 
                                        <p class="caption-small-reguler">Rp 164.000</p>
                                        <p class="caption-small-reguler">9 Item</p>                         
                                    </div>                          
                                </div>
                                <Button type="link" href="/courses/detail" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="testimoni" class="section">
        <div class="container flex-column pb-6 gap-4">
            <div class="flex justify-content-between">
                <div class="h4 tc-dark">Testimoni Karyawan</div>
                <Button type="link" classList="link body-large-reguler tc-dark" href="/testimoni">Lihat Semua</Button>
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
                                <div class="body-small-semi-bold tc-dark">4.8</div>
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
                                <div class="body-small-semi-bold tc-dark">4.8</div>
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
                                <div class="body-small-semi-bold tc-dark">4.8</div>
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