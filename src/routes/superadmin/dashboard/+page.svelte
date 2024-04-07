<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation'

    import { extract } from "$lib/Cookie.js"
	
    import Navbar from "@components/Navbar.svelte";

    let user = null

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
            </div>
        </main>
    </div>
</div>