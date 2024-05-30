<script>
    export let options = []
    export let action = () => {}

    const handleChange = (evt) => action(evt)
</script>

<div class="flex-column grow-item grow-auto-md" on:change={handleChange}>
    <select name="sort">
        <option value="" selected>Sortir</option>
    
        {#each options as option}
        <option value={option.val}>{option.label}</option>
        {/each}
    </select>
</div>

<style>
    select {
        min-width: 8.5rem;
        padding: 0.875rem;
        border: 1px solid var(--neutral-border);
        border-radius: 0.25rem;

        -webkit-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");   
        background-repeat: no-repeat;
        background-size: 1rem 0.75rem;
        background-position: right 0.875rem center;
        
        font-family: "Poppins", sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: var(--neutral-primary);
    }

    select:focus {
        background-color: var(--neutral-white);
        color: #185951;
        outline: 1px solid #718284;
    }

    select:invalid {
        background-color: var(--neutral-white);
        outline: 1px solid var(--danger-main);
    }
</style>