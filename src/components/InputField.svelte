<script>
    export let type = "text"
    export let label = ""
    export let id = ""
    export let name = ""
    export let placeholder = ""

    let showPassword = false

    let toggleVisibility = () => {
        showPassword = !showPassword
    }
</script>

<div class="flex-column gap-2">
    <label for="{id}" class="body-large-reguler">{label}</label>
    {#if type == 'password'}
    <div class="input-group-container">
        <input type="{showPassword ? 'text' : 'password'}" id="{id}" name="{name}" placeholder="{placeholder}">
        <div class="password-icon">
            <img src="/icons/{showPassword ? 'eye' : 'eye-slash'}.svg" alt="icon" on:click={toggleVisibility}>
        </div>
    </div>
    {:else}
    <input type="{type}" id="{id}" name="{name}" placeholder="{placeholder}">
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
</style>