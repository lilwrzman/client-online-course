<script>
	import { onMount } from 'svelte';

	import { extract } from "$lib/Cookie.js"

	import Button from '@components/Button.svelte';
	import LoginModal from '@components/LoginModal.svelte';
	import Bell from "svelte-bootstrap-icons/lib/Bell.svelte"
	import PersonCircle from "svelte-bootstrap-icons/lib/PersonCircle.svelte"
	import ChevronDown from "svelte-bootstrap-icons/lib/ChevronDown.svelte"

	export let active
	export let variant = 'outside'

	let isFixed = false
	let modalShow = false

	let userData
	let isLoggedIn = false
	let username = 'John Doe'

	function handleScroll(){
		isFixed = window.scrollY >= 50
	}

	onMount(() => {
		userData = extract('datas')

		if(userData){
			isLoggedIn = true
			username = userData.username
		}

		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	})
</script>

<header>
	<nav class="nav nav-light {isFixed ? 'nav-fixed' : ''} w-100">
		<div class="container flex justify-content-between align-items-center h-100">
			<Button type="link" href="/" classList="btn btn-no-padding">
				<div class="h5">Logo Disini</div>
			</Button>
			{#if variant == 'outside'}
			<ul class="navbar-menu">
				<li class="navbar-menu-item {active == 'beranda' ? 'active' : ''}">
					<a href="/">Beranda</a>
				</li>
				<li class="navbar-menu-item {active == 'alur belajar' ? 'active' : ''}">
					<a href="/alur-belajar">Alur Belajar</a>
				</li>
				<li class="navbar-menu-item {active == 'materi' ? 'active' : ''}">
					<a href="/materi">Materi</a>
				</li>
				<li class="navbar-menu-item {active == 'event' ? 'active' : ''}">
					<a href="/event">Event</a>
				</li>
				<li class="navbar-menu-item {active == 'artikel' ? 'active' : ''}">
					<a href="/artikel">Artikel</a>
				</li>
			</ul>
			{/if}
			{#await extract('datas')}
				<div></div>
			{:then datas} 
			{#if datas}
			<div class="flex gap-4 align-items-center">
				<Button id="notification" classList="btn btn-no-padding">
					<Bell width={24} height={24}/>
				</Button>
				<p class="body-small-medium tc-secondary">Hi, {username}</p>
				<Button id="profile" classList="btn p-2">
					<div class="flex align-items-center gap-1">
						<PersonCircle width={24} height={24}/>
						<ChevronDown width={16} height={16}/>
					</div>
				</Button>
			</div>
			{:else}
			<div class="flex gap-2 align-items-center">
				<Button classList="btn btn-main-outline" onClick={() => modalShow = true}>
					Masuk
				</Button>
				<Button type="link" href="/registration" classList="btn btn-main">Daftar</Button>
			</div>
			{/if}
			{/await}
		</div>
	</nav>
</header>

{#if modalShow}
	<LoginModal bind:modalShow bind:isLoggedIn/>
{/if}

<style>
	/* Navbar Section */

	.nav{
		height: 80px;
		z-index: 999;
		transition: top 0.3s ease;
	}

	.nav-light{
		background-color: var(--neutral-white);
	}

	.nav-fixed{
		position: fixed;
		top: 0;
		left: 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

	.navbar-menu-item a {
		color: var(--dark);
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0px;
	}

	.active a {
		color: var(--dark);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		letter-spacing: 0px;
	}

	.navbar-menu-item:hover {
		cursor: pointer;
		background-color: var(--neutral-surface);
	}

	/* End of Navbar Section */
</style>
