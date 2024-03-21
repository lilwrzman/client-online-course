<script>
    import Eye from "svelte-bootstrap-icons/lib/Eye.svelte"
    import EyeSlash from "svelte-bootstrap-icons/lib/EyeSlash.svelte"

    import { validateInput } from "$lib/input.js"

    import Button from "@components/Button.svelte"

    export let type = "text"
    export let label = ""
    export let id = ""
    export let name = ""
    export let placeholder = ""
    export let error = ""
    export let rules = null

    let showPassword = false
    let inputClass = ""

    let toggleVisibility = () => {
        showPassword = !showPassword
    }

    const handleChange = (event) => {
        if(rules){
            const value = event.target.value
            const check = validateInput(value, rules)
            error = check.length ? check[0] : ''
        }
    }

    $: {
        inputClass = error ? 'invalid' : ''
    }
</script>

<div class="flex-column gap-2">
    <label for="{id}" class="body-large-reguler">{label}</label>
    {#if type == 'password'}
    <div class="input-group-container">
        <input type="{showPassword ? 'text' : 'password'}" id="{id}" name="{name ? name : id}" placeholder="{placeholder}" class="{inputClass}" on:change={handleChange}>
        <div class="password-icon">
            <Button classList="btn btn-no-padding" onClick={toggleVisibility}>
                {#if showPassword}
                <Eye width={24} height={24}/>
                {:else}
                <EyeSlash width={24} height={24}/>
                {/if}
            </Button>  
        </div>
    </div>
    {:else}
    <input type="{type}" id="{id}" name="{name ? name : id}" placeholder="{placeholder}" class="{inputClass}" on:change={handleChange}>
    {/if}

    {#if error}
    <p class="tc-danger-main">{error}</p>
    {/if}
</div>

<style>
    .password-icon{
        position: absolute;
        top: 50%;
        right: 14px;
        transform: translateY(-50%);
        cursor: pointer;
    }

    .invalid{
        background-color: var(--neutral-white);
        outline: 1px solid var(--danger-main);
    }
</style>