<script>
	import Navbar from '@components/Navbar.svelte';
	import Footer from '@components/Footer.svelte';
</script>

<Navbar active="event" />

<main class="mb-8">
	<section id="events" class="section">
		<div class="container flex-column gap-8">
			<div class="flex-column align-items-center">
				<img src="/images/event1-image.png" alt="gambar courses" class="p-4" />
				<h4>Sosialisasi Bisnis Digital</h4>
				<p class="body-super-large-reguler">Sabtu, 20 September 2024</p>
				<p class="body-super-large-reguler">Hotel Furaya</p>
			</div>
			<div class="flex-column align-items-center">
				<img src="/images/event2-image.png" alt="gambar courses" class="p-4" />
				<h4>Sosialisasi Bisnis Digital</h4>
				<p class="body-super-large-reguler">Sabtu, 20 September 2024</p>
				<p class="body-super-large-reguler">Hotel Furaya</p>
			</div>
		</div>
	</section>
</main>
<Footer />
