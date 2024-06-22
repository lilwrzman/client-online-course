<script>
	import Navbar from '@components/Navbar.svelte';
	import Footer from '@components/Footer.svelte';

	import {
		BookFill,
		PeopleFill,
		StarFill,
		PersonFill,
		Instagram,
		Facebook,
		PlayCircle,
		Clock,
		Folder2
	} from 'svelte-bootstrap-icons';
	import Button from '@components/Button.svelte';
	import Tab from '@components/Tab.svelte';

	let active = 'description';
</script>

<Navbar active="materi" />

<main>
	<section id="header" class="section">
		<div class="container">
			<div class="row justify-content-between">
				<div class="col-md-6">
					<img src="/images/sales-marketing4-courses-image.png" class="thumbnail" alt="thumbnail" />
				</div>
				<div class="col-md-5">
					<div class="flex-column justify-content-center h-100 gap-large">
						<div class="flex-column gap-standard">
							<div class="flex">
								<h4 class="mb-0">Pengenalan Sales Marketing</h4>
							</div>
						</div>
						<div class="flex-column gap-standard">
							<div class="flex align-items-center gap-4">
								<BookFill color="#3951A8" />
								<p class="body-super-large-reguler">10 item</p>
							</div>
							<div class="flex align-items-center gap-4">
								<PeopleFill color="#3951A8" />
								<p class="body-super-large-reguler">127 karyawan terdaftar</p>
							</div>
							<div class="flex align-items-center gap-4">
								<StarFill color="#FF9933" />
								<p class="body-super-large-reguler">4.8</p>
							</div>
							<div class="flex align-items-center gap-4">
								<PersonFill color="#3951A8" />
								<p class="body-super-large-reguler">Yunizel Bach</p>
							</div>
						</div>
						<div class="flex justify-content-between align-items-center">
							<p class="body-large-reguler">Rp 140.000</p>
							<Button classList="btn btn-main">Mulai Belajar</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="content" class="section">
		<div class="container">
			<div class="flex-column gap-7">
				<Tab
					type="variable"
					bind:value={active}
					menus={[
						{ title: 'Deskripsi', value: 'description' },
						{ title: 'Silabus', value: 'submateri' },
						{ title: 'Pemateri', value: 'teacher' },
						{ title: 'Testimoni', value: 'testimonials' }
					]}
				/>

				<div class="row">
					<div class="col-8">
						<h5 class="mb-2">Sales Marketing</h5>
						<p class="body-medium-regular">
							Sales marketing adalah konsep yang mencakup berbagai strategi dan taktik yang
							digunakan oleh perusahaan untuk menjual produk atau jasa mereka kepada pelanggan.
							Sales, atau penjualan, berfokus pada interaksi langsung dengan pelanggan, yang
							melibatkan proses mulai dari prospekting, pendekatan, presentasi produk, menangani
							keberatan, hingga menutup penjualan dan melakukan tindak lanjut. Sementara itu,
							marketing, atau pemasaran, memiliki cakupan yang lebih luas yaitu mencakup berikut
							dibawah ini. Sales marketing adalah konsep yang mencakup berbagai strategi dan taktik
							yang digunakan oleh perusahaan untuk menjual produk atau jasa mereka kepada pelanggan.
							Sales, atau penjualan, berfokus pada interaksi langsung dengan pelanggan, yang
							melibatkan proses mulai dari prospekting, pendekatan, presentasi produk, menangani
							keberatan, hingga menutup penjualan dan melakukan tindak lanjut. Sementara itu,
							marketing, atau pemasaran, memiliki cakupan yang lebih luas yaitu mencakup berikut
							dibawah ini. Sales marketing adalah konsep yang mencakup berbagai strategi dan taktik
							yang digunakan oleh perusahaan untuk menjual produk atau jasa mereka kepada pelanggan.
							Sales, atau penjualan, berfokus pada interaksi langsung dengan pelanggan, yang
							melibatkan proses
						</p>
					</div>
					<div class="col-4">
						<div class="flex-column gap-5">
							<div>
								<p class="body-medium-semi-bold mb-2">Fasilitas Pembelajaran</p>
								<p>Materi Elektronik : Materi disajikan dalam bentuk video</p>
								<p>Forum diskusi : Setiap materi memiliki sebuah forum diskusi</p>
								<p>Evaluasi pembelajaran : Ujian akhir kelas</p>
								<p>Sertifikat kompetensi</p>
							</div>
							<div>
								<p class="body-medium-semi-bold mb-2">Fasilitas Pembelajaran</p>
								<p>Materi Elektronik : Materi disajikan dalam bentuk video</p>
								<p>Forum diskusi : Setiap materi memiliki sebuah forum diskusi</p>
								<p>Evaluasi pembelajaran : Ujian akhir kelas</p>
								<p>Sertifikat kompetensi</p>
							</div>
							<div>
								<p class="body-medium-semi-bold mb-2">Fasilitas Pembelajaran</p>
								<p>Materi Elektronik : Materi disajikan dalam bentuk video</p>
								<p>Forum diskusi : Setiap materi memiliki sebuah forum diskusi</p>
								<p>Evaluasi pembelajaran : Ujian akhir kelas</p>
								<p>Sertifikat kompetensi</p>
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
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12 col-md-10">
					<div class="card radius-sm neutral-border">
						<div class="flex-column gap-7">
							<div class="flex-column gap-3">
								<p class="body-super-large-semi-bold">Persiapan Belajar</p>
								<p class="body-small-reguler">
									Memahami rincian materi, fasilitas pembelajaran, dan lainnya. Memahami rincian
									materi, fasilitas pembelajaran, dan lainnya.
								</p>
								<div class="flex body-medium-reguler justify-content-between">
									<div class="flex align-items-center gap-3">
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<PlayCircle color="#000000" />
											<p class="caption-small-reguler">Video</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">12 menit</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12 col-md-10">
					<div class="card radius-sm neutral-border">
						<div class="flex-column gap-7">
							<div class="flex-column gap-3">
								<p class="body-super-large-semi-bold">Persiapan Belajar</p>
								<p class="body-small-reguler">
									Memahami rincian materi, fasilitas pembelajaran, dan lainnya. Memahami rincian
									materi, fasilitas pembelajaran, dan lainnya.
								</p>
								<div class="flex body-medium-reguler justify-content-between">
									<div class="flex align-items-center gap-3">
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<PlayCircle color="#000000" />
											<p class="caption-small-reguler">Video</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">12 menit</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12 col-md-10">
					<div class="card radius-sm neutral-border">
						<div class="flex-column gap-7">
							<div class="flex-column gap-3">
								<p class="body-super-large-semi-bold">Persiapan Belajar</p>
								<p class="body-small-reguler">
									Memahami rincian materi, fasilitas pembelajaran, dan lainnya. Memahami rincian
									materi, fasilitas pembelajaran, dan lainnya.
								</p>
								<div class="flex body-medium-reguler justify-content-between">
									<div class="flex align-items-center gap-3">
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<PlayCircle color="#000000" />
											<p class="caption-small-reguler">Video</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">12 menit</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12 col-md-10">
					<div class="card radius-sm neutral-border">
						<div class="flex-column gap-7">
							<div class="flex-column gap-3">
								<p class="body-super-large-semi-bold">Persiapan Belajar</p>
								<p class="body-small-reguler">
									Memahami rincian materi, fasilitas pembelajaran, dan lainnya. Memahami rincian
									materi, fasilitas pembelajaran, dan lainnya.
								</p>
								<div class="flex body-medium-reguler justify-content-between">
									<div class="flex align-items-center gap-3">
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<PlayCircle color="#000000" />
											<p class="caption-small-reguler">Video</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">12 menit</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12 col-md-10">
					<div class="card radius-sm neutral-border">
						<div class="flex-column gap-7">
							<div class="flex-column gap-3">
								<p class="body-super-large-semi-bold">Persiapan Belajar</p>
								<p class="body-small-reguler">
									Memahami rincian materi, fasilitas pembelajaran, dan lainnya. Memahami rincian
									materi, fasilitas pembelajaran, dan lainnya.
								</p>
								<div class="flex body-medium-reguler justify-content-between">
									<div class="flex align-items-center gap-3">
										<div class="flex gap-2 p-2 neutral-border radius-sm">
											<PlayCircle color="#000000" />
											<p class="caption-small-reguler">Video</p>
										</div>
										<div class="flex gap-2">
											<Clock color="#8191AC" />
											<p class="caption-small-reguler tc-neutral-disabled">12 menit</p>
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

	<section id="teacher" class="section">
		<div class="container">
			<div class="course-step body-large-semi-bold">Pemateri</div>
			<div class="row justify-content-center w-100" style="padding: 20px 0;">
				<div class="col-12">
					<div class="card radius-sm neutral-border">
						<div class="flex align-items-center gap-5">
							<img
								src="/images/testimoni-karyawan-image.png"
								alt="thumbnail student"
								class="w-25 teacher-img"
							/>
							<div class="flex-column gap-5">
								<div class="flex-column gap-5">
									<p class="body-super-large-semi-bold">Michael Hernandez</p>
									<p class="body-small-reguler">
										Memahami rincian materi, fasilitas pembelajaran, dan lainnya. Memahami rincian
										materi, fasilitas pembelajaran, dan lainnya.
									</p>
									<div class="flex body-medium-reguler justify-content-between">
										<div class="flex align-items-center gap-8">
											<div class="flex gap-2">
												<Instagram color="#3951A8" />
												<p>naaandez</p>
											</div>

											<div class="flex gap-2">
												<Facebook color="#3951A8" />
												<p>michaelhernandezz</p>
											</div>
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

<svelte:head>
	<title>Loading...</title>

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
	</style>
</svelte:head>
