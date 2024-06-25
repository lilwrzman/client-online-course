<script>
	export let menus = []
    export let type = 'link'
    export let value = null

    const handleClick = (val) => value = val
</script>

<div class="tab">
    <ul>
        {#each menus as menu}
        {#if type == 'link'}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li>
            <a href="{menu.href}" class="tab-item {menu.active ? 'active' : ''}">{menu.title}</a>
        </li>
        {:else}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li on:click={() => handleClick(menu.value)} class="tab-item {value == menu.value ? 'active' : ''}">{menu.title}</li>
        {/if}
        {/each}
    </ul>
</div>

<style>
    .tab{
        width: 100%;
    }

    .tab > ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .tab-item {
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: 0px;
        padding: .75rem 1.25rem;
        transition: all .25s ease;
        border-bottom: 2px solid var(--neutral-border);
    }

    .tab-item:hover{
        padding: .75rem 1.75rem;
        cursor: pointer;
    }

    .tab .active{
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0px;
        color: var(--primary-main);
        border-bottom: 2px solid var(--primary-main);
    }
</style>