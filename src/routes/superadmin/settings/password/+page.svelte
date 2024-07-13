<script>
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Button from "@components/Button.svelte";
	import InputField from "@components/InputField.svelte";
	import Navbar from "@components/Navbar.svelte";
	import Sidebar from "@components/Sidebar.svelte";
	import Spinner from "@components/Spinner.svelte";
	import Tab from "@components/Tab.svelte";
	import Toast from "@components/Toast.svelte";
	import { onMount } from "svelte";

    let user
    let isSidebarOpen = true

    let toastData
    let toastVisible = false
    let showSpinner = false

    let old_password, new_password, new_password_confirmation
    let errors

    const resetPassword = () => {
        if(!old_password){
            return alert('Mohon masukkan kata sandi anda saat ini!')
        }

        if(!new_password){
            return alert('Mohon masukkan kata sandi yang baru!')
        }

        if(!new_password_confirmation){
            return alert('Mohon masukkan kembali kata sandi yang baru sebagai konfirmasi!')
        }

        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'password-reset',
            data: { old_password, new_password, new_password_confirmation },
            authToken: user.token
        }).then(response => {
            if(response.status){
                old_password = ""
                new_password = ""
                new_password_confirmation = ""
                
                showSpinner = false
                toastData = { title: "Berhasil",message: response.message, color: 'toast-success' }
                toastVisible = true
            }
        }).catch(e => {
            let error = e.response.data
            showSpinner = false

            if(error.errors){
                errors = error.errors
            }

            if(error.error){
                toastData = { title: "Gagal", message: error.error, color: 'toast-danger' }
                toastVisible = true
            }
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin", true)
    })

</script>
<div class="flex">
    <Sidebar active="else" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Pengaturan Akun"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
                {/if}

                {#if showSpinner}
                    <Spinner/>
                {/if}
                <div class="card p-standard radius-sm">
                    <div class="card-body gap-4">
                        <Tab type="link" menus={[
                            {title: "Profil", href: "/superadmin/settings/profile", active: false},
                            {title: "Kata Sandi", href: "/superadmin/settings/password", active: true}
                        ]} />

                        <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="flex-column gap-4">
                                    <div class="flex-column gap-3">
                                        <InputField type="password" label="Kata Sandi Saat Ini" id="old_password"
                                            bind:value={old_password} labelClass="body-medium-semi-bold" inputClass="input-bg-light"
                                            placeholder="Maksimal 16 karakter" rules={[{required: true, type: 'old_password'}]}
                                            error={errors ? errors.old_password ? errors.old_password : '' : ''}/>
                                        <InputField type="password" label="Kata Sandi Baru" id="new_password"
                                            bind:value={new_password} labelClass="body-medium-semi-bold" inputClass="input-bg-light"
                                            placeholder="Maksimal 16 karakter" rules={[{required: true, type: 'new_password'}]}
                                            error={errors ? errors.new_password ? errors.new_password : '' : ''}/>
                                    
                                        <InputField type="password" label="Konfirmasi Kata Sandi Baru" id="new_password_confirmation"
                                            bind:value={new_password_confirmation} labelClass="body-medium-semi-bold" inputClass="input-bg-light"
                                            placeholder="Maksimal 16 karakter" rules={[{required: true, type: 'password'}]}
                                            error={errors ? errors.new_password_confirmation ? errors.new_password_confirmation : '' : ''}/>
                                    </div>
                                    <div class="flex gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => {
                                            old_password = ""
                                            new_password = ""
                                            new_password_confirmation = ""
                                        }}>Batal</Button>
                                        <Button classList="btn btn-main" onClick={resetPassword}>Konfirmasi</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>