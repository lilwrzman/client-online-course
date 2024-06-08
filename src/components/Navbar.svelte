<script>
	import { onMount } from 'svelte';

	import Button from '@components/Button.svelte';
	import LoginModal from '@components/LoginModal.svelte';
	import Bell from "svelte-bootstrap-icons/lib/Bell.svelte"
	import PersonCircle from "svelte-bootstrap-icons/lib/PersonCircle.svelte"
	import ChevronDown from "svelte-bootstrap-icons/lib/ChevronDown.svelte"
	import { extract } from '$lib/Cookie';

	export let user
	export let active
	export let variant = 'outside'
	export let pageTitle = ''

	let isFixed = false
	let modalShow = false
	let isLoggedIn = false
	let username = ''

	function handleScroll(){
		isFixed = window.scrollY >= 50
	}

	onMount(() => {
		if(!user){
			user = extract('datas')
		}

		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	})

	$: {
		if(user){
			isLoggedIn = true
			username = user.username
		}else{
			isLoggedIn = false
		}
	}
</script>

<header>
	<nav class="nav
		{variant == 'outside' ? 'nav-light' : 'nav-neutral'}
		{isFixed && variant == "outside" ? 'navbar-shadow' : ''}
		w-100">
		<div class="container flex justify-content-between align-items-center h-100">
			<a href="/" class="btn btn-no-padding">
				{#if variant == 'outside'}
				<div class="h5">Logo Disini</div>
				{:else}
				<div class="body-large-semi-bold">{pageTitle}</div>
				{/if}
			</a>
			{#if variant == 'outside'}
			<ul class="navbar-menu">
				<li class="navbar-menu-item {active == 'beranda' ? 'active' : ''}">
					<a href="/">Beranda</a>
				</li>
				<li class="navbar-menu-item {active == 'alur belajar' ? 'active' : ''}">
					<a href="/learning-paths">Alur Belajar</a>
				</li>
				<li class="navbar-menu-item {active == 'materi' ? 'active' : ''}">
					<a href="/courses">Materi</a>
				</li>
				<li class="navbar-menu-item {active == 'event' ? 'active' : ''}">
					<a href="/events">Event</a>
				</li>
				<li class="navbar-menu-item {active == 'artikel' ? 'active' : ''}">
					<a href="/articles">Artikel</a>
				</li>
			</ul>
			{/if}
			{#if variant == 'inside'}
			<div class="flex gap-2 align-items-center">
				<p class="body-small-medium tc-primary-main">{user ? username : ''}</p>
				<Button id="profile" classList="btn p-2">
					<div class="flex align-items-center gap-1">
						<PersonCircle width={24} height={24} color="#3951A8"/>
						<ChevronDown width={16} height={16}/>
					</div>
				</Button>
			</div>
			{:else if user}
			<div class="flex gap-2 align-items-center">
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
	<LoginModal bind:modalShow bind:isLoggedIn/>
{/if}

<style>
	/* Navbar Section */

	header{
		position: sticky;
		position: -webkit-sticky;
		top: 0;
		z-index: 9;
	}

	.nav{
		height: 80px;
	}

	.nav-light{
		background-color: var(--neutral-white);
	}

	.nav-neutral{
		background-color: var(--neutral-surface);
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

	.navbar-shadow{
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* End of Navbar Section */
</style>
