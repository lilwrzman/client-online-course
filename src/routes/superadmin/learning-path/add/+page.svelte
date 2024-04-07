<script>
	import { onMount } from "svelte"
    import { goto } from "$app/navigation"
    
    import ApiController from "$lib/ApiController.js"
    import { extract } from "$lib/Cookie.js"
    import { clearInput, getValue } from "$lib/Input.js"
    import showToast from "$lib/Toast.js"

    import InputField from "@components/InputField.svelte"
    import Button from "@components/Button.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Toast from "@components/Toast.svelte"

    let user
    let errors = null

    let description

    let toastData = null
    let toastVisible = false

    const handleSubmit = (evt) => {
        let formData = new FormData()
        let file = document.getElementById('thumbnail').files[0]

        formData.append('title', getValue(['title']).title)
        formData.append('description', description)

        if(file){
            formData.append('thumbnail_file', file)
        }
        
        ApiController.sendRequest({
            method: "POST",
            endpoint: "learning-path/add",
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.status){
                clearInput(['title', 'thumbnail'])
                description = ''

                toastData = showToast("Sukses", response.message, 'toast-success')
                toastVisible = true
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
                {#if toastVisible}
                <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
                {/if}
                <form on:submit|preventDefault={handleSubmit}>
                    <InputField label="Judul" id="title" name="title" 
                        placeholder="Judul learning path" rules={[{required: true}]}
                        error={errors ? errors.title ? errors.title : '' : ''}/>

                    <InputField bind:value={description}
                        label="Deskripsi" id="description" name="description" type="tinymce"
                        rules={[{required: true}]}
                        error={errors ? errors.description ? errors.description : '' : ''}/>
                    
                    <InputField label="Thumbnail" id="thumbnail" name="thumbnail" type="file"
                        error={errors ? errors.thumbnail ? errors.thumbnail : '' : ''}/>

                    <Button type="submit" id="submit" classList="btn btn-main">Simpan</Button>
                </form>
            </div>
        </main>
    </div>
</div>