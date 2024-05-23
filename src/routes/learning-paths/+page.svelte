<script>
    import Navbar from "@components/Navbar.svelte";
    import InputField from "@components/InputField.svelte";
    import Button from "@components/Button.svelte"
    import Footer from "@components/Footer.svelte"

    let option = [
        {value: "newest", text:"Terbaru"}, 
        {value: "asc", text: 'A-Z'}, 
        {value: "desc", text: "Z-A"}
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

<Navbar active="alur belajar"/>

<main class="mb-6">
    <section id="learning-paths" class="section">
        <div class="container">
            <div class="flex-column gap-3">
                <div class="flex justify-content-between align-items-center">
                    <h4>Alur Pembelajaran</h4>
                    <InputField type="select-option" id="select-default" 
                        containerClass="grow-item grow-auto-md"   
                        inputClass="input-bg-neutral pr-8" 
                        onInput={handleSort}
                        value={sortBy} option={option}/>
                </div>
    
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/learning-path-image.png" alt="gambar learning path" />
                                <div class="flex-column">
                                    <p class="body-small-medium">Sales Marketing</p>
                                    <p class="caption-small-reguler">24 Materi</p>
                                </div>
                                <Button type="link" href="/learning-paths/detail" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/learning-path-image.png" alt="gambar learning path" />
                                <div class="flex-column">
                                    <p class="body-small-medium">Sales Marketing</p>
                                    <p class="caption-small-reguler">24 Materi</p>
                                </div>
                                <Button classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/learning-path-image.png" alt="gambar learning path" />
                                <div class="flex-column">
                                    <p class="body-small-medium">Sales Marketing</p>
                                    <p class="caption-small-reguler">24 Materi</p>
                                </div>
                                <Button classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/learning-path-image.png" alt="gambar learning path" />
                                <div class="flex-column">
                                    <p class="body-small-medium">Sales Marketing</p>
                                    <p class="caption-small-reguler">24 Materi</p>
                                </div>
                                <Button classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="/images/learning-path-image.png" alt="gambar learning path" />
                                <div class="flex-column">
                                    <p class="body-small-medium">Sales Marketing</p>
                                    <p class="caption-small-reguler">24 Materi</p>
                                </div>
                                <Button classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>  
</main>

<Footer/>