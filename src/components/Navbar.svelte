<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import { onMount } from 'svelte';

	import { setFlash } from "$lib/Flash"
	import Button from '@components/Button.svelte';
	import LoginModal from '@components/LoginModal.svelte';
	import { Bell, ChevronDown, HouseDoor, Gear, BoxArrowInLeft, List } from "svelte-bootstrap-icons"
	import { extract, destroyCookie } from '$lib/Cookie';

	export let user
	export let active = ''
	export let variant = 'outside'
	export let pageTitle = ''
	export let isSidebarOpen = true

	const toggleSidebar = () => isSidebarOpen = !isSidebarOpen

	let isFixed = false
	let modalShow = false
	let isLoggedIn = false
	let username = ''

	let dropdownOpen = false

	function handleScroll(){
		isFixed = window.scrollY >= 50
	}

	function toggleDropdown(event) {
		dropdownOpen = !dropdownOpen
		event.stopPropagation()
	}

	function handleClickOutside(event){
		if(dropdownOpen && !event.target.closest('.dropdown-menu-profile')){
			dropdownOpen = false
		}
	}

	onMount(() => {
		if(!user){
			user = extract('datas')
		}

		window.addEventListener('scroll', handleScroll)
		window.addEventListener('click', handleClickOutside)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			document.removeEventListener('click', handleClickOutside)
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
			{#if variant == 'outside'}
			<a href="/" class="btn btn-no-padding">
				<div class="h5">Logo Disini</div>
			</a>
			{:else}
			<div class="flex gap-3 align-items-center">
				{#if !isSidebarOpen}
				<Button classList="btn btn-no-padding" onClick={toggleSidebar}>
					<div class="flex align-items-center justify-content-center">
						<List/>
					</div>
				</Button>
				{/if}
				<div class="body-large-semi-bold">{pageTitle}</div>
			</div>
			{/if}
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
					<a href="/events">Acara</a>
				</li>
				<li class="navbar-menu-item {active == 'artikel' ? 'active' : ''}">
					<a href="/articles">Artikel</a>
				</li>
			</ul>
			{/if}
			{#if variant == 'inside'}
			<div class="flex gap-4 align-items-center">
				<div class="flex align-items-center justify-content-center">
					<Bell width={16} height={16}/>
				</div>
				
				<div class="flex align-items-center gap-3 dropdown-menu-profile"
				on:click={toggleDropdown}>
					<p class="body-small-medium mb-0">{user ? username : ''}</p>
					<div class="flex align-items-center gap-2">
						<img src="{PUBLIC_SERVER_PATH}/storage/{user ? user.avatar : ''}" alt="" width="32" height="32">
						<ChevronDown width={16} height={16}/>
					</div>

					{#if dropdownOpen}
					<div class="dropdown-content-profile">
						<a href="/">
							<div class="flex align-items-center gap-2 p-standard">
								<HouseDoor color="#8191AC"/>
								<p class="body-small-reguler mb-0">Kembali ke Beranda</p>
							</div>
						</a>
						<a href="/{user.role.toLowerCase().split(" ")[0]}/settings">
							<div class="flex align-items-center gap-2 p-standard">
								<Gear color="#8191AC" />
								<p class="body-small-reguler mb-0">Pengaturan Akun</p>
							</div>
						</a>
						<Button classList="btn btn-no-padding btn-logout" onClick={() => {
							destroyCookie('datas')
							setFlash({title: "Berhasil", message: "Akun anda telah berhasil dikeluarkan", type: 'success', redirect: "/"})
							return
						}}> 
							<div class="flex align-items-center gap-2 p-standard">
								<BoxArrowInLeft color="#8191AC" />
								<p class="body-small-reguler mb-0">Keluar</p>
							</div>
						</Button>
					</div>
					{/if}
				</div>
			</div>
			{:else if user}
			<div class="flex gap-2 align-items-center">
				<div class="flex align-items-center justify-content-center">
					<Bell width={16} height={16}/>
				</div>
				
				<div class="flex align-items-center gap-3 dropdown-menu-profile"
				on:click={toggleDropdown}>
					<p class="body-small-medium mb-0">{user ? username : ''}</p>
					<div class="flex align-items-center gap-2">
						<img src="{PUBLIC_SERVER_PATH}/storage/{user ? user.avatar : ''}" alt="" width="32" height="32">
						<ChevronDown width={16} height={16}/>
					</div>

					{#if dropdownOpen}
					<div class="dropdown-content-profile">
						<a href="/{user.role.toLowerCase().split(" ")[0]}/dashboard">
							<div class="flex align-items-center gap-2 p-standard">
								<HouseDoor color="#8191AC"/>
								<p class="body-small-reguler mb-0">Kembali ke Dasbor</p>
							</div>
						</a>
						<a href="/{user.role.toLowerCase().split(" ")[0]}/settings">
							<div class="flex align-items-center gap-2 p-standard">
								<Gear color="#8191AC" />
								<p class="body-small-reguler mb-0">Pengaturan Akun</p>
							</div>
						</a>
						<Button classList="btn btn-no-padding btn-logout" onClick={() => {
							destroyCookie('datas')
							setFlash({title: "Berhasil", message: "Akun anda telah berhasil dikeluarkan", type: 'success', redirect: "/"})
							return
						}}> 
							<div class="flex align-items-center gap-2 p-standard">
								<BoxArrowInLeft color="#8191AC" />
								<p class="body-small-reguler mb-0">Keluar</p>
							</div>
						</Button>
					</div>
					{/if}
				</div>
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

	.dropdown-menu-profile {
		position: relative;
		cursor: pointer;
	}

	.dropdown-content-profile {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: calc(100% + 1rem);
		right: 0;
		background-color: var(--neutral-white);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: .25rem;
		z-index: 10;
		overflow: hidden;
	}

	.dropdown-content-profile a {
		text-wrap: nowrap;
		text-decoration: none;
		color: var(--dark);
	}

	.dropdown-content-profile a:hover {
		background-color: var(--hover);
	}

	/* End of Navbar Section */
</style>
