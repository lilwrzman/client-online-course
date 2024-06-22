<script>
    import { ChevronRight, ChevronLeft } from "svelte-bootstrap-icons";

    export let handler

    const pageNumber = handler.getPageNumber()
    const pageCount = handler.getPageCount()
    const pages = handler.getPages({ ellipsis: true })

    const setPage = (value) => {
        handler.setPage(value)
    }
</script>

<div class="pagination-wrapper">
    {#if $pages === undefined}
        <button><ChevronLeft/></button>
        <button><b>{$pageNumber}</b></button>
        <button><ChevronRight/></button>
    {:else}
        {#if $pageNumber != 1}
        <button
            on:click={() => setPage('previous')}><ChevronLeft width=10 height=10 /></button>
        {/if}
        
        {#each $pages as page}
            <button
                type="button"
                class:active={$pageNumber === page}
                class:ellipse={page === null}
                on:click={() => setPage(page)}
            >
                {page ?? '...'}
            </button>
        {/each}
        
        {#if $pageNumber < $pageCount}
        <button
            on:click={() => setPage('next')}><ChevronRight width=10 height=10 /></button>
        {/if}
    {/if}
</div>

<style>
    .pagination-wrapper {
        display: flex;
        justify-content: flex-start;
    }

    .active {
        background-color: var(--neutral-border);
        font-weight: 600;
    }

    button {
        width: 2.5rem;
        height: 2.5rem;
        padding: .5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        font-family: 'Poppins', sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0px;
        color: var(--dark);
        text-align: center;
        box-sizing: border-box;
        transition: all .25s ease;

        outline: none;
        border: 1px solid var(--neutral-border);
        border-right: none;
        background-color: var(--neutral-white);
        cursor: pointer;
    }

    .pagination-wrapper > button:first-child {
        border-radius: .25rem 0 0 .25rem;
    }

    .pagination-wrapper > button:last-child {
        border-radius: 0 .25rem .25rem 0;
        border-right: 1px solid var(--neutral-border);
    }
</style>