<script>
    import { Search } from "svelte-bootstrap-icons";

    export let action = () => {}

    const handleInput = (evt) => action(evt)
</script>

<div class="position-relative">
    <div class="search-icon"><Search color="#8191AC"/></div>
    <input type="text" name="search" class="search-input" 
        placeholder="Cari..." on:input={handleInput}>
</div>

<style>
    input {
        background-color: var(--neutral-white);
        gap: 0.5rem;
        padding: 0.875rem 0.875rem 0.875rem 2.5rem;
        border-radius: 0.25rem;
        border: 1px solid var(--neutral-border);
        font-family: "Poppins", sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0.20000000298023224px;
        color: var(--neutral-primary);
    }

    input::placeholder {
        color: var(--neutral-disabled);
        padding-left: 0.25rem;
    }

    input:focus {
        background-color: var(--neutral-white);
        color: #185951;
        caret-color: #185951;
        outline: 1px solid #718284;
    }

    input:focus::placeholder {
        color: #185951;
        caret-color: #185951;
    }

    input:invalid {
        background-color: var(--neutral-white);
        outline: 1px solid var(--danger-main);
    }

    .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
    }
</style>