<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import Navbar from '@components/Navbar.svelte';
	import InputField from '@components/InputField.svelte';
	import Button from '@components/Button.svelte';
	import Footer from '@components/Footer.svelte';
	import ApiController from '$lib/ApiController';
	import { onMount } from 'svelte';

	let status = false
	let learningPaths = []

	const getLearningPaths = () => {
		ApiController.sendRequest({
			endpoint: "learning-path/get",
			method: "GET"
		}).then(response => {
			learningPaths = response.data
			status = true
			console.log(learningPaths)
		})
	}

	let option = [
		{ value: 'newest', text: 'Terbaru' },
		{ value: 'asc', text: 'A-Z' },
		{ value: 'desc', text: 'Z-A' }
	];

	let sortBy = option[0].value;

	const handleSort = (evt) => {
		sortBy = evt.target.value;

		if (sortBy == 'newest') {
			handler.sortDesc('created_at');
		} else if (sortBy == 'asc') {
			handler.sortAsc('title');
		} else if (sortBy == 'desc') {
			handler.sortDesc('title');
		}
	};

	onMount(() => {
		getLearningPaths()
	})
</script>

<Navbar active="alur belajar" />

{#if status}
<main class="mb-6">
	<section id="learning-paths" class="section">
		<div class="container">
			<div class="flex-column gap-3">
				<div class="flex justify-content-between align-items-center">
					<h4>Alur Pembelajaran</h4>
					<InputField
						type="select-option"
						id="select-default"
						containerClass="grow-item grow-auto-md"
						inputClass="input-bg-light pr-8"
						onInput={handleSort}
						value={sortBy}
						{option}
					/>
				</div>

				<div class="row">
					{#each learningPaths as lp}
					<div class="col-xs-12 col-sm-6 col-md-3 mb-5">
						<div class="card">
							<div class="card-body gap-3">
								<img src="{PUBLIC_SERVER_PATH}/storage/{ lp.thumbnail }" alt="gambar learning path" class="learning-path-thumbnail" />
								<div class="flex-column">
									<p class="body-small-medium">{ lp.title }</p>
									<p class="caption-small-reguler">{ lp.courses } Materi</p>
								</div>
								<Button type="link" href="/learning-paths/{ lp.slug }" classList="btn btn-main">Lihat Detail</Button>
							</div>
						</div>
					</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
</main>

<Footer />

{/if}

<style>
    .learning-path-thumbnail {
        border-radius: .25rem;
        aspect-ratio: 4/3; 
        object-fit: cover; 
        object-position: center;
    }

	.section { 
        padding-bottom: 0;
    }
</style>

<svelte:head>
	<title>Online Course | Alur Belajar</title>
</svelte:head>