<script>
	import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"
	import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import { onMount } from 'svelte';
	import checkLogin from '$lib/CheckLogin';
	import Navbar from '@components/Navbar.svelte';
	import StudentSidebar from '@components/StudentSidebar.svelte';
	import Button from '@components/Button.svelte';
	import InputField from '@components/InputField.svelte';
	import { Search } from 'svelte-bootstrap-icons';
	import ApiController from '$lib/ApiController';
	import Toast from "@components/Toast.svelte";
	import Spinner from "@components/Spinner.svelte";

	let user;
	let code
	let errors = {}

	let bundles
	let showSpinner = false
	let toastData
	let toastVisible = false

	const checkCode = () => {
		if(!code){
			errors.redeem_code = "Mohon masukkan kode!"
			return
		}

		ApiController.sendRequest({
			method: "POST",
			endpoint: "redeem/get",
			data: { redeem_code: code },
			authToken: user.token
		}).then(response => {
			if(response.status){
				bundles = response.data.course_bundle.bundle_items
				console.log(response.data)
				console.log(bundles)
			}
		}).catch(e => {
			let error = e.response.data
			console.error(error)

			if(error.message && error.message.includes("No query results for model")){
				errors.redeem_code = "Kode tidak ditemukan!"
				return
			}

			if(error.error){
				errors.redeem_code = error.error
				return
			}
		})
	}

	const redeem = () => {
		if(!code){
			errors.redeem_code = "Mohon masukkan kode!"
			return
		}

		showSpinner = true
		ApiController.sendRequest({
			method: "POST",
			endpoint: "redeem",
			data: { redeem_code: code },
			authToken: user.token
		}).then(response => {
			if(response.status){
				console.log(response.data)
				errors = {}
				code = ''
				bundles = null
				toastData = {
					title: "Berhasil",
					message: "Kode tukar berhasil ditukarkan, silahkan cek Kursus Saya!",
					color: "toast-success"
				}
				toastVisible = true
				showSpinner = false
			}
		}).catch(e => {
			let error = e.response.data
			console.error(error)
			showSpinner = false

			if(error.message && error.message.includes("No query results for model")){
				errors.redeem_code = "Kode tidak ditemukan!"
				return
			}

			if(error.error){
				errors.redeem_code = error.error
				return
			}
		})
	}

	onMount(() => {
		user = checkLogin('Student', true);
	});
</script>

<Navbar />

{#if user}
	<section class="section" id="reedem-code">
		<div class="container">
			<div class="flex gap-4">
				<StudentSidebar active="Tukar Kode" bind:user />
				<main class="w-100">
					<div class="container">
						{#if toastVisible}
							<Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color}/>
						{/if}
						
						{#if showSpinner}
							<Spinner/>
						{/if}
						<div class="flex-column gap-4">
							<h4 class="mb-0">Tukar Kode</h4>
							<div class="card neutral-border radius-sm">
								<div class="card-body">
									<p class="body-small-reguler my-2">Masukkan kode tukar yang tepat</p>
									<div class="row">
										<div class="col-6 col-md-4">
											<InputField inputClass="input-bg-light radius-sm" placeholder="Masukkan kode tukar ..."
												bind:value={code}
												rules={[{required: true}]}
												error={errors ? errors.redeem_code ? errors.redeem_code : '' : ''}/>
										</div>
										<div class="col-6 col-md-4 px-0">
											<Button classList="btn btn-main pl-4" onClick={checkCode}>
												<div class="flex align-items-center justify-content-center gap-2">
													<Search />
													<div>Temukan</div>
												</div>
											</Button>
										</div>
									</div>
									
									{#if bundles}
									<div class="card neutral-border radius-sm p-standard" transition:fly={{ delay: 250, duration: 300, x: -100, opacity: 0, easing: quintOut }}>
										<div class="card-body">
											<div class="row">
												{#each bundles as item, index (item.id)}
												<div class="col-xs-12 col-sm-6 col-md-4 mb-3">
													<div class="card p-0">
														<div class="card-body gap-3">
															<img
																src="{PUBLIC_SERVER_PATH}/storage/{item.course.thumbnail}"
																class="thumbnail"
																alt="gambar courses"
															/>
															<div class="flex-column gap-1">
																<p class="body-small-medium">{item.course.title}</p>
																<div class="flex justify-content-between align-items-center">
																	<p class="caption-small-reguler">{item.course.items} Item</p>
																</div>
															</div>
														</div>
													</div>
												</div>
												{/each}
											</div>
										</div>
									</div>

									<div class="flex" transition:fly={{ delay: 250, duration: 400, x: -100, opacity: 0, easing: quintOut }}>
										<div class="flex align-items-center gap-2">
											<Button classList="btn btn-main" onClick={redeem}>Tukar Sekarang</Button>
											<Button classList="btn btn-main-outline" onClick={() => {
												errors = {}
												code = ''
												bundles = null
											}}>Batal</Button>
										</div>
									</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	</section>
{/if}

<style>
	.thumbnail {
		border-radius: .25rem;
		aspect-ratio: 4 / 3;
		width: 100%;
		object-fit: cover;
		object-position: center;	
	}
</style>