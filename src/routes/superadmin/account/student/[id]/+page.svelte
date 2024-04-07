<script>
    /** @type {import('./$types').PageData} */

	import { onMount } from "svelte";
    import {goto} from "$app/navigation"
    
    import ApiController from "$lib/ApiController"
    import {extract} from '$lib/Cookie'

    export let data
    let detail, user

    const getDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `account/${data.id}`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                detail = response.data
                console.log(detail)
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