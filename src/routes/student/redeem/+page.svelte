<script>
	import { onMount } from 'svelte';
	import checkLogin from '$lib/CheckLogin';
	import Navbar from '@components/Navbar.svelte';
	import StudentSidebar from '@components/StudentSidebar.svelte';
	import Button from '@components/Button.svelte';
	import InputField from '@components/InputField.svelte';
	import { Search } from 'svelte-bootstrap-icons';

	let user;

	onMount(() => {
		user = checkLogin('Student', true);
	});
</script>

<Navbar />

{#if user}
	<section class="section" id="redeem-code">
		<div class="container">
			<div class="flex gap-4">
				<StudentSidebar active="Tukar Kode" bind:user />
				<main class="w-100">
					<div class="container">
						<div class="flex-column gap-standard">
							<h4>Tukar Kode</h4>

							<div class="row neutral-border radius-sm">
								<div class="flex align-items-center mt-3 mb-3">
									<p class="body-small-reguler">Masukkan kode tukar yang tepat</p>
								</div>
								<div class="flex body-medium-reguler justify-content-between mb-3">
									<div class="col-md-8">
										<InputField inputClass="input-bg-light"/>
									</div>

									<Button type="link" href="" classList="btn btn-main pl-4 grow-item grow-auto-md">
										<div class="flex align-items-center justify-content-center gap-2">
											<Search />
											<div>Temukan</div>
										</div>
									</Button>
								</div>

								<div class="row neutral-border radius-sm ml-3 mr-3 mb-3">
									<div class="col-xs-12 col-sm-6 col-md-4 mb-3">
										<div class="card">
											<div class="card-body gap-3">
												<img
													src="/images/building-trust-image.png"
													class="radius-sm"
													alt="gambar courses"
												/>
												<div class="flex-column gap-1">
													<p class="body-small-medium label-bullet">Sales Marketing</p>
													<p class="body-small-medium">Building Trust</p>
													<div class="flex justify-content-between align-items-center">
														<p class="caption-small-reguler">0/9 Item</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div class="col-xs-12 col-sm-6 col-md-4">
										<div class="card">
											<div class="card-body gap-3">
												<img
													src="/images/building-trust-image.png"
													class="radius-sm"
													alt="gambar courses"
												/>
												<div class="flex-column gap-1">
													<p class="body-small-medium label-bullet">Sales Marketing</p>
													<p class="body-small-medium">Building Trust</p>
													<div class="flex justify-content-between align-items-center">
														<p class="caption-small-reguler">0/7 Item</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div class="col-xs-12 col-sm-6 col-md-4">
										<div class="card">
											<div class="card-body gap-3">
												<img
													src="/images/building-trust-image.png"
													class="radius-sm"
													alt="gambar courses"
												/>
												<div class="flex-column gap-1">
													<p class="body-small-medium label-bullet">Sales Marketing</p>
													<p class="body-small-medium">Building Trust</p>
													<div class="flex justify-content-between align-items-center">
														<p class="caption-small-reguler">0/10 Item</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div class="flex body-medium-reguler justify-content-between mb-3">
										<div class="flex align-items-center gap-6">
											<Button type="link" href="" classList="btn btn-main">Tukar Sekarang</Button>
											<Button type="link" href="" classList="btn btn-main-outline">Batal</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	</section>
{/if}

<svelte:head>
	<title>Tukar Kode</title>
</svelte:head>
