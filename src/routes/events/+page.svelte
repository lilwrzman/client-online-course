<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import Navbar from '@components/Navbar.svelte';
	import Footer from '@components/Footer.svelte';
	import { onMount } from 'svelte';
	import ApiController from '$lib/ApiController';
	import { getDay } from "$lib/Date";
	import Button from "@components/Button.svelte";

	let events

	const getEvents = () => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: "events/get"
		}).then(response => {
			if(response.status){
				events = response.data
			}
		}).catch(e => {
			let error = e.response.data
			console.error(error)
		})
	}

	onMount(() => {
		getEvents()
	})
</script>

<Navbar active="event" />

<main class="mb-8">
	<section id="events" class="section">
		<div class="container">
			<div class="row justify-content-center">
				{#if events}
				{#if events.length > 0}
				{#each events as event, index (event.id)}
				<div class="col-12 col-md-8 mb-8">
					<div class="flex-column align-items-center gap-3 neutral-border radius-sm">
						<img src="{PUBLIC_SERVER_PATH}/storage/{event.thumbnail}" alt="gambar courses" class="thumbnail" />
						<div class="flex-column align-items-center pb-3">
							<h4 class="mb-0">{event.title}</h4>
							<p class="body-medium-reguler mb-0">{getDay(event.date)} | {event.start.substring(0, 5)} - {event.end.substring(0, 5)}</p>
							<p class="body-medium-reguler mb-0">{event.place}</p>
							{#if event.link}
							<a href="{event.link}" target="_blank" class="link tc-primary-main">Daftar Disini</a>
							{/if}
						</div>
					</div>
				</div>	
				{/each}
				{:else}
				<div class="col-12 col-md-8">
					<div class="flex-column align-items-center">
						<p class="body-medium-reguler">Belum ada data acara</p>
					</div>
				</div>
				{/if}
				{:else}
				<div class="col-12 col-md-8">
					<div class="flex-column align-items-center">
						<p class="body-medium-reguler">Memuat Data</p>
					</div>
				</div>
				{/if}
			</div>
		</div>
	</section>
</main>
<Footer />

<svelte:head>
	<title>Online Course | Acara</title>
</svelte:head>

<style>
    .section { 
        padding-bottom: 0;
    }

	.thumbnail {
		aspect-ratio: 16 / 9;
		border-radius: .25rem .25rem 0 0;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
</style>