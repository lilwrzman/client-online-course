<script>
    export let modalShow = false

    let closeOnClickOverlay = (event) =>{
        if(event.target.classList.contains('overlay')){
            modalShow = false
        }
    }
</script>

{#if modalShow}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="overlay" on:click={closeOnClickOverlay}>
    <div class="card drop-shadow w-100" style="max-width: 56.83rem;">
        <slot/>
    </div>
</div>
{/if}

<style>
    .overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0 80px;
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
</style>