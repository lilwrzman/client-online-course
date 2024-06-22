<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"

    import ApiController from '$lib/ApiController.js';
    import showToast from '$lib/Toast.js';
	import { extract, setCookie } from '$lib/Cookie.js';
    import { setFlash } from "$lib/Flash";

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Toast from '@components/Toast.svelte';
    import Spinner from '@components/Spinner.svelte';

    export let role

    let toastData = null;
	let toastVisible = false;

    let errors = null;

    let showSpinner = false
    let email, password

    const login = () => {
        showSpinner = true

		ApiController
			.sendRequest({
				method: 'POST',
				endpoint: 'login',
				data: {email, password, role}
			})
			.then((response) => {
				if (response.status) {
                    let datas = JSON.parse(response.userData)
					setCookie('datas', response.userData)
					
                    if(datas.role == 'Superadmin'){
                        return goto('/superadmin/dashboard')
                    }else if(datas.role == 'Teacher'){
                        return goto('/teacher/dashboard')
                    }else if(datas.role == 'Corporate Admin'){
                        return goto('/corporate/dashboard')
                    }
				} else {
                    showSpinner = false
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
        let user = extract('datas')
        if(user){
            let redirectTo = ''
            if(user.role == 'Superadmin'){
                redirectTo = '/superadmin/dashboard'
            } else if(user.role == 'Teacher'){
                redirectTo = '/teacher/dashboard'
            } else if(user.role == 'Corporate Admin'){
                redirectTo = '/corporate/dashboard'
            }

            return setFlash({ 
                    title: 'Ooops',
                    message: `Anda telah login sebagai ${user.role}. Silahkan logout terlebih dahulu sebelum login menggunakan akun lain!`, 
                    type: 'warning', redirect: redirectTo 
                })
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

    {#if showSpinner}
        <Spinner/>    
    {/if}
    
    <div class="card" style="width: 42.625rem;">
        <div class="card-body gap-5">
            <div class="flex-column gap-3 align-items-center">
                <div class="h5">LOGO DISINI</div>
                {#if role == 'Superadmin'}
                <div class="h4">Login Admin LPK</div>
                {:else if role == 'Teacher'}
                <div class="h4">Login Pemateri LPK</div>
                {:else if role == 'Corporate Admin'}
                <div class="h4">Logi Admin Mitra</div>
                {/if}
            </div>

            <InputField
                type="email"
                id="email"
                label="Alamat Email"
                placeholder="Ketik disini"
                bind:value={email}
                rules={[{ required: true, type: 'email' }]}
                error={errors ? (errors.email ? errors.email : '') : ''}
            />

            <InputField
                type="password"
                id="password"
                label="Password"
                placeholder="Ketik disini"
                bind:value={password}
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