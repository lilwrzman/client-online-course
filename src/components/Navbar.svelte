<script>
	import Bell from "svelte-bootstrap-icons/lib/Bell.svelte"
	import PersonCircle from "svelte-bootstrap-icons/lib/PersonCircle.svelte"
	import ChevronDown from "svelte-bootstrap-icons/lib/ChevronDown.svelte"

	import Button from '@components/Button.svelte';
	import Login from '@components/Login.svelte';
	import Toast from "@components/Toast.svelte";

	import { extract } from "$lib/cookie.js"
	
	import { afterUpdate, onMount } from 'svelte';

	export let active

	let isFixed = false
	let modalShow = false

	let isLoggedIn = false
	let username = 'John Doe'

	function handleScroll(){
		isFixed = window.scrollY >= 50
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll)

		if(extract().username){
			isLoggedIn = true
			username = extract().username
		}

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
			{#if isLoggedIn}
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
		</div>
	</nav>
</header>

{#if modalShow}
	<Login bind:modalShow bind:isLoggedIn/>
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
		font-size: 14px;
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
