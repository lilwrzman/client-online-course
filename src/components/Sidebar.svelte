<script>
	import {
		HouseDoorFill,
		BriefcaseFill,
		WalletFill,
		BookFill,
		Calendar2EventFill,
		PeopleFill,
		ChevronDown,
		ChevronUp,
		BoxFill,
        BarChartFill,
        PersonVcardFill 
	} from 'svelte-bootstrap-icons';

	export let role;
	export let active = 'Dashboard';
	export let isOpen = false;

	const handleOpen = () => (isOpen = !isOpen);
</script>

<aside>
	<div class="sidebar">
		<div class="flex-column p-3" style="gap: 14px;">
			<a href="/" class="h5 p-2">LOGO DISINI</a>
			<ul class="sidebar-menu">
				{#if role == 'Superadmin'}
					<li>
						<a
							href="/superadmin/dashboard"
							class="menu {active == 'Dashboard' ? 'menu-active' : ''}"
						>
							<HouseDoorFill
								width="20"
								height="20"
								color={active == 'Dashboard' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Dashboard'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Beranda
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
							href="/superadmin/account/teacher"
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
					<li>
						<a
							href="/superadmin/bundle"
							class="menu {active == 'Manajemen Bundel' ? 'menu-active' : ''}"
						>
							<BoxFill
								width="20"
								height="20"
								color={active == 'Manajemen Bundel' ? '#3951A8' : '#8191AC'}
							/>
							<p
								class="body-small-semi-bold {active == 'Manajemen Bundel'
									? 'tc-primary-main'
									: 'tc-neutral-primary'}"
							>
								Manajemen Bundel
							</p>
						</a>
					</li>
				{:else if role == 'Teacher'}
					<li>
						<a
							href="/teacher/dashboard"
							class="menu body-small-semi-bold {active == 'Dashboard'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<HouseDoorFill
								width="20"
								height="20"
								color={active == 'Dashboard' ? '#3951A8' : '#8191AC'}
							/>
							<p>Beranda</p>
						</a>
					</li>
					<li>
						<a
							href="/teacher/course"
							class="menu body-small-semi-bold {active == 'Course'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<BookFill width="20" height="20" color={active == 'Course' ? '#3951A8' : '#8191AC'} />
							<p>Materi</p>
						</a>
					</li>
				{:else if role == 'Corporate Admin'}
					<li>
						<a
							href="/corporate/dashboard"
							class="menu body-small-semi-bold {active == 'Dashboard'
								? 'tc-primary-main menu-active'
								: 'tc-neutral-primary'}"
						>
							<HouseDoorFill
								width="20"
								height="20"
								color={active == 'Dashboard' ? '#3951A8' : '#8191AC'}
							/>
							<p>Beranda</p>
						</a>
					</li>
					<li>
						<a
							href="/corporate/student"
							class="menu body-small-semi-bold {active == 'Student'
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
							class="menu body-small-semi-bold {active == 'Student'
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
							class="menu body-small-semi-bold {active == 'Student'
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
							class="menu body-small-semi-bold {active == 'Student'
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
		display: flex;
		width: 22.5rem;
		height: 100vh;
		max-height: 100%;
		position: sticky;
		position: -webkit-sticky;
		top: 0;
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
</style>
