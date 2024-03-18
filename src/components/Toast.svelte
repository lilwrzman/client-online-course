<script>
    import { fly } from 'svelte/transition'
	import { onDestroy, onMount } from 'svelte';
	import Button from '@components/Button.svelte';

    export let toastVisible;
	export let title = '';
	export let message = '';
	export let color = '';

	let duration = 3000;

	const hideToast = () => {
		toastVisible = false;
	};

	onMount(() => {
		if (duration != 0) {
			setTimeout(hideToast, duration);
		}
	});

	onDestroy(() => {
		clearTimeout(hideToast);
	});
</script>

{#if toastVisible}
	<div class="toast {color}" transition:fly="{{ x: 50, duration: 300 }}">
		<div class="toast-body">
			<div class="toast-text">
				{#if color == 'toast-info'}
					<img
						src="/icons/info.svg"
						alt="icon"
						width="36"
						height="36"
						class="toast-icon toast-icon-info"
					/>
				{:else if color == 'toast-success'}
					<img
						src="/icons/check.svg"
						alt="icon"
						width="36"
						height="36"
						class="toast-icon toast-icon-success"
					/>
				{:else if color == 'toast-warning'}
					<img
						src="/icons/exclamation.svg"
						alt="icon"
						width="36"
						height="36"
						class="toast-icon toast-icon-warning"
					/>
				{:else if color == 'toast-danger'}
					<img
						src="/icons/slash-circle.svg"
						alt="icon"
						width="36"
						height="36"
						class="toast-icon toast-icon-danger"
					/>
				{/if}
				<div class="flex-column">
					<p class="body-small-medium">{title}</p>
					<p class="caption-light">{message}</p>
				</div>
			</div>
			<div class="toast-action">
				<button on:click={hideToast}><img src="/icons/x.svg" alt="icon" /></button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Toast Section */

	.toast {
		position: fixed;
		top: 20px;
		right: 20px;
		border-radius: 8px;
		padding: 8px;
		z-index: 999;
	}

	.toast-body {
		display: flex;
		flex-direction: row;
		gap: 40px;
	}

	.toast-text {
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	.toast-action {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
	}

	.toast-action > button {
		border-radius: 8px;
		background-color: transparent;
		border: none;
	}

	.toast-action > button:hover {
		cursor: pointer;
	}

	.toast-icon {
		padding: 8px;
		border-radius: 100%;
	}

	.toast-icon-info {
		background-color: var(--info-border);
	}

	.toast-icon-success {
		background-color: var(--success-border);
	}

	.toast-icon-warning {
		background-color: var(--warning-border);
	}

	.toast-icon-danger {
		background-color: var(--danger-border);
	}

	.toast-info {
		background-color: var(--info-focus);
		border: 1px solid var(--info-main);
	}

	.toast-success {
		background-color: var(--success-focus);
		border: 1px solid var(--success-main);
	}

	.toast-warning {
		background-color: var(--warning-focus);
		border: 1px solid var(--warning-main);
	}

	.toast-danger {
		background-color: var(--danger-focus);
		border: 1px solid var(--danger-main);
	}

	/* End of Toast Section */
</style>
