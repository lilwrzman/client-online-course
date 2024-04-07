<script>
    /** @type {import('./$types').PageData} */
    
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation'

    import ApiController from '$lib/ApiController'
	import { extract } from '$lib/Cookie'

    export let data
    let user

    const getDetail = () => {
        ApiController.sendRequest({
            method:"GET",
            endpoint: `learning-path/get/${data.slug}`
        }).then(response => {
            console.log(response)
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