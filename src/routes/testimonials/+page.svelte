<script>
	import Navbar from '@components/Navbar.svelte';
	import InputField from '@components/InputField.svelte';
	import Footer from '@components/Footer.svelte';
	import StarFill from 'svelte-bootstrap-icons/lib/StarFill.svelte';
	import ApiController from '$lib/ApiController';
	import { afterUpdate, onMount } from 'svelte';
	import { DataHandler, check } from '@vincjo/datatables';
	import { PUBLIC_SERVER_PATH } from '$env/static/public';
	import SortMenu from '@components/SortMenu.svelte';
	import FilterMenu from '@components/FilterMenu.svelte';
	import Button from '@components/Button.svelte';
	import Modal from '@components/Modal.svelte';

	let testimonials
	let handler, rows, pageCount, pageNumber, rowsPerPage = 15

	let selectedTestimoni
	let modalShow = false

	let sortOptions = [
		{ val: 'newest', label: 'Terbaru' },
		{ val: 'oldest', label: 'Terlama' },
		{ val: 'reviewer_asc', label: 'Nama A-Z' },
		{ val: 'reviewer_desc', label: 'Nama Z-A' },
		{ val: 'course_asc', label: 'Materi A-Z' },
		{ val: 'course_desc', label: 'Materi Z-A' }
	];

	let filterOptions = []

	const handleSort = (evt) => {
		let sortBy = evt.target.value;

		if (sortBy == 'newest') {
			handler.sortDesc('created_at');
		} else if (sortBy == 'oldest') {
			handler.sortAsc('created_at');
		} else if (sortBy == 'reviewer_asc') {
			handler.sortAsc('reviewer');
		} else if (sortBy == 'reviewer_desc') {
			handler.sortDesc('reviewer');
		} else if (sortBy == 'course_desc') {
			handler.sortDesc('course_title');
		} else if (sortBy == 'course_desc') {
			handler.sortDesc('course_title');
		} else {
			handler.clearSort()
		}
	};

	const handleFilter = (evt) => {
		let filterBy = evt.target.value

		if(filterBy){
			handler.filter(filterBy, 'course_title', check.isEqualTo)
		}else{
			handler.clearFilters()
		}
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

				handler = new DataHandler(testimonials, {rowsPerPage})
                rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
                handler.sortDesc('created_at')

				filterOptions = testimonials.map(elm => ({val: elm.course_title, label: elm.course_title}))
				filterOptions = Array.from(new Set(filterOptions.map(a => JSON.stringify(a)))).map(e => JSON.parse(e))
			}
		})
	}

	onMount(() => {
		getTestimonials()
	}) 

	afterUpdate(() => {
		document.querySelectorAll('.ellipsis').forEach((reviewElement) => {
			const lineHeight = parseFloat(getComputedStyle(reviewElement).lineHeight);
			const maxLines = 2;
			const maxHeight = lineHeight * maxLines;

			if (reviewElement.scrollHeight > maxHeight) {
				const button = reviewElement.nextElementSibling;
				button.style.display = 'inline-block';
			}
		});
	})
</script>

<Navbar active="" />

<main class="mb-6">
	<section id="testimonials" class="section">
		<div class="container">
			<div class="flex-column gap-3">
				<div class="flex justify-content-between align-items-center">
					<h4>Testimoni Karyawan</h4>
					<div class="flex gap-2">
						<SortMenu
							options={sortOptions}
							action={handleSort}
						/>

						<FilterMenu options={filterOptions} action={handleFilter} />
					</div>
				</div>

				<div class="row justify-content-start">
					{#if $rows}
					{#if $rows.length > 0}
					{#each $rows as feedback, index (feedback.id)}
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
								<div class="show-more-button" style="display: none;">
									<Button classList="btn btn-no-padding link" onClick={() => {
										selectedTestimoni = feedback
										modalShow = true
									}}>
										<p class="tc-primary-main caption-semi-light mb-0">Baca Selengkapnya</p>
									</Button>
								</div>
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
		</div>
	</section>
</main>

{#if modalShow}
    <Modal bind:modalShow>
        <div class="card-body">
            <div class="flex gap-2 mb-3">
				<div class="flex align-items-center justify-content-center">
					<img src="{PUBLIC_SERVER_PATH}/storage/{selectedTestimoni.reviewer_avatar}" alt="avatar" width="100" height="100" class="avatar">
				</div>
				<div class="flex-column gap-2" style="flex: 1 1 auto; min-width: 0; max-width: 100%;">
					<div class="flex justify-content-between">
						<div class="flex-column gap-1">
							<div class="body-large-semi-bold tc-dark">{selectedTestimoni.reviewer}</div>
							<div class="body-small-reguler tc-dark">{selectedTestimoni.course_title}</div>
						</div>
						<div class="flex gap-1">
							<p class="body-small-semi-bold tc-dark">{selectedTestimoni.rating}</p>
							<StarFill fill="#FF9933" />
						</div>
					</div>
					<p class="caption-light tc-dark">{selectedTestimoni.review}</p>
				</div>
			</div>
			<Button classList="btn btn-main-outline" onClick={() => {
				modalShow = false
				selectedTestimoni = null
			}}>Tutup</Button>
        </div>  
    </Modal> 
{/if}

<Footer />

<svelte:head>
	<title>Online Course | Umpan Balik</title>
</svelte:head>

<style>
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