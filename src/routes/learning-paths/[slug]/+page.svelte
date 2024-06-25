<script>
    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";

    import { PeopleFill, BookFill, StarFill } from "svelte-bootstrap-icons";
	import Button from "@components/Button.svelte";
	import { onMount } from "svelte";
	import ApiController from "$lib/ApiController.js";

    export let data
    let slug = data.slug

    let detail, status = false

    onMount(() => {
        ApiController.sendRequest({
            endpoint: `learning-path/get/${slug}`,
            method: "GET",
        }).then(response => {
            console.log(response)
            detail = response.data
            status = true
        })
    })
</script>


<Navbar active="alur belajar" />

{#if  status}
<main>
    <section id="header" class="section">
        <div class="container">
            <div class="row justify-content-between">
                <div class="col-md-6">
                    <img src="/images/learning-path-image.png" class="thumbnail" alt="thumbnail">
                </div>
                <div class="col-md-5">
                    <div class="flex-column justify-content-center h-100 gap-large">
                        <div class="flex-column gap-standard">
                            <div class="flex">
                                <h4 class="label-bullet mb-0" style="color: {detail.color};"> </h4>
                                <h4 class="mb-0">{detail.title}</h4>
                            </div>
                            <p>{@html detail.description}</p>
                        </div>
                        <div class="flex-column gap-standard">
                            <div class="flex align-items-center gap-4">
                                <BookFill color="#3951A8"/>
                                <p class="body-super-large-reguler">{detail.courses.length} Materi</p>
                            </div>
                            <div class="flex align-items-center gap-4">
                                <PeopleFill color="#3951A8"/>
                                <p class="body-super-large-reguler">127 total karyawan terdaftar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="path" class="section">
        <div class="container">
            {#if detail.courses.length > 0}
            {#each detail.courses as course, index}
            <div class="course">
                <div class="course-step body-large-semi-bold">Langkah {index + 1}</div>
                <div class="row justify-content-center w-100" style="padding: 80px 0;">
                    <div class="col-12 col-md-6">
                        <div class="card radius-sm neutral-border">
                            <div class="flex align-items-center gap-8">
                                <img src="/images/sales-marketing4-courses-image.png" 
                                    alt="thumbnail course" class="w-50">
                                <div class="flex-column gap-5 w-50">
                                    <div class="flex-column gap-standard">
                                        <p class="body-large-semi-bold">{course.title}</p>
                                        <div class="flex body-medium-reguler justify-content-between align-items-center">
                                            <p>{course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</p>
                                            <div class="flex align-items-center gap-2">
                                                <StarFill color="#FF9933"/>
                                                <p>{course.rating}</p>
                                            </div>
                                            <p>{course.items} Item</p>
                                        </div>
                                    </div>
                                    <Button type="link" href="/courses/{course.slug}" classList="btn btn-main">Lihat Detail</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/each}    
            {/if}
        </div>
    </section>
</main>

<Footer />

{/if}

<svelte:head>
    <title>Loading...</title>

    <style>
        #header {
            background-color: var(--neutral-surface);
        }
    
        .thumbnail {
            width: 100%;
            aspect-ratio: 4 / 3;
        }
    
        p {
            font-family: Poppins;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            text-align: justified;
        }

        .gap-large {
            gap: 4.5rem;
        }

        .course {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .course-step {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 100%;
            padding: 0.875rem;
            color: var(--primary-main);
        }

        .course-step::before,
        .course-step::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid var(--neutral-border);
            margin: 0 1rem;
        }
    </style>
</svelte:head>