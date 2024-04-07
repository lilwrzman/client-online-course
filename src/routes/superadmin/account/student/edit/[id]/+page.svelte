<script>
    /** @type {import('./$types').PageData} */

    import { PUBLIC_SERVER_PATH } from "$env/static/public"

    import { onMount } from "svelte";
    import { goto } from "$app/navigation"

    import ApiController from "$lib/ApiController.js"
    import { extract } from "$lib/Cookie.js"
    import { getValue } from "$lib/Input.js"

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Navbar from "@components/Navbar.svelte"

    export let data
    let user, errors, detail

    const handleSubmit = (evt) => {
        const ids = ['fullname', 'username', 'email', 'referral']
        let datas = getValue(ids)
        datas.id = data.id
        
        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/update",
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

    const getDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `account/${data.id}`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                detail = response.data
            }
        })
    }

    onMount(() => {
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
        }

        getDetail()
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
                {#if !detail}
                <p>Loading...</p>
                {:else} 
                <img src="{PUBLIC_SERVER_PATH + detail.avatar}" alt="">
                <form on:submit|preventDefault={handleSubmit}>
                    <InputField label="Nama Lengkap" id="fullname" name="fullname" value={detail.fullname}
                        placeholder="Nama lengkap anda" rules={[{required: true}]}
                        error={errors ? errors.fullname ? errors.fullname : '' : ''}/>

                    <InputField label="Username" id="username" name="username" value={detail.username}
                        placeholder="Maksimal 14 karakter" rules={[{required: true, max: 14}]}
                        error={errors ? errors.username ? errors.username : '' : ''}/>

                    <InputField type="email" label="Email" id="email" value={detail.email}
                        placeholder="Masukkan email anda" rules={[{required: true, type: 'email'}]}
                        error={errors ? errors.email ? errors.email : '' : ''}/>
                    
                    <InputField label="Kode Referral" id="referral" 
                        placeholder="Opsional" value={detail.referral}
                        error={errors ? errors.referral ? errors.referral : '' : ''}/>

                    <Button type="submit" id="submit" classList="btn btn-main">Ubah</Button>
                </form>
                {/if}
            </div>
        </main>
    </div>
</div>