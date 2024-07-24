<script>
	import { PUBLIC_SERVER_PATH } from '$env/static/public';
	import ApiController from '$lib/ApiController';
	import checkLogin from '$lib/CheckLogin';
	import { destroyCookie, extract, setCookie } from '$lib/Cookie';
	import { getFlash, setFlash } from '$lib/Flash';
	import Button from '@components/Button.svelte';
	import InputField from '@components/InputField.svelte';
	import Navbar from '@components/Navbar.svelte';
	import StudentSidebar from '@components/StudentSidebar.svelte';
	import Spinner from '@components/Spinner.svelte';
	import Tab from '@components/Tab.svelte';
	import Toast from '@components/Toast.svelte';
	import { onMount } from 'svelte';

	let toastData;
	let toastVisible = false;
	let showSpinner = false;
	let inputFile;

	let user;
	let isSidebarOpen = true;

	let errors;
	let profile;

	let fullname, username, email, avatar_url, avatar_file;

	const changeAvatar = () => {
		if (!avatar_file) {
			return alert('Mohon pilih foto profil!');
		}

		let formData = new FormData();
		formData.append('avatar_file', avatar_file);

		showSpinner = true;
		ApiController.sendRequest({
			contentType: 'multipart/form-data',
			method: 'POST',
			endpoint: 'account/update/avatar',
			data: formData,
			authToken: user.token
		})
			.then((response) => {
				if (response.status) {
					getProfile(() => {
						return setFlash({
							title: 'Berhasil',
							message: response.message,
							type: 'success',
							redirect: '/student/settings/profile'
						});
					});
				}
			})
			.catch((e) => {
				let error = e.response.data;
				showSpinner = false;

				console.error(error);

				if (error.error) {
					errors = error.error;
				}
			});
	};

	const handleSubmit = () => {
		showSpinner = true;
		ApiController.sendRequest({
			method: 'POST',
			endpoint: 'account/update',
			data: { fullname, username, email },
			authToken: user.token
		})
			.then((response) => {
				console.log(response)
				if (response.error) {
					showSpinner = false;
					errors = response.error;
					return;
				}

				if (response.status) {
					getProfile(() => {
						return setFlash({
							title: 'Berhasil',
							message: response.message,
							type: 'success',
							redirect: '/student/settings/profile'
						});
					});
				}
			})
			.catch((e) => {
				let error = e.response.data;
				showSpinner = false;

				if (error.error) {
					errors = error.error;
				}
			});
	};

	const getProfile = (callback = null) => {
		ApiController.sendRequest({
			method: 'GET',
			endpoint: 'profile',
			authToken: user.token
		}).then((response) => {
			if (response.status) {
				profile = response.data;
				fullname = profile.info.fullname;
				username = profile.username;
				email = profile.email;

				let kuki = extract('datas');
				kuki.fullname = response.data.info.fullname;
				kuki.username = response.data.username;
				kuki.avatar = profile.avatar;
				setCookie('datas', JSON.stringify(kuki));

				if (callback != null && typeof callback == 'function') {
					callback();
				}
			}
		});
	};

	onMount(() => {
		let flashes = getFlash();
		if (flashes) {
			toastData = {
				title: flashes.title,
				message: flashes.message,
				color: `toast-${flashes.type}`
			};
			toastVisible = true;
		}

		user = checkLogin('Student', true);
		console.log(user)

		getProfile();
	});
</script>

<Navbar variant="combined" />

<section class="section" id="settings">
	<div class="container">
		<div class="flex gap-4">
			<StudentSidebar bind:user={user} active="Pengaturan Akun" />
			<main class="w-100">
				<div class="container">
					<div class="flex-column gap-4">
						<h4>Pengaturan Akun</h4>

						{#if toastVisible}
							<Toast
								bind:toastVisible
								title={toastData.title}
								message={toastData.message}
								color={toastData.color}
							/>
						{/if}

						{#if showSpinner}
							<Spinner />
						{/if}

						<Tab
							type="link"
							menus={[
								{ title: 'Profil', href: '/student/settings/profile', active: true },
								{ title: 'Kata Sandi', href: '/student/settings/password', active: false }
							]}
						/>

						<div class="row">
							<div class="col-12 col-md-8">
								<div class="card">
									<div class="card-body gap-5">
										{#if profile}
											<div class="flex-column gap-3">
												<InputField
													id="fullname"
													bind:value={fullname}
													inputClass="input-bg-light"
													labelClass="body-medium-semi-bold"
													label="Nama Lengkap"
													placeholder="Masukkan nama lengkap anda"
													rules={[{ required: true }]}
													error={errors ? (errors.fullname ? errors.fullname : '') : ''}
												/>

												<InputField
													id="username"
													bind:value={username}
													inputClass="input-bg-light"
													labelClass="body-medium-semi-bold"
													label="Username"
													placeholder="Masukkan username anda"
													rules={[{ required: true }]}
													error={errors ? (errors.username ? errors.username : '') : ''}
												/>

												<div class="flex-column">
													<label for="email" class="body-medium-semi-bold">Email</label>
													<p class="default-text-input p-standard">
														{email}
													</p>
												</div>
											</div>
										{/if}

										{#if profile && (fullname != profile.fullname || username != profile.username)}
											<div class="flex gap-2">
												<Button
													classList="btn btn-main-outline"
													onClick={() => {
														fullname = profile.fullname;
														username = profile.username;
													}}>Batal</Button
												>
												<Button classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
											</div>
										{/if}
									</div>
								</div>
							</div>

							{#if user}
								<div class="col-12 col-md-4">
									<div class="flex-column align-items-center justify-content-center gap-3 h-100">
										<div class="flex-column align-items-center justify-content-center gap-2">
											<img
												width="100"
												height="100"
												src="{PUBLIC_SERVER_PATH}/storage/{user.avatar}"
												alt="avatar"
												id="avatar"
											/>
											<p class="body-small-light mb-0">Unggah file gambar JPG atau PNG</p>
										</div>
										{#if !avatar_file}
											<Button
												classList="btn btn-main-outline"
												onClick={() => {
													inputFile.click();
												}}>Pilih Gambar</Button
											>
										{:else}
											<div class="flex gap-2">
												<Button
													classList="btn btn-main-outline"
													onClick={() => {
														let avatarContainer = document.getElementById('avatar');
														avatarContainer.src = `${PUBLIC_SERVER_PATH}/storage/${user.avatar}`;
														avatar_file = null;
													}}>Batal</Button
												>
												<Button classList="btn btn-main" onClick={changeAvatar}>Simpan</Button>
											</div>
										{/if}
										<input
											bind:this={inputFile}
											type="file"
											style="display: none;"
											on:change={function (evt) {
												avatar_file = evt.target.files[0];
												let avatarContainer = document.getElementById('avatar');

												const fileReader = new FileReader();
												fileReader.onload = (e) => {
													avatarContainer.src = e.target.result;
												};

												fileReader.readAsDataURL(avatar_file);
											}}
											accept="image/*"
										/>
									</div>
								</div>
							{/if}
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

<style>
	#avatar {
		border-radius: 100%;
	}
</style>
