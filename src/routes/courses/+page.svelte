<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import ApiController from "$lib/ApiController";
    import Button from "@components/Button.svelte";
	import Footer from "@components/Footer.svelte";
    import InputField from "@components/InputField.svelte";
    import Navbar from "@components/Navbar.svelte";
	import { onMount } from "svelte";
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


    let status = false
    let courses
    const getCourses = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "course/get",
        }).then(response => {
            courses = response.data.courses
            status = true
        })
    }

    onMount(() => {
        getCourses()
    })

</script>

<Navbar active="materi"/>

{#if status}
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
                    {#each courses as course}
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="{PUBLIC_SERVER_PATH}/storage/{ course.thumbnail }" class="course-thumbnail" alt="gambar courses" />
                                <div class="flex-column gap-1">
                                    {#if course.learning_path}
                                    <p class="body-small-medium label-bullet" style="color: { course.learning_path.color } ;">{ course.learning_path.title }</p>
                                    {:else}
                                    <p class="body-small-medium label-bullet">Belum ada alur belajar</p>
                                    {/if}
                                    <p class="body-small-medium">{ course.title }</p>
                                    <div class="flex justify-content-between align-items-center"> 
                                        <p class="caption-small-reguler">{ course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) }</p>
                                        <p class="caption-small-reguler">{ course.items } Item</p>                         
                                    </div>                          
                                </div>
                                <Button type="link" href="/courses/{ course.id }" classList="btn btn-main">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
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

{/if}

<style>
    .course-thumbnail {
        border-radius: .25rem;
        aspect-ratio: 4/3; 
        object-fit: cover; 
        object-position: center;
    }

    .section { 
        padding-bottom: 0;
    }
</style>

<svelte:head>
	<title>Online Course | Materi</title>
</svelte:head>