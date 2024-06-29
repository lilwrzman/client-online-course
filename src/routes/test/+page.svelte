<script>
    import { onMount } from "svelte";
    import Cookies from "js-cookie"
	import ApiController from "$lib/ApiController";
    
    let token
    
    const testing = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "items/get/14?type=assessment",
            withCredentials: true
        }).then(response => {
            console.log(response)
        })
    }

    onMount(() => {
        token = Cookies.get('token')
        testing()
    })
</script>