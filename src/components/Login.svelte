<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"

    import ApiController from '$lib/ApiController.js';
    import showToast from '$lib/Toast.js';
	import { extract, setCookie } from '$lib/Cookie.js';
	import { getValue } from '$lib/Input.js';

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Toast from '@components/Toast.svelte';

    export let role

    let toastData = null;
	let toastVisible = false;

    let errors = null;

    const login = () => {
		const ids = ['email', 'password'];
		let datas = getValue(ids);
        datas.role = role

		ApiController
			.sendRequest({
				method: 'POST',
				endpoint: 'login',
				data: datas
			})
			.then((response) => {
				if (response.status) {
                    let datas = JSON.parse(response.userData)
					setCookie('datas', response.userData)
					
                    if(datas.role == 'Superadmin'){
                        goto('/superadmin/dashboard')
                    }else if(datas.role == 'Teacher'){
                        goto('/teacher/dashboard')
                    }else if(datas.role == 'Corporate Admin'){
                        goto('/teacher/dashboard')
                    }
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
        let datas = extract('datas')
        if(datas){
            if(datas.role == 'Superadmin'){
                goto('/superadmin/dashboard')
            }else if(datas.role == 'Teacher'){
                goto('/teacher/dashboard')
            }else if(datas.role == 'Corporate Admin'){
                goto('/teacher/dashboard')
            }
        }
    })
</script>

<div class="backdrop">
    {#if toastVisible}
		<Toast
			bind:toastVisible
			title={toastData.title}
			message={toastData.message}
			color={toastData.color}
		/>
	{/if}
    <div class="card" style="width: 42.625rem;">
        <div class="card-body gap-5">
            <div class="flex-column gap-3 align-items-center">
                <div class="h5">LOGO DISINI</div>
                <div class="h4">{role == 'Corporate Admin' ? 'Corporate' : role} Login</div>
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
        </div>
    </div>
</div>

<style>
    .backdrop {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--neutral-surface);
        width: 100vw;
        height: 100vh;
    }
</style>