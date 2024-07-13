<script>
	import Navbar from '@components/Navbar.svelte';
	import { onMount } from 'svelte';
	import checkLogin from '$lib/CheckLogin';
	import StudentSidebar from '@components/StudentSidebar.svelte';
	import Tab from '@components/Tab.svelte';
	import InputField from '@components/InputField.svelte';
	import Button from '@components/Button.svelte';

	let user, active = 'Profil'

	onMount(() => {
		user = checkLogin('Student', true);
	});
</script>

<Navbar />

<section class="section" id="settings" >
	<div class="container">
		<div class="flex gap-4">
			<StudentSidebar active="Pengaturan Akun" bind:user={user} />
			<main class="w-100">
				<div class="container">
					<div class="flex-column gap-4">
						<h4>Pengaturan Akun</h4>

						<Tab
							bind:value={active}
							type="variable"
							menus={[
								{ value: 'Profil', title: 'Profil' },
								{ value: 'Password', title: 'Password' }
							]}
						/>

						<div class="row justify-content-between">
							<div class="col-md-8">
								<div class="card">
									<div class="card-body gap-5">
										<div class="flex-column gap-2">
											<label for="fullname" class="body-large-semi-bold">Nama Lengkap</label>
											<InputField inputClass="input-bg-light" />
										</div>
										<div class="flex-column gap-2">
											<label for="username" class="body-large-semi-bold">Username</label>
											<InputField inputClass="input-bg-light" />
										</div>
										<div class="flex-column gap-2">
											<label for="email" class="body-large-semi-bold">Email</label>
											<p class="p-2">michaelhernandezz@gmail.com</p>
										</div>
										<div class="flex align-items-center justify-content-start">
											<Button classList="btn btn-main">Simpan</Button>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="flex-column justify-content-center align-items-center h-100 gap-large">
									<div class="flex-column gap-standard">
										<div class="flex">
											<img
												class="mb-4"
												src="https://hls-egy.pocari.id/storage/avatars/default.png"
												alt="user-avatar"
												width="90"
												height="90"
											/>
										</div>
									</div>
									<div class="flex-column gap-5 mb-4">
										<p class="text-center">Unggah file gambar JPG atau PNG</p>
									</div>
									<div class="flex-column gap-5 mb-8">
										<Button type="link" href="" classList="btn btn-main-outline"
											>Pilih Gambar</Button
										>
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

<svelte:head>
	<title>Pengaturan Akun</title>
</svelte:head>
