<script>
    import { PUBLIC_TINYMCE_KEY } from "$env/static/public"
    
    import { validateInput } from "$lib/Input.js"

    import Button from "@components/Button.svelte"
    import Editor from '@tinymce/tinymce-svelte'
    import Eye from "svelte-bootstrap-icons/lib/Eye.svelte"
    import EyeSlash from "svelte-bootstrap-icons/lib/EyeSlash.svelte"

    export let type = "text"
    export let label = ""
    export let id = ""
    export let name = ""
    export let placeholder = ""
    export let error = ""
    export let rules = null
    export let value = ''

    let showPassword = false
    let inputClass = ""

    let toggleVisibility = () => {
        showPassword = !showPassword
    }

    const conf = {
        paste: true,
        paste_as_text: true
    }

    const handleChange = (event) => {
        if(rules){
            const input = type != "tinymce" ? event.target.value : value
            const check = validateInput(input, rules)
            error = check.length ? check[0] : ''
        }
    }

    $: {
        inputClass = error ? 'invalid' : ''
    }
</script>

<div class="flex-column gap-2">
    <label for={id} class="body-large-reguler">{label}</label>
    {#if type == 'password'}
    <div class="input-group-container">
        <input type='{showPassword ? 'text' : 'password'}' id='{id}' name='{name ? name : id}' value='{value}'
            placeholder='{placeholder}' class='{inputClass}' on:change={handleChange}>
        <div class="password-icon">
            <Button id="btn-{id}" classList="btn btn-no-padding" onClick={toggleVisibility}>
                {#if showPassword}
                <Eye width={24} height={24}/>
                {:else}
                <EyeSlash width={24} height={24}/>
                {/if}
            </Button>  
        </div>
    </div>
    {:else if type == "text"}
    <input type="{type}" id='{id}' name='{name ? name : id}' value='{value}'
        placeholder='{placeholder}' class='{inputClass}' on:change={handleChange}>
    {:else if type == "tinymce"}
        <Editor bind:value={value} on:input={handleChange} on:change={handleChange}
            apiKey="{PUBLIC_TINYMCE_KEY}"
            id="{id}"
            {conf}
        />
    {:else if type == "file"}
    <input type="file" id="{id}" name="{name ? name : id}" class='{inputClass}'>
    {/if}
    
    {#if error}
    <p class="tc-danger-main">{error}</p>
    {/if}
</div>

<style>
    /* Input Section */

    input {
        border-radius: 8px;
        padding: 14px;
        gap: 8px;
        background-color: #F5F6F7;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0.20000000298023224px;
        color: var(--neutral-primary);
        border: none;
    }

    input::placeholder {
        color: var(--neutral-disabled);
        padding-left: 0.25rem;
    }

    input:focus {
        background-color: var(--neutral-white);
        color: #185951;
        caret-color: #185951;
        outline: 2px solid #718284;
    }

    input:focus::placeholder {
        color: #185951;
        caret-color: #185951;
    }

    input:invalid {
        background-color: var(--neutral-white);
        outline: 1px solid var(--danger-main);
    }

    .input-group-container {
        position: relative;
    }

    .input-group-container input {
        width: 100%;
    }

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

    /* End of Input Section */
</style>