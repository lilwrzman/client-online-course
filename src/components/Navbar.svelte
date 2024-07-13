<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import { onMount } from 'svelte';

	import { setFlash } from "$lib/Flash"
	import Button from '@components/Button.svelte';
	import LoginModal from '@components/LoginModal.svelte';
	import { Bell, ChevronDown, HouseDoor, Gear, BoxArrowInLeft, List } from "svelte-bootstrap-icons"
	import { extract, destroyCookie } from '$lib/Cookie';
	import Modal from "./Modal.svelte";
	import ApiController from "$lib/ApiController";
	import Spinner from "./Spinner.svelte";
	import Notification from "./Notification.svelte";

	let user
	export let active = ''
	export let variant = 'outside'
	export let pageTitle = ''
	export let isSidebarOpen = true

	const toggleSidebar = () => isSidebarOpen = !isSidebarOpen

	let isFixed = false
	let modalShow = false
	let isLoggedIn = false

	let modalLogoutShow = false
	let showSpinner = false

	let dropdownOpen = false
	let notificationOpen = false

	let status = false
	let notifications = []

	function handleScroll(){
		isFixed = window.scrollY >= 50
	}

	function toggleNotification(event) {
		notificationOpen = !notificationOpen
		event.stopPropagation()
	}

	function handleClickOutsideNotification(event) {
		if(notificationOpen && !event.target.closest('.dropdown-menu-notification')){
			notificationOpen = false
		}
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

	const logout = () => {
		showSpinner = true
		ApiController.sendRequest({
			method: "GET",
			endpoint: "logout",
			authToken: user.token
		}).then(response => {
			if(response.status){
				destroyCookie('datas')
				setFlash({title: "Berhasil", message: "Akun anda telah berhasil dikeluarkan", type: 'success', redirect: "/"})
				return
			}
		}).catch(e => {
			let error = e.response.data

			console.error(error)
		})
	}

	const getUser = () => {
		user = extract('datas')
		if(user){
			isLoggedIn = true
			getNotification(user.token)
		}else{
			isLoggedIn = false
		}

		status = true
	}

	const getNotification = (token) => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: "notification/get",
			authToken: token
		}).then(response => {
			if(response.status){
				notifications = response.data
			}
		}).catch(e => {
			let error = e.response.data
			console.error(error)
		})
	}

	onMount(() => {
		getUser()

		window.addEventListener('scroll', handleScroll)
		window.addEventListener('click', handleClickOutside)
		window.addEventListener('click', handleClickOutsideNotification)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			document.removeEventListener('click', handleClickOutside)
			document.removeEventListener('click', handleClickOutsideNotification)
		}
	})
</script>

{#if showSpinner}
	<Spinner/>
{/if}

<header>
	<nav class="nav
		{variant == 'outside' || variant == 'combined' ? 'nav-light' : 'nav-neutral'}
		{isFixed && variant == "outside" ? 'navbar-shadow' : ''}
		w-100">
		<div class="container flex justify-content-between align-items-center h-100">
			{#if variant == 'outside' || variant == 'combined'}
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
			{#if variant == 'outside' || variant == 'combined'}
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

			{#if !status}
			<div></div>
			{:else}
				{#if isLoggedIn}
				<div class="flex gap-4 align-items-center">
					<div class="dropdown-menu-notification">
						<Button classList="btn btn-no-padding" onClick={toggleNotification}>
							<div class="flex align-items-center justify-content-center gap-1">
								<Bell width={16} height={16}/>
								{#if notifications.filter(elm => !elm.is_seen).length > 0}
								<div class="flex px-1 align-items-center justify-content-center bg-danger-main radius-sm">
									<p class="notification-count mb-0">{notifications.filter(elm => !elm.is_seen).length}</p>
								</div>
								{/if}
							</div>
						</Button>

						{#if notificationOpen}
							<Notification bind:notificationOpen={notificationOpen} bind:notifications={notifications} bind:token={user.token} />
						{/if}
					</div>
					
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="flex align-items-center gap-3 dropdown-menu-profile"
					on:click={toggleDropdown} role="button" aria-label="toggle-profile-dropdown" tabindex="0">
						<p class="body-small-medium mb-0">{user.username}</p>
						<div class="flex align-items-center gap-2">
							<img src="{PUBLIC_SERVER_PATH}/storage/{user.avatar}" alt="" width="32" height="32" class="avatar">
							<ChevronDown width={16} height={16}/>
						</div>

						{#if dropdownOpen}
						<div class="dropdown-content-profile">
							{#if variant == 'outside'}
							<a href="/{user.role.toLowerCase().split(" ")[0]}/dashboard">
								<div class="flex align-items-center gap-2 p-standard">
									<HouseDoor color="#8191AC"/>
									<p class="body-small-reguler mb-0">Kembali ke Dasbor</p>
								</div>
							</a>
							{:else if variant == 'inside'}
							<a href="/">
								<div class="flex align-items-center gap-2 p-standard">
									<HouseDoor color="#8191AC"/>
									<p class="body-small-reguler mb-0">Kembali ke Beranda</p>
								</div>
							</a>
							{:else if variant == 'combined'}
							<a href="/">
								<div class="flex align-items-center gap-2 p-standard">
									<HouseDoor color="#8191AC"/>
									<p class="body-small-reguler mb-0">Kembali ke Beranda</p>
								</div>
							</a>
							{/if}
							<a href="/{user.role.toLowerCase().split(" ")[0]}/settings/profile">
								<div class="flex align-items-center gap-2 p-standard">
									<Gear color="#8191AC" />
									<p class="body-small-reguler mb-0">Pengaturan Akun</p>
								</div>
							</a>
							<Button classList="btn btn-no-padding btn-logout" onClick={() => modalLogoutShow = true}> 
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
			{/if}
		</div>
	</nav>
</header>

{#if modalShow}
	<LoginModal bind:modalShow />
{/if}

{#if modalLogoutShow}
	<Modal bind:modalShow={modalLogoutShow}>
		<div class="card-body gap-5">
			<div class="flex-column">
				<div class="h4">Keluar</div>
				<div class="default-text-input">
					Apakah anda yakin ingin keluar dari sistem?
				</div>
			</div>
			<div class="flex-row-reverse gap-2">
				<Button classList="btn btn-danger" onClick={logout}>Ya, keluar!</Button>
				<Button classList="btn btn-main-outline" onClick={() => {
					modalLogoutShow = false
				}}>Tidak</Button>
			</div>
		</div>  
	</Modal> 
{/if}

<style>
	/* Navbar Section */

	.avatar {
		border-radius: 100%;
	}

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

	.dropdown-menu-notification {
		position: relative;
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

	.notification-count {
		font-size: 8px;
		font-weight: 400;
		line-height: 18px;
	}

	/* End of Navbar Section */
</style>
