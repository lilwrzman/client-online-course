<script>
	import Button from '@components/Button.svelte';
	import Toast from '@components/Toast.svelte';
	import showToast from '$lib/toast.js';
</script>

<header>
	<nav class="container flex justify-content-between align-items-center">
		<div class="h5">Logo Disini</div>
		<ul class="navbar-menu">
			<li class="navbar-menu-item"><a href="">Beranda</a></li>
			<li class="navbar-menu-item"><a href="">Alur Belajar</a></li>
			<li class="navbar-menu-item"><a href="">Materi</a></li>
			<li class="navbar-menu-item"><a href="">Event</a></li>
			<li class="navbar-menu-item"><a href="">Artikel</a></li>
		</ul>
		<div class="flex gap-2 align-items-center">
			<Button classList="btn btn-main-outline">Masuk</Button>
			<Button classList="btn btn-main">Daftar</Button>
		</div>
	</nav>
</header>

<style>
	/* Navbar Section */

	nav {
		height: 80px;
		z-index: 999;
	}

	.navbar-menu {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.navbar-menu-item {
		border-radius: 8px;
		padding: 8px 16px;
	}

	.navbar-menu-item:hover {
		cursor: pointer;
		background-color: var(--neutral-surface);
	}

	.navbar-menu-item > a {
		color: var(--dark);
		display: block;
		text-decoration: none;
	}

	/* End of Navbar Section */
</style>
