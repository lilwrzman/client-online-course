<script>
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';

    import { getFlash } from "$lib/Flash"

    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";
    import Button from "@components/Button.svelte";
    import Toast from '@components/Toast.svelte';
    import StarFill from "svelte-bootstrap-icons/lib/StarFill.svelte"
	import { onMount } from 'svelte';
	import { extract } from '$lib/Cookie';
	import { PUBLIC_SERVER_PATH } from '$env/static/public';
	import ApiController from '$lib/ApiController';
	import { DataHandler } from '@vincjo/datatables';
	import { getDay } from '$lib/Date';

    let toastData
    let toastVisible = false

    let handler, rows, pageCount, pageNumber

    let flashes

    let courses
    let events
    let testimonials

    const getCourses = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "course/get",
        }).then(response => {
            courses = response.data.courses
            courses = courses.slice(0, 4)
            handler = new DataHandler(courses)
            rows = handler.getRows()
            pageCount = handler.getPageCount()
            pageNumber = handler.getPageNumber()
            handler.sortDesc('rating')
        })
    }

	const getEvents = () => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: "events/get"
		}).then(response => {
			if(response.status){
				events = response.data
			}
		}).catch(e => {
			let error = e.response.data
			console.error(error)
		})
	}

    const getTestimonials = () => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: "feedback/get"
		}).then(response => {
			if(response.status){
				testimonials = response.data.map(elm => {
					return {
						id: elm.id,
						rating: elm.rating,
						review: elm.review,
						created_at: elm.created_at,
						user_id: elm.user_id,
						course_id: elm.course_id,
						course_title: elm.course.title,
						reviewer: elm.user.info.fullname,
						reviewer_avatar: elm.user.avatar
					}
				})

                testimonials = testimonials.slice(0, 3)
			}
		})
	}

    onMount(() => {
        flashes = getFlash()
        if(flashes){
            toastData = {
                title: flashes.title,
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }

        getCourses()
        getEvents()
        getTestimonials()
    })
</script>

<Navbar active="beranda" />

<main>
    {#if toastVisible}
        <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
    {/if}
    <section id="header" class="section">
        <div class="container">
            <div class="row">
                <div class="col align-self-center">
                    <div class="flex-column gap-2">
                        <div class="h3 tc-dark">Belajar dengan Citratama, Mudah dan Menyenangkan</div>
                        <div class="body-large-semi-bold tc-dark">Belajar kapan saja, di mana saja dengan materi berkualitas!</div>
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
                <Button type="link" classList="link body-large-reguler tc-dark" href="/courses">Lihat Semua</Button>
            </div>
            <div class="row justify-content-between">
                {#if $rows}
                {#if $rows.length > 0}
                {#each $rows as course, index (course.id)}
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
                                    <p class="caption-small-reguler mt-1">{ course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) }</p>
                                    <div class="flex gap-2 align-items-center justify-content-center">
                                        <p class="caption-small-reguler mt-1">{ course.rating }</p>        
                                        <StarFill fill="#FF9933" />           
                                    </div>
                                </div>                          
                            </div>
                            {#if course.isPublished}
                            <Button type="link" href="/courses/{ course.id }" classList="btn btn-main">Lihat Detail</Button>
                            {:else}
                            <Button disabled={true} classList="btn btn-main">Akan Datang</Button>
                            {/if}
                        </div>
                    </div>
                </div>
                {/each}
                {/if}
                {/if}
            </div>
        </div>
    </section>

    <section id="event" class="section">
        <div class="container">
            {#if events}
            {#if events.length}
            <Splide aria-label="My Favorite Images" options={{
                type: 'loop',
                perPage: 1,
                autoplay: true,
                lazyLoad: true,
                padding: '8rem'
            }}>
                {#each events as event}
                <SplideSlide>
                    <div class="container flex justify-content-center">
                        <div class="flex-column align-items-center gap-3 neutral-border radius-sm">
                            <img src="{PUBLIC_SERVER_PATH}/storage/{event.thumbnail}" alt="gambar courses" class="event-thumbnail" />
                            <div class="flex-column align-items-center pb-3">
                                <h4 class="mb-0">{event.title}</h4>
                                <p class="body-medium-reguler mb-0">{getDay(event.date)} | {event.start.substring(0, 5)} - {event.end.substring(0, 5)}</p>
                                <p class="body-medium-reguler mb-0">{event.place}</p>
                                {#if event.link}
                                <a href="{event.link}" target="_blank" class="link tc-primary-main">Daftar Disini</a>
                                {/if}
                            </div>
                        </div>
                    </div>
                </SplideSlide>
                {/each}
            </Splide>
            {/if}
            {/if}
        </div>
    </section>

    <section id="testimoni" class="section">
        <div class="container flex-column pb-6 gap-4">
            <div class="flex justify-content-between">
                <div class="h4 tc-dark">Testimoni Karyawan</div>
                <Button type="link" classList="link body-large-reguler tc-dark" href="/testimonials">Lihat Semua</Button>
            </div>
            <div class="row">
                {#if testimonials}
                {#if testimonials.length > 0}
                {#each testimonials as feedback}
                <div class="col-lg-4">
                    <div class="flex gap-2 mb-3">
                        <div class="flex align-items-center justify-content-center">
                            <img src="{PUBLIC_SERVER_PATH}/storage/{feedback.reviewer_avatar}" alt="avatar" width="100" height="100" class="avatar">
                        </div>
                        <div class="flex-column gap-2" style="flex: 1 1 auto; min-width: 0; max-width: 100%;">
                            <div class="flex justify-content-between">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold tc-dark">{feedback.reviewer}</div>
                                    <div class="body-small-reguler tc-dark">{feedback.course_title}</div>
                                </div>
                                <div class="flex gap-1">
                                    <p class="body-small-semi-bold tc-dark">{feedback.rating}</p>
                                    <StarFill fill="#FF9933" />
                                </div>
                            </div>
                            <p class="caption-light tc-dark ellipsis">{feedback.review}</p>
                        </div>
                    </div>
                </div>
                {/each}
                {:else}
                <div class="col-12">
                    <div class="flex align-items-center justify-content-center">
                        <p class="body-small-reguler">Belum ada umpan balik!</p>
                    </div>
                </div>
                {/if}
                {:else}
                <div class="col-12">
                    <div class="flex align-items-center justify-content-center">
                        <p class="body-small-reguler">Memuat data...</p>
                    </div>
                </div>
                {/if}
            </div>
        </div>
    </section>
</main>

<Footer/>

<svelte:head>
	<title>Online Course | Beranda</title>
</svelte:head>

<style>
    .section { 
        padding-bottom: 0;
    }

    .course-thumbnail {
        border-radius: .25rem;
        aspect-ratio: 4/3; 
        object-fit: cover; 
        object-position: center;
    }

    .event-thumbnail {
		aspect-ratio: 16 / 9;
		border-radius: .25rem .25rem 0 0;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
</style>