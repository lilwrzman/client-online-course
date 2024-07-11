<script>
    import ApiController from '$lib/ApiController.js'
    import showToast from "$lib/Toast.js"
    import { clearInput, getValue } from "$lib/Input.js"

    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";
    import Button from "@components/Button.svelte";
    import Login from "@components/Login.svelte";
    import InputField from "@components/InputField.svelte";
    import Toast from "@components/Toast.svelte"
    import Spinner from "@components/Spinner.svelte"

    let errors = null

    let toastData = null
    let toastVisible = false

    let modalShow = false
    let fullname, username, email, password, password_confirmation, referral
    let showSpinner = false

    const register = () => {
        showSpinner = true

        let fd = new FormData()
        fd.append('fullname', fullname)
        fd.append('username', username)
        fd.append('email', email)
        fd.append('password', password)
        fd.append('password_confirmation', password_confirmation)
        
        if(referral){
            fd.append('referral', referral)
        }

        ApiController.sendRequest({
            method: "POST",
            endpoint: "register",
            data: fd
        }).then(response => {
            if(response.error){
                errors = response.error
            }else if(response.status){
                fullname = null 
                username = null
                email = null 
                password = null
                password_confirmation = null
                referral = null
                errors = null
                toastData = showToast(response.msg, 'Cek email anda untuk verifikasi!', 'toast-success')
                toastVisible = true
            }

            showSpinner = false
        })
    }
</script>

<Navbar/>

<main>
    <section id="registration">
        {#if toastVisible}
        <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
        {/if}

        {#if showSpinner}
        <Spinner/>
        {/if}
        <div class="container">
            <div class="card mx-auto" style="max-width: 42.625rem;">
                <div class="card-body gap-5">
                    <div class="h4">Daftar</div>
                    <InputField label="Nama Lengkap" id="fullname" name="fullname" 
                        placeholder="Nama lengkap anda" rules={[{required: true}]}
                        bind:value={fullname}
                        error={errors ? errors.fullname ? errors.fullname : '' : ''}/>

                    <InputField label="Username" id="username" name="username" 
                        placeholder="Maksimal 14 karakter" rules={[{required: true, max: 14}]}
                        bind:value={username}
                        error={errors ? errors.username ? errors.username : '' : ''}/>

                    <InputField type="email" label="Email" id="email" 
                        bind:value={email}
                        placeholder="Masukkan email anda" rules={[{required: true, type: 'email'}]}
                        error={errors ? errors.email ? errors.email : '' : ''}/>
                    
                    <InputField type="password" label="Password" id="password" 
                        bind:value={password}
                        placeholder="Maksimal 16 karakter" rules={[{required: true, type: 'password'}]}
                        error={errors ? errors.password ? errors.password : '' : ''}/>
                    
                    <InputField type="password" label="Konfirmasi Password" id="password_confirmation" 
                        bind:value={password_confirmation}
                        placeholder="Maksimal 16 karakter" rules={[{required: true, type: 'password'}]}
                        error={errors ? errors.password_confirmation ? errors.password_confirmation : '' : ''}/>
                    
                    <InputField label="Kode Referral" id="referral" 
                        placeholder="Opsional" bind:value={referral}
                        error={errors ? errors.referral ? errors.referral : '' : ''}/>
                    
                    <Button disabled={fullname && username && email && password && password_confirmation ? false : true } 
                        classList="btn btn-main" onClick={register}>
                        Daftar
                    </Button>

                    <div class="flex justify-content-center gap-1 default-text-input">
                        <p>Sudah punya akun?</p>
                        <Button classList="btn btn-no-padding" onClick={() => modalShow = true}>
                            <p class="link tc-primary-main default-text-input">Masuk disini</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

{#if modalShow}
	<Login bind:modalShow />
{/if}

<Footer/>

<svelte:head>
    <title>Daftar</title>
</svelte:head>