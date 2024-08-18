<script>
	import { validateInput } from '$lib/Input';
	import { onMount } from 'svelte';

	export let value = '';
	export let placeholder = '';
	export let disabled = false;
	export let rules = null;
	export let error = '';

	let editor;
	const toolbarOptions = [
		[{ font: [] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ align: [] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		['link', 'image'],
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ indent: '-1' }, { indent: '+1' }],
		[{ color: [] }, { background: [] }],
		['clean']
	];

	onMount(async () => {
		const { default: Quill } = await import('quill');
		let quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions,
				history: {
					delay: 2000,
					maxStack: 500,
					userOnly: true
				}
			},
			theme: 'snow',
			placeholder: placeholder
		});

        quill.enable(!disabled)

		if (value) {
			quill.clipboard.dangerouslyPasteHTML(value);
		}

		quill.on('text-change', (delta, oldDelta, source) => {
			value = quill.getSemanticHTML();

			if (rules) {
                const input = quill.getText().trim()
				const check = validateInput(input, rules);
				error = check.length ? check[0] : '';
			}
		});
	});
</script>

<div class="editor-wrapper">
	<div bind:this={editor} />
</div>

<style>
	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
</style>
