<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
    
	import ApiController from "$lib/ApiController";
	import { extract } from "$lib/Cookie";

    let learningPath, user

    const getDatas = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: 'learning-path/get'
        }).then(response => {
            learningPath = response.data
        })
    }

    const deleteData = (id) => {
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'learning-path/delete',
            data: {id},
            authToken: user.token
        }).then(response => {
            if(response.status){
                console.log(response)
            }
        })
    }

    onMount(() => {
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
        }

        getDatas()
    })

</script>

{#if learningPath}
<ul>
{#each learningPath as item}
    <li>{item.title} <button on:click={() =>  deleteData(item.id)}>hapus</button></li>
{/each}
</ul>
{/if}