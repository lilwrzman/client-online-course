<script>
    import { 
        HouseDoorFill, BriefcaseFill, WalletFill, BookFill, 
        Calendar2EventFill, PeopleFill, ChevronDown, ChevronUp, BoxFill,
        BarChartFill, PersonVcardFill, EmojiSmileFill, ChatLeftDotsFill,
		List
    } from "svelte-bootstrap-icons";
	import Button from "./Button.svelte";
    
    export let role 
    export let active = "Dasbor"
    export let isOpen = false

	export let isSidebarOpen = true
    
    const handleOpen = () => isOpen = !isOpen
	const toggleSidebar = () => isSidebarOpen = !isSidebarOpen
</script>

<aside class:is-open={isSidebarOpen}>
	<div class="sidebar">
		<div class="flex-column p-3" style="gap: 14px;">
			<div class="flex gap-3 align-items-center p-standard">
				<Button classList="btn btn-no-padding" onClick={toggleSidebar}>
					<div class="flex align-items-center justify-content-center">
						<List />
					</div>
				</Button>
				<a href="/" class="h5 mb-0">LOGO DISINI</a>
			</div>
			<ul class="sidebar-menu">
				{#if role == 'Superadmin'}
					<li>
						<a
							href="/superadmin/dashboard"
							class="menu {active == 'Dasbor' ? 'menu-active' : ''}"
						>
							<HouseDoorFill
								width="20"
								height="20"
								color={active == 'Dasbor' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Dasbor'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Dasbor
							</p>
						</a>
					</li>
					<li>
						<button
							class="menu {isOpen ? 'menu-active' : ''} justify-content-between"
							on:click={handleOpen}
						>
							<div class="flex gap-4">
								<BriefcaseFill width="20" height="20" color={isOpen ? '#3951A8' : '#8191AC'} />
								<p class="body-small-semi-bold {isOpen ? 'tc-primary-main' : 'tc-neutral-primary'}">
									Bank Kursus
								</p>
							</div>
							{#if isOpen}
								<ChevronUp width="20" height="20" color="#3951A8" />
							{:else}
								<ChevronDown width="20" height="20" color="#8191AC" />
							{/if}
						</button>
						{#if isOpen}
							<div class="menu-dropdown">
								<a href="/superadmin/learning-path" class="menu-dropdown-item">
									<div class="flex gap-4">
										<BriefcaseFill width="20" height="20" color="transparent" />
										<p
											class="body-small-semi-bold {active == 'Alur Belajar'
												? 'tc-primary-main'
												: 'tc-neutral-primary'}"
										>
											Alur Belajar
										</p>
									</div>
								</a>
								<a href="/superadmin/course" class="menu-dropdown-item">
									<div class="flex gap-4">
										<BriefcaseFill width="20" height="20" color="transparent" />
										<p
											class="body-small-semi-bold {active == 'Materi'
												? 'tc-primary-main'
												: 'tc-neutral-primary'}"
										>
											Materi
										</p>
									</div>
								</a>
							</div>
						{/if}
					</li>
					<li>
						<a
							href="/superadmin/transaction"
							class="menu {active == 'Transaksi' ? 'menu-active' : ''}"
						>
							<WalletFill
								width="20"
								height="20"
								color={active == 'Transaksi' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Transaksi'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Transaksi
							</p>
						</a>
					</li>
					<li>
						<a
							href="/superadmin/bundle"
							class="menu {active == 'Paket Kursus' ? 'menu-active' : ''}"
						>
							<BoxFill
								width="20"
								height="20"
								color={active == 'Paket Kursus' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Paket Kursus'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Paket Kursus
							</p>
						</a>
					</li>
					<li>
						<a
							href="/superadmin/progress"
							class="menu {active == 'Progres Karyawan' ? 'menu-active' : ''}"
						>
							<BarChartFill
								width="20"
								height="20"
								color={active == 'Progres Karyawan' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Progres Karyawan'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Progres Karyawan
							</p>
						</a>
					</li>
					<li>
						<a
							href="/superadmin/article"
							class="menu {active == 'Manajemen Artikel' ? 'menu-active' : ''}"
						>
							<BookFill
								width="20"
								height="20"
								color={active == 'Manajemen Artikel' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Manajemen Artikel'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Manajemen Artikel
							</p>
						</a>
					</li>
					<li>
						<a
							href="/superadmin/event"
							class="menu {active == 'Manajemen Event' ? 'menu-active' : ''}"
						>
							<Calendar2EventFill
								width="20"
								height="20"
								color={active == 'Manajemen Event' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Manajemen Event'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Manajemen Event
							</p>
						</a>
					</li>
					<li>
						<a
							href="/superadmin/account/student"
							class="menu {active == 'Manajemen Akun' ? 'menu-active' : ''}"
						>
							<PeopleFill
								width="20"
								height="20"
								color={active == 'Manajemen Akun' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Manajemen Akun'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Manajemen Akun
							</p>
						</a>
					</li>
				{:else if role == 'Teacher'}
					<li>
						<a
							href="/teacher/dashboard"
							class="menu body-small-semi-bold {active == 'Dasbor'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<HouseDoorFill
								width="20"
								height="20"
								color={active == 'Dasbor' ? '#3951A8' : '#8191AC'}
							/>
							<p>Dasbor</p>
						</a>
					</li>
					<li>
						<button
							class="menu {isOpen ? 'menu-active' : ''} justify-content-between"
							on:click={handleOpen}
						>
							<div class="flex gap-4">
								<BriefcaseFill width="20" height="20" color={isOpen ? '#3951A8' : '#8191AC'} />
								<p class="body-small-semi-bold {isOpen ? 'tc-primary-main' : 'tc-neutral-primary'}">
									Bank Kursus
								</p>
							</div>
							{#if isOpen}
								<ChevronUp width="20" height="20" color="#3951A8" />
							{:else}
								<ChevronDown width="20" height="20" color="#8191AC" />
							{/if}
						</button>
						{#if isOpen}
							<div class="menu-dropdown">
								<a href="/teacher/learning-path" class="menu-dropdown-item">
									<div class="flex gap-4">
										<BriefcaseFill width="20" height="20" color="transparent" />
										<p
											class="body-small-semi-bold {active == 'Alur Belajar'
												? 'tc-primary-main'
												: 'tc-neutral-primary'}"
										>
											Alur Belajar
										</p>
									</div>
								</a>
								<a href="/teacher/course" class="menu-dropdown-item">
									<div class="flex gap-4">
										<BriefcaseFill width="20" height="20" color="transparent" />
										<p
											class="body-small-semi-bold {active == 'Materi'
												? 'tc-primary-main'
												: 'tc-neutral-primary'}"
										>
											Materi
										</p>
									</div>
								</a>
							</div>
						{/if}
					</li>
					<li>
						<a
							href="/teacher/progress"
							class="menu body-small-semi-bold {active == 'Progres Karyawan'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<BarChartFill
								width="20"
								height="20"
								color={active == 'Progres Karyawan' ? '#3951A8' : '#8191AC'}
							/>
							<p>Progres Karyawan</p>
						</a>
					</li>
					<li>
						<a
							href="/teacher/student"
							class="menu body-small-semi-bold {active == 'Daftar Karyawan'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<PersonVcardFill
								width="20"
								height="20"
								color={active == 'Daftar Karyawan' ? '#3951A8' : '#8191AC'}
							/>
							<p>Daftar Karyawan</p>
						</a>
					</li>
					<li>
						<a
							href="/teacher/feedback"
							class="menu body-small-semi-bold {active == 'Umpan Balik'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<EmojiSmileFill
								width="20"
								height="20"
								color={active == 'Umpan Balik' ? '#3951A8' : '#8191AC'}
							/>
							<p>Umpan Balik</p>
						</a>
					</li>
					<li>
						<a
							href="/teacher/discussion"
							class="menu body-small-semi-bold {active == 'Forum Diskusi'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<ChatLeftDotsFill
								width="20"
								height="20"
								color={active == 'Forum Diskusi' ? '#3951A8' : '#8191AC'}
							/>
							<p>Forum Diskusi</p>
						</a>
					</li>
				{:else if role == 'Corporate Admin'}
					<li>
						<a
							href="/corporate/dashboard"
							class="menu body-small-semi-bold {active == 'Dasbor'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<HouseDoorFill
								width="20"
								height="20"
								color={active == 'Dasbor' ? '#3951A8' : '#8191AC'}
							/>
							<p>Dasbor</p>
						</a>
					</li>
					<li>
						<a
							href="/corporate/progress"
							class="menu body-small-semi-bold {active == 'Progres Karyawan'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<BarChartFill
								width="20"
								height="20"
								color={active == 'Progres Karyawan' ? '#3951A8' : '#8191AC'}
							/>
							<p>Progres Karyawan</p>
						</a>
					</li>
					<li>
						<a
							href="/corporate/student"
							class="menu body-small-semi-bold {active == 'Daftar Karyawan'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<PersonVcardFill
								width="20"
								height="20"
								color={active == 'Daftar Karyawan' ? '#3951A8' : '#8191AC'}
							/>
							<p>Daftar Karyawan</p>
						</a>
					</li>
					<li>
						<a
							href="/corporate/student"
							class="menu body-small-semi-bold {active == 'Transaksi'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<WalletFill
								width="20"
								height="20"
								color={active == 'Transaksi' ? '#3951A8' : '#8191AC'}
							/>
							<p>Transaksi</p>
						</a>
					</li>
					<li>
						<a
							href="/corporate/bundle"
							class="menu body-small-semi-bold {active == 'Paket Kursus'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<BoxFill
								width="20"
								height="20"
								color={active == 'Paket Kursus' ? '#3951A8' : '#8191AC'}
							/>
							<p>Paket Kursus</p>
						</a>
					</li>
				{/if}
			</ul>
		</div>
		<div class="flex-column gap-2 px-4 py-3">
			<div class="h5">Lorem Ipsum</div>
			<div class="body-small-reguler">© All rights reserved.</div>
		</div>
	</div>
</aside>

<style>
	aside {
		background-color: var(--neutral-white);
		display: none;
		width: 22.5rem;
		height: 100vh;
		max-height: 100%;
		position: sticky;
		position: -webkit-sticky;
		top: 0;
	}

	aside.is-open {
        display: flex;
    }

	aside > div {
		overflow-y: auto;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: space-between;
	}

	.sidebar-menu {
		padding: 0;
		margin: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.menu {
		font-family: 'Poppins', sans-serif;
		display: flex;
		gap: 24px;
		padding: 20px 14px;
		align-items: center;
		border-radius: 0.25rem;
		cursor: pointer;
		border: none;
		width: 100%;
		background-color: transparent;
		transition: all 0.25s ease;
	}

	.menu:hover {
		background-color: var(--hover);
		padding: 1.375rem 0.875rem;
	}

	.menu-dropdown-item {
		padding: 20px 14px;
		transition: all 0.25s ease;
		border-radius: 0.25rem;
	}

	.menu-dropdown-item:hover {
		background-color: var(--hover);
		padding: 1.375rem 0.875rem;
	}

	.menu-active {
		background-color: var(--hover);
	}

	.toggle-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px;
        margin: 10px;
    }

    @media (max-width: 768px) {
        aside {
            width: 100%;
        }
    }
</style>
