<script>
    import {page} from '$app/stores'
    import Button from '@components/Button.svelte';
	import { onMount } from 'svelte';

    onMount(() => {
        console.log($page)
        console.error($page.error)
    })
</script>

{#if $page.status == '404'}
<h1>{$page.status} Error cuy!</h1>
<p>{$page.error.message}</p>
<Button classList="btn btn-main-outline" onClick={() => history.back()}>Kembali</Button>
{/if}

<svelte:head>
    <title>Oops!</title>
</svelte:head>