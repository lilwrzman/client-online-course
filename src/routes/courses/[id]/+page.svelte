<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import Navbar from '@components/Navbar.svelte';
	import Footer from '@components/Footer.svelte';
	import Button from '@components/Button.svelte';
	import Tab from '@components/Tab.svelte';

	import {
		BookFill,
		PeopleFill,
		StarFill,
		PersonFill,
		Instagram,
		Facebook,
		PlayCircle,
		Clock,
		Pass,
		FileEarmarkText
	} from 'svelte-bootstrap-icons';
	import ApiController from '$lib/ApiController';
	import formatTime from '$lib/Duration';

	let active = 'description';
	let detail, status = false

	const getDetail = () => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: `course/get/${$page.params.id}`
		}).then(response => {
			detail = response.data
			status = true
		})
	}

	onMount(() => {
		getDetail()
	})
</script>

<Navbar active="materi" />

{#if status}
<main>
	<section id="header" class="section" style="padding-bottom: 5rem;">
		<div class="container">
			<div class="row justify-content-between">
				<div class="col-md-6">
					<img src="{PUBLIC_SERVER_PATH}/storage/{detail.thumbnail}" class="radius-sm thumbnail" alt="thumbnail" />
				</div>
				<div class="col-md-5">
					<div class="flex-column justify-content-center h-100 gap-large">
						<div class="flex-column gap-standard">
							<div class="flex">
								<h4 class="mb-0">{ detail.title }</h4>
							</div>
						</div>
						<div class="flex-column gap-standard">
							<div class="flex align-items-center gap-4">
								<BookFill color="#3951A8" />
								<p class="body-super-large-reguler">{ detail.items.length } item</p>
							</div>
							<div class="flex align-items-center gap-4">
								<PeopleFill color="#3951A8" />
								<p class="body-super-large-reguler">127 karyawan terdaftar</p>
							</div>
							<div class="flex align-items-center gap-4">
								<StarFill color="#FF9933" />
								<p class="body-super-large-reguler">{detail.rating}</p>
							</div>
							<div class="flex align-items-center gap-4">
								<PersonFill color="#3951A8" />
								<p class="body-super-large-reguler">{detail.teacher.info.fullname}</p>
							</div>
						</div>
						<div class="flex justify-content-between align-items-center">
							<p class="body-large-reguler">{detail.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</p>
							<Button type="link" href="/courses/{detail.id}/checkout" classList="btn btn-main">Mulai Belajar</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="description" class="section">
		<div class="container">
			<div class="flex-column gap-7">
				<Tab type="link"
					menus={[
						{ title: 'Deskripsi', href: `/courses/${$page.params.id}#description`, active: $page.url.hash == '#description' },
						{ title: 'Silabus', href: `/courses/${$page.params.id}#syllabus`, active: $page.url.hash == '#syllabus' },
						{ title: 'Pemateri', href: `/courses/${$page.params.id}#teacher`, active: $page.url.hash == '#teacher' },
						{ title: 'Testimoni', href: `/courses/${$page.params.id}#testimonials`, active: $page.url.hash == '#testimonials' }
					]}
				/>

				<div class="row">
					<div class="col-8">
						{@html detail.description}
					</div>
					<div class="col-4">
						<div class="flex-column gap-5">
							<div>
								<p class="body-medium-semi-bold mb-2">Fasilitas Pembelajaran</p>
								{#each detail.facilities as facility}
								<p>{ facility }</p>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="syllabus" class="section">
		<div class="container">
			<div class="course-step body-large-semi-bold">Silabus</div>
			{#each detail.items as item}
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12 col-md-8">
					<div class="card radius-sm neutral-border">
						<div class="flex-column gap-7">
							<div class="flex-column gap-3">
								<p class="body-super-large-semi-bold">{ item.title }</p>
								<p class="body-small-reguler truncate">{@html item.description }</p>
								<div class="flex body-medium-reguler justify-content-between">
									<div class="flex align-items-center gap-3">
										{#if item.type == 'Video'}
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<PlayCircle />
											<p class="caption-small-reguler">Video</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">{ formatTime(item.info.duration) }</p>
										</div>
										{:else if item.type == 'Quiz'}
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<FileEarmarkText />
											<p class="caption-small-reguler">Kuis</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">{ item.questions.length } soal</p>
										</div>
										{:else if item.type == 'Exam'}
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<Pass />
											<p class="caption-small-reguler">Ujian</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">{ item.questions.length } soal</p>
										</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/each}
		</div>
	</section>

	<section id="teacher" class="section">
		<div class="container">
			<div class="course-step body-large-semi-bold">Pemateri</div>
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12">
					<div class="card radius-sm neutral-border">
						<div class="flex align-items-center gap-5">
							<img
								src="{PUBLIC_SERVER_PATH}/storage/{detail.teacher.avatar}"
								alt="thumbnail student"
								class="w-25 teacher-img"
							/>
							<div class="flex-column gap-5">
								<div class="flex-column gap-5">
									<p class="body-super-large-semi-bold">{detail.teacher.info.fullname}</p>
									<p class="body-small-reguler">{detail.teacher.info.bio}</p>
									<div class="flex body-medium-reguler justify-content-between">
										<div class="flex align-items-center gap-8">
											{#each detail.teacher.info.social_media as sosmed}
											{#if sosmed.type == 'Facebook'}
											<a href="{sosmed.url}" class="flex gap-2">
												<Facebook color="#3951A8" />
												<p>{sosmed.username}</p>
											</a>
											{:else if sosmed.type == 'Instagram'}
											<a href="{sosmed.url}" class="flex gap-2">
												<Instagram color="#3951A8" />
												<p>{sosmed.username}</p>
											</a>
											{/if}
											{/each}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="testimonials" class="section">
		<div class="container">
			<div class="course-step body-large-semi-bold">Testimoni</div>
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="row justify-content-start">
					<div class="col-lg-4 flex gap-2 mb-3">
						<img src="/images/testimoni-karyawan-image.png" alt="" />
						<div class="flex-column gap-2">
							<div class="flex justify-content-between align-items-center">
								<div class="flex-column gap-1">
									<div class="body-large-semi-bold tc-dark">Michael Hernandez</div>
									<div class="body-small-reguler tc-dark">Sales Marketing</div>
								</div>
								<div class="flex gap-1 align-items-baseline">
									<div class="body-small-semi-bold tc-dark">4.8</div>
									<StarFill fill="#FF9933" />
								</div>
							</div>
							<div class="caption-light tc-dark">
								Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas
								ilmunya yang bermanfaat.
							</div>
						</div>
					</div>
					<div class="col-lg-4 flex gap-2 mb-3">
						<img src="/images/testimoni-karyawan-image.png" alt="" />
						<div class="flex-column gap-2">
							<div class="flex justify-content-between align-items-center">
								<div class="flex-column gap-1">
									<div class="body-large-semi-bold tc-dark">Michael Hernandez</div>
									<div class="body-small-reguler tc-dark">Sales Marketing</div>
								</div>
								<div class="flex gap-1 align-items-baseline">
									<div class="body-small-semi-bold tc-dark">4.8</div>
									<StarFill fill="#FF9933" />
								</div>
							</div>
							<div class="caption-light tc-dark">
								Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas
								ilmunya yang bermanfaat.
							</div>
						</div>
					</div>
					<div class="col-lg-4 flex gap-2 mb-3">
						<img src="/images/testimoni-karyawan-image.png" alt="" />
						<div class="flex-column gap-2">
							<div class="flex justify-content-between align-items-center">
								<div class="flex-column gap-1">
									<div class="body-large-semi-bold tc-dark">Michael Hernandez</div>
									<div class="body-small-reguler tc-dark">Sales Marketing</div>
								</div>
								<div class="flex gap-1 align-items-baseline">
									<div class="body-small-semi-bold tc-dark">4.8</div>
									<StarFill fill="#FF9933" />
								</div>
							</div>
							<div class="caption-light tc-dark">
								Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas
								ilmunya yang bermanfaat.
							</div>
						</div>
					</div>
				</div>
				<div class="row justify-content-start">
					<div class="col-lg-4 flex gap-2 mb-3">
						<img src="/images/testimoni-karyawan-image.png" alt="" />
						<div class="flex-column gap-2">
							<div class="flex justify-content-between align-items-center">
								<div class="flex-column gap-1">
									<div class="body-large-semi-bold tc-dark">Michael Hernandez</div>
									<div class="body-small-reguler tc-dark">Sales Marketing</div>
								</div>
								<div class="flex gap-1 align-items-baseline">
									<div class="body-small-semi-bold tc-dark">4.8</div>
									<StarFill fill="#FF9933" />
								</div>
							</div>
							<div class="caption-light tc-dark">
								Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas
								ilmunya yang bermanfaat.
							</div>
						</div>
					</div>
					<div class="col-lg-4 flex gap-2 mb-3">
						<img src="/images/testimoni-karyawan-image.png" alt="" />
						<div class="flex-column gap-2">
							<div class="flex justify-content-between align-items-center">
								<div class="flex-column gap-1">
									<div class="body-large-semi-bold tc-dark">Michael Hernandez</div>
									<div class="body-small-reguler tc-dark">Sales Marketing</div>
								</div>
								<div class="flex gap-1 align-items-baseline">
									<div class="body-small-semi-bold tc-dark">4.8</div>
									<StarFill fill="#FF9933" />
								</div>
							</div>
							<div class="caption-light tc-dark">
								Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas
								ilmunya yang bermanfaat.
							</div>
						</div>
					</div>
					<div class="col-lg-4 flex gap-2 mb-3">
						<img src="/images/testimoni-karyawan-image.png" alt="" />
						<div class="flex-column gap-2">
							<div class="flex justify-content-between align-items-center">
								<div class="flex-column gap-1">
									<div class="body-large-semi-bold tc-dark">Michael Hernandez</div>
									<div class="body-small-reguler tc-dark">Sales Marketing</div>
								</div>
								<div class="flex gap-1 align-items-baseline">
									<div class="body-small-semi-bold tc-dark">4.8</div>
									<StarFill fill="#FF9933" />
								</div>
							</div>
							<div class="caption-light tc-dark">
								Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas
								ilmunya yang bermanfaat.
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-row-reverse">
				<Button type="link" classList="link body-large-reguler tc-dark" href="/testimonials"
					>Lihat Semua Testimoni</Button
				>
			</div>
		</div>
	</section>
</main>

<Footer />

{/if}

<svelte:head>
	<title>{ status ? 'Materi: ' + detail.title : 'Loading...' }</title>

	<style>
		.section {
			padding-bottom: 0;
		}

		#header {
			background-color: var(--neutral-surface);
		}

		.thumbnail {
			width: 100%;
			aspect-ratio: 4 / 3;
			object-fit: cover;
			object-position: center;
		}

		.teacher-img {
			border-radius: 0.25rem;
			aspect-ratio: 4/3;
			object-fit: cover;
			object-position: center;
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

		.truncate {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	</style>
</svelte:head>
