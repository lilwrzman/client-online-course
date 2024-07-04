<script>
	import Navbar from '@components/Navbar.svelte';
	import InputField from '@components/InputField.svelte';
	import Footer from '@components/Footer.svelte';
	import StarFill from 'svelte-bootstrap-icons/lib/StarFill.svelte';

	let option = [
		{ value: 'newest', text: 'Terbaru' },
		{ value: 'asc', text: 'A-Z' },
		{ value: 'desc', text: 'Z-A' }
	];

	let sortBy = option[0].value;

	const handleSort = (evt) => {
		sortBy = evt.target.value;

		if (sortBy == 'newest') {
			handler.sortDesc('created_at');
		} else if (sortBy == 'asc') {
			handler.sortAsc('title');
		} else if (sortBy == 'desc') {
			handler.sortDesc('title');
		}
	};
</script>

<Navbar active="beranda" />

<main class="mb-6">
	<section id="testimonials" class="section">
		<div class="container">
			<div class="flex-column gap-3">
				<div class="flex justify-content-between align-items-center">
					<h4>Testimoni Karyawan</h4>
					<InputField
						type="select-option"
						id="select-default"
						containerClass="grow-item grow-auto-md"
						inputClass="input-bg-light pr-8"
						onInput={handleSort}
						value={sortBy}
						{option}
					/>
				</div>

				<div class="row justify-content-start">
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
				<div class="row justify-content-start">
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
				<div class="row justify-content-start">
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
				<div class="row justify-content-start">
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
		</div>
	</section>
</main>

<Footer />

<svelte:head>
	<title>Online Course | Umpan Balik</title>
</svelte:head>

<style>
    .section { 
        padding-bottom: 0;
    }
</style>