<script>
    export let modalShow = false
    export let width = "42.625rem"

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
    <div class="card card-modal drop-shadow w-100" style="max-width: {width};">
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
        z-index: 99;
    }

    .card-modal{
        padding: 46px 36px !important;
    }
</style>