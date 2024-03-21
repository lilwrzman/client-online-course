<script>
	import XLg from 'svelte-bootstrap-icons/lib/XLg.svelte';

	import Button from '@components/Button.svelte';
	import Modal from '@components/Modal.svelte';
	import InputField from '@components/InputField.svelte';
	import Toast from '@components/Toast.svelte';

	import showToast from '$lib/toast.js';
	import apiController from '$lib/apiController.js';
	import { extract, setCookie } from '$lib/cookie.js';
	import { clearInput, getValue } from '$lib/input.js';
	import { onMount } from 'svelte';

	export let modalShow = false;

	let toastData = null;
	let toastVisible = false;

	let errors = null;

	const login = () => {
		const ids = ['email', 'password'];
		let datas = getValue(ids);

		apiController
			.sendRequest({
				method: 'POST',
				endpoint: 'login',
				data: datas
			})
			.then((response) => {
				if (response.status) {
					setCookie('userData', response.userData)
					clearInput(ids)
					window.location.reload()
				} else {
					if (response.error) {
						errors = response.error;
					} else {
						toastData = showToast('Gagal!', response.msg, 'toast-danger');
						toastVisible = true;
					}
				}
			});
	};

	onMount(() => {
		
	});
</script>

<Modal bind:modalShow>
	{#if toastVisible}
		<Toast
			bind:toastVisible
			title={toastData.title}
			message={toastData.message}
			color={toastData.color}
		/>
	{/if}
	<div class="card-body gap-5">
		<div class="flex justify-content-between align-items-center">
			<div class="h4">Masuk</div>
			<Button classList="btn btn-no-padding" onClick={() => (modalShow = false)}>
				<XLg width={30} height={30} />
			</Button>
		</div>
		<InputField
			type="email"
			id="email"
			label="Alamat Email"
			placeholder="Ketik disini"
			rules={[{ required: true, type: 'email' }]}
			error={errors ? (errors.email ? errors.email : '') : ''}
		/>

		<InputField
			type="password"
			id="password"
			label="Password"
			placeholder="Ketik disini"
			rules={[{ required: true, type: 'password' }]}
			error={errors ? (errors.password ? errors.password : '') : ''}
		/>

		<Button classList="btn btn-main" onClick={login}>Masuk</Button>
		<div class="flex justify-content-center gap-1 default-text-input">
			<p>Belum punya akun?</p>
			<Button
				type="link"
				href="/registration"
				classList="btn btn-no-padding tc-primary-main"
				onClick={() => (modalShow = false)}
			>
				<p class="link default-text-input">Daftar disini</p>
			</Button>
		</div>
	</div>
</Modal>
