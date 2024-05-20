<script>
	export let type = "button"
	export let id = ""
	export let classList = '';
	export let onClick = () => {}
	export let disabled = false;
	export let href = ""
	export let custom = ""

	const handleClick = (evt) => {
		onClick(evt);
	};
</script>

{#if type == "button" || type == 'submit' || type == 'reset'}
<button type={type} id={id} class={classList} on:click={handleClick} {disabled} style={custom}>
	<slot />
</button>
{:else if type == "link"}
<a href={href} id={id} class={classList} on:click={handleClick} {disabled} style={custom}>
	<slot />
</a>
{/if}

<style>
	/* Button Section */

	.btn {
		display: inline-block;
		padding: 0.75rem 1.75rem;
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
		transition: all .25s ease;
	}

	.btn-no-padding{
		padding: 0 !important;
	}

	.btn:hover {
		cursor: pointer;
	}

	.btn-wrap{
		display: inline-block !important;
		max-width: fit-content !important;
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

	.btn-neutral-outline{
		background-color: var(--neutral-white);
		border: 1px solid var(--neutral-border);
		color: var(--dark);
	}

	.btn-neutral-outline:hover {
		background-color: var(--neutral-border);
		border: 1px solid var(--neutral-border);
		color: var(--dark);
	}

	.btn-neutral-outline:active {
		background-color: #dfdddd;
		border: 1px solid #dfdddd;
		color: var(--dark);
	}

	/* End of Button Section */
</style>
