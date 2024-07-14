<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import ApiController from "$lib/ApiController";
    import Button from "@components/Button.svelte";
	import Footer from "@components/Footer.svelte";
    import InputField from "@components/InputField.svelte";
    import Navbar from "@components/Navbar.svelte";
	import SortMenu from "@components/SortMenu.svelte";
	import { DataHandler } from "@vincjo/datatables";
	import { onMount } from "svelte";
    import StarFill from "svelte-bootstrap-icons/lib/StarFill.svelte"

    let handler, rows, pageCount, pageNumber
    let option = [
        {val: "newest", label:"Terbaru"},
        {val: "asc", label: 'A-Z'},
        {val: "desc", label:'Z-A'}
    ]

    const handleSort = (evt) => {
        let sortBy = evt.target.value

        if(sortBy == 'newest'){
            handler.sortDesc('created_at')
        }else if(sortBy == 'asc'){
            handler.sortAsc('title')
        }else if(sortBy == 'desc'){
            handler.sortDesc('title')
        }else{
            handler.clearSort()
        }
    }

    let testimonials
    let status = false
    let courses
    const getCourses = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "course/get",
        }).then(response => {
            courses = response.data.courses
            handler = new DataHandler(courses)
            rows = handler.getRows()
            pageCount = handler.getPageCount()
            pageNumber = handler.getPageNumber()
            handler.sortDesc('created_at')
            status = true
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
        getCourses()
        getTestimonials()
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
                    <SortMenu options={option} action={handleSort} />
                </div>

                <div class="row">
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
                                        <p class="caption-small-reguler">{ course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) }</p>
                                        <p class="caption-small-reguler">{ course.items } Item</p>                         
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

    .avatar {
		aspect-ratio: 1/1;
		border-radius: .25rem;
		object-fit: cover;
		object-position: center;
	}

	.ellipsis {
		width: 100%;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>

<svelte:head>
	<title>Online Course | Materi</title>
</svelte:head>