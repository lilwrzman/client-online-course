<script>
	import { onDestroy, onMount } from 'svelte';
    import { fly } from 'svelte/transition'
	
	import Button from '@components/Button.svelte';
	import Check from "svelte-bootstrap-icons/lib/Check.svelte"
	import Info from "svelte-bootstrap-icons/lib/Info.svelte"
	import Exclamation from "svelte-bootstrap-icons/lib/Exclamation.svelte"
	import SlashCircle from "svelte-bootstrap-icons/lib/SlashCircle.svelte"
	import X from "svelte-bootstrap-icons/lib/X.svelte"
	import { goto } from '$app/navigation';

    export let toastVisible;
	export let title = '';
	export let message = '';
	export let color = '';
	export let redirectTo = ''

	let duration = 5000;

	const hideToast = () => {
		toastVisible = false;
		if(redirectTo){
			goto(redirectTo)
		}

		title = '';
		message = '';
		color = '';
		redirectTo = ''
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
				<div class="toast-icon toast-icon-info">
					<Info width={24} height={24}/>
				</div>
				{:else if color == 'toast-success'}
				<div class="toast-icon toast-icon-success">
					<Check width={24} height={24}/>
				</div>
				{:else if color == 'toast-warning'}
				<div class="toast-icon toast-icon-warning">
					<Exclamation width={24} height={24}/>
				</div>
				{:else if color == 'toast-danger'}
				<div class="toast-icon toast-icon-danger">
					<SlashCircle width={24} height={24}/>
				</div>
				{/if}
				<div class="flex-column">
					<p class="body-small-medium">{title}</p>
					<p class="caption-light">{message}</p>
				</div>
			</div>
			<div class="toast-action">
				<Button onClick={hideToast} classList="btn btn-no-padding">
					<X width={24} height={24}/>
				</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Toast Section */

	.toast {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		border-radius: .5rem;
		padding: .5rem;
		z-index: 999;
		width: fit-content;
	}

	.toast-body {
		display: flex;
		flex-direction: row;
		gap: 40px;
	}

	.toast-text {
		display: flex;
		flex-direction: row;
		gap: 10px;
	}

	.toast-action {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toast-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 36px;
		height: 36px;
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
