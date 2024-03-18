<script>
	export let type = "button"
	export let id = ""
	export let classList = '';
	export let onClick = () => {};
	export let disabled = false;
	export let href = ""

	const handleClick = () => {
		onClick();
	};
</script>

{#if type == "button"}
<button id="{id}" class={classList} on:click={handleClick} {disabled}>
	<slot />
</button>
{:else if type == "link"}
<a href="{href}" id="{id}" class={classList} on:click={handleClick} {disabled}>
	<slot />
</a>
{/if}

<style>
	/* Button Section */

	.btn {
		display: inline-block;
		padding: 12px 28px;
		background-color: transparent;
		border: 1px solid transparent;
		border-radius: 8px;
		gap: 10px;
		vertical-align: middle;
		font-family: 'Poppins', sans-serif;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0px;
		text-align: center;
		box-sizing: border-box;
	}

	.btn:hover {
		cursor: pointer;
	}

	.btn-main {
		background-color: var(--primary-main);
		border: 1px solid var(--primary-main);
		color: var(--neutral-white);
	}

	.btn-main:hover {
		background-color: var(--primary-hover);
		border: 1px solid var(--primary-hover);
	}

	.btn-main:focus {
		background-color: var(--primary-main);
		border: 1px solid var(--primary-focus);
	}

	.btn-main:active {
		background-color: var(--primary-pressed);
		border: 1px solid var(--primary-pressed);
	}

	.btn-main:disabled {
		background-color: var(--primary-disabled);
		border: 1px solid var(--primary-disabled);
		cursor: not-allowed;
	}

	.btn-main-outline {
		border: 1px solid var(--primary-main);
		color: var(--neutral-primary);
	}

	.btn-main-outline:hover {
		background-color: var(--primary-hover);
		border: 1px solid var(--primary-hover);
		color: var(--neutral-white);
	}

	.btn-main-outline:active {
		background-color: var(--primary-pressed);
		border: 1px solid var(--primary-pressed);
		color: var(--neutral-white);
	}

	.btn-success {
		background-color: var(--success-main);
		border: 1px solid var(--success-main);
		color: var(--neutral-white);
	}

	.btn-success:hover {
		background-color: var(--success-hover);
		border: 1px solid var(--success-hover);
	}

	.btn-success:focus {
		background-color: var(--success-main);
		border: 1px solid var(--success-focus);
	}

	.btn-success:active {
		background-color: var(--success-pressed);
		border: 1px solid var(--success-pressed);
	}

	.btn-success:disabled {
		background-color: var(--success-disabled);
		border: 1px solid var(--success-disabled);
		cursor: not-allowed;
	}

	.btn-success-outline {
		border: 1px solid var(--success-main);
		color: var(--neutral-primary);
	}

	.btn-success-outline:hover {
		background-color: var(--success-hover);
		border: 1px solid var(--success-hover);
		color: var(--neutral-white);
	}

	.btn-success-outline:active {
		background-color: var(--success-pressed);
		border: 1px solid var(--success-pressed);
		color: var(--neutral-white);
	}

	.btn-info {
		background-color: var(--info-main);
		border: 1px solid var(--info-main);
		color: var(--neutral-white);
	}

	.btn-info:hover {
		background-color: var(--info-hover);
		border: 1px solid var(--info-hover);
	}

	.btn-info:focus {
		background-color: var(--info-main);
		border: 1px solid var(--info-focus);
	}

	.btn-info:active {
		background-color: var(--info-pressed);
		border: 1px solid var(--info-pressed);
	}

	.btn-info:disabled {
		background-color: var(--info-disabled);
		border: 1px solid var(--info-disabled);
		cursor: not-allowed;
	}

	.btn-info-outline {
		border: 1px solid var(--info-main);
		color: var(--neutral-primary);
	}

	.btn-info-outline:hover {
		background-color: var(--info-hover);
		border: 1px solid var(--info-hover);
		color: var(--neutral-white);
	}

	.btn-info-outline:active {
		background-color: var(--info-pressed);
		border: 1px solid var(--info-pressed);
		color: var(--neutral-white);
	}

	.btn-warning {
		background-color: var(--warning-main);
		border: 1px solid var(--warning-main);
		color: var(--neutral-white);
	}

	.btn-warning:hover {
		background-color: var(--warning-hover);
		border: 1px solid var(--warning-hover);
	}

	.btn-warning:focus {
		background-color: var(--warning-main);
		border: 1px solid var(--warning-focus);
	}

	.btn-warning:active {
		background-color: var(--warning-pressed);
		border: 1px solid var(--warning-pressed);
	}

	.btn-warning:disabled {
		background-color: var(--warning-disabled);
		border: 1px solid var(--warning-disabled);
		cursor: not-allowed;
	}

	.btn-warning-outline {
		border: 1px solid var(--warning-main);
		color: var(--neutral-primary);
	}

	.btn-warning-outline:hover {
		background-color: var(--warning-hover);
		border: 1px solid var(--warning-hover);
		color: var(--neutral-white);
	}

	.btn-warning-outline:active {
		background-color: var(--warning-pressed);
		border: 1px solid var(--warning-pressed);
		color: var(--neutral-white);
	}

	.btn-danger {
		background-color: var(--danger-main);
		border: 1px solid var(--danger-main);
		color: var(--neutral-white);
	}

	.btn-danger:hover {
		background-color: var(--danger-hover);
		border: 1px solid var(--danger-hover);
	}

	.btn-danger:focus {
		background-color: var(--danger-main);
		border: 1px solid var(--danger-focus);
	}

	.btn-danger:active {
		background-color: var(--danger-pressed);
		border: 1px solid var(--danger-pressed);
	}

	.btn-danger:disabled {
		background-color: var(--danger-disabled);
		border: 1px solid var(--danger-disabled);
		cursor: not-allowed;
	}

	.btn-danger-outline {
		border: 1px solid var(--danger-main);
		color: var(--neutral-primary);
	}

	.btn-danger-outline:hover {
		background-color: var(--danger-hover);
		border: 1px solid var(--danger-hover);
		color: var(--neutral-white);
	}

	.btn-danger-outline:active {
		background-color: var(--danger-pressed);
		border: 1px solid var(--danger-pressed);
		color: var(--neutral-white);
	}

	/* End of Button Section */
</style>
