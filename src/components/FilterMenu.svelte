<script>
    export let options = []
    export let action = () => {}

    const handleChange = (evt) => action(evt)
</script>

<div class="flex-column grow-item grow-auto-md" on:change={handleChange}>
    <select name="filter">
        <option value="" selected>Filter</option>
    
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
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z' fill='%23191B22'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-size: 1rem;
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