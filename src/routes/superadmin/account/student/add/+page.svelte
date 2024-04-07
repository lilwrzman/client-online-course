<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"

    import ApiController from "$lib/ApiController.js"
    import { extract } from "$lib/Cookie.js"
    import { getValue } from "$lib/Input.js"

    import Button from "@components/Button.svelte"
    import Navbar from "@components/Navbar.svelte"
    import InputField from "@components/InputField.svelte"

    let user
    let errors = null

    const handleSubmit = (evt) => {
        const ids = ['fullname', 'username', 'email', 'password', 'password_confirmation', 'referral']
        let datas = getValue(ids)
        datas.role = "Student"
        
        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/add",
            data: datas,
            authToken: user.token
        }).then(response => {
            if(response.status){
                console.log(response)
            }else{
                errors = response.error
            }
        })
    }

    onMount(() => {
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
        }
    })
</script>

<div class="flex">
    <aside class="w-50">
        sidebar
    </aside>
    <div class="flex-column w-100">
        <Navbar active="" variant="inside"/>
        <main>
            <div class="container">
                content
                <form on:submit|preventDefault={handleSubmit}>
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

                    <Button type="submit" id="submit" classList="btn btn-main">Simpan</Button>
                </form>
            </div>
        </main>
    </div>
</div>