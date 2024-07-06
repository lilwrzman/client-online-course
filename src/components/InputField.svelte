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

    export let containerClass = ""
    export let inputClass = ""

    export let disabled = false

    export let labelClass = "body-large-reguler"

    export let prefix = ''

    export let option = []

    export let onInput = () => {}

    let showPassword = false

    let toggleVisibility = () => {
        showPassword = !showPassword
    }

    const inputHandler = (evt) => onInput(evt)

    const tinyHandlerChanges = (tiny) => {
        handleChange(tiny.detail.event.target.getContent())
    }

    const handleChange = (event) => {
        if(rules){
            const input = type != "tinymce" ? event.target.value : event
            const check = validateInput(input, rules)
            error = check.length ? check[0] : ''
        }
    }

    $: {        
        if(!inputClass.includes(' invalid')) {
            inputClass += error ? ' invalid' : ''
        }else{
            inputClass = inputClass.replace(' invalid', '')
        }
    }
</script>

<div class="flex-column gap-2 {containerClass}">
    {#if label}
        <label for={id} class="{labelClass}">{label}</label>
    {/if}

    {#if type == 'password'}
        <div class="input-group-container">
            {#if showPassword}
            <input type='text' id='{id}' name='{name ? name : id}' bind:value='{value}'
                placeholder='{placeholder}' class='{inputClass}' on:change={handleChange}>
            {:else}
            <input type='password' id='{id}' name='{name ? name : id}' bind:value='{value}'
                placeholder='{placeholder}' class='{inputClass}' on:change={handleChange}>
            {/if}
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
    
    {:else if type == "file"}
        <input type="file" id="{id}" name="{name ? name : id}" class='{inputClass}'>
    
    {:else if type == "tinymce"}
        <Editor bind:value={value} on:input={tinyHandlerChanges} on:change={tinyHandlerChanges}
            apiKey="{PUBLIC_TINYMCE_KEY}"
            id="{id}"
            disabled={disabled}
            conf={{
                menubar: 'tools',
                plugins: 'lists',
                toolbar: 'undo redo | bold italic bullist | styles'
            }}
        />
    
    {:else if type == 'select-option'}
        <select id="{id}" name="{name ? name : id}" class="{inputClass}" {disabled} on:change={inputHandler} bind:value={value}>
            {#each option as opt, i}
            <option value={opt.value}>{opt.text}</option>
            {/each}
        </select>
    
    {:else if type == "text"}
        <input type="text" id='{id}' name='{name ? name : id}' bind:value={value} {disabled}
            placeholder='{placeholder}' class='{inputClass}' on:change={handleChange}>
    
    {:else if type == "email"}
        <input type="email" id='{id}' name='{name ? name : id}' bind:value={value}
            placeholder='{placeholder}' class='{inputClass}' on:change={handleChange}>
    
    {:else if type == "number"}
    
        {#if prefix}
        <div class="flex gap-2">
            <div class="flex align-items-center justify-content-center px-2">
                {prefix}
            </div>
            <input type="number" id='{id}' name='{name ? name : id}' bind:value={value} {disabled}
                placeholder='{placeholder}' class='{inputClass} w-100' on:change={handleChange}>
        </div>
        {:else}
        <input type="number" id='{id}' name='{name ? name : id}' bind:value={value} {disabled}
            placeholder='{placeholder}' class='{inputClass}' on:change={handleChange}>
        {/if}

    {:else if type == 'datalist'}
        <input list="{id}-list" id='{id}' name='{name ? name : id}' placeholder="{placeholder}"
            class="{inputClass}" on:change={handleChange} bind:value={value}>
        <datalist id="{id}-list">
            {#each option as opt}
            <option value="{opt.value} | {opt.text}"/>
            {/each}
        </datalist>
    {/if}
    
    {#if error}
    <p class="tc-danger-main caption-reguler-thin">{error}</p>
    {/if}
</div>

<style>
    /* Input Section */

    input {
        border-radius: 8px;
        padding: 14px;
        gap: 8px;
        background-color: #F5F6F7;
        font-family: "Poppins", sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0.20000000298023224px;
        color: var(--neutral-primary);
        border: transparent;
    }

    input::placeholder {
        color: var(--neutral-disabled);
        padding-left: 0.25rem;
    }

    input:focus, select:focus {
        background-color: var(--neutral-white);
        color: #185951;
        caret-color: #185951;
        outline: 1px solid #718284;
    }

    input:focus::placeholder {
        color: #185951;
        caret-color: #185951;
    }

    input:invalid, select:invalid {
        background-color: var(--neutral-white);
        outline: 1px solid var(--danger-main);
    }

    select {
        border-radius: 8px;
        padding: 14px 18px 14px 14px;
        -webkit-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");   
        background-repeat: no-repeat;
        background-size: 16px 12px;
        background-position: right .75rem center;
        background-color: #F5F6F7;
        font-family: "Poppins", sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0.20000000298023224px;
        color: var(--neutral-primary);
        border: 1px solid #F5F6F7;
    }

    .input-group-container {
        position: relative;
    }

    .input-group-container input, select {
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

    .input-bg-neutral{
        background-color: var(--neutral-border) !important;
        border: 1px solid var(--neutral-border) !important;
    }

    .input-bg-light{
        border: 1px solid var(--neutral-border) !important;
        background-color: var(--neutral-white) !important;
    }

    /* End of Input Section */
</style>