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

    let errors = null

    let toastData = null
    let toastVisible = false

    let modalShow = false

    const register = () => {
        const ids = ['fullname', 'username', 'email', 'password', 'password_confirmation', 'referral']
        let datas = getValue(ids)

        ApiController.sendRequest({
            method: "POST",
            endpoint: "register",
            data: datas
        }).then(response => {
            if(response.error){
                errors = response.error
            }else if(response.status){
                errors = null
                clearInput(ids)
                toastData = showToast(response.msg, 'Cek email anda untuk verifikasi!', 'toast-success')
                toastVisible = true
            }
        })
    }
</script>

<Navbar/>

<main>
    <section id="registration">
        {#if toastVisible}
        <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
        {/if}
        <div class="container">
            <div class="card mx-auto" style="max-width: 42.625rem;">
                <div class="card-body gap-5">
                    <div class="h4">Daftar</div>
                    <InputField label="Nama Lengkap" id="fullname" name="fullname" 
                        placeholder="Nama lengkap anda" rules={[{required: true}]}
                        error={errors ? errors.fullname ? errors.fullname : '' : ''}/>

                    <InputField label="Username" id="username" name="username" 
                        placeholder="Maksimal 14 karakter" rules={[{required: true, max: 14}]}
                        error={errors ? errors.username ? errors.username : '' : ''}/>

                    <InputField type="email" label="Email" id="email" 
                        placeholder="Masukkan email anda" rules={[{required: true, type: 'email'}]}
                        error={errors ? errors.email ? errors.email : '' : ''}/>
                    
                    <InputField type="password" label="Password" id="password" 
                        placeholder="Maksimal 16 karakter" rules={[{required: true, type: 'password'}]}
                        error={errors ? errors.password ? errors.password : '' : ''}/>
                    
                    <InputField type="password" label="Konfirmasi Password" id="password_confirmation" 
                        placeholder="Maksimal 16 karakter" rules={[{required: true, type: 'password'}]}
                        error={errors ? errors.password ? errors.password : '' : ''}/>
                    
                    <InputField label="Kode Referral" id="referral" 
                        placeholder="Opsional" 
                        error={errors ? errors.referral ? errors.referral : '' : ''}/>
                    
                    <Button classList="btn btn-main" onClick={register}>
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