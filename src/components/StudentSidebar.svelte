<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { BarChartFill, ClockHistory, GearFill, HouseDoorFill, TicketFill, Window } from "svelte-bootstrap-icons";

    export let user
    export let active = 'Dasbor'
</script>

<aside>
    <div class="sidebar neutral-border radius-sm">
        <div class="flex-column p-3" style="gap: 14px;">
            <img src="{user ? `${PUBLIC_SERVER_PATH}/storage/${user.avatar}` : '/images/default.png'}" alt="user-avatar" width="90" height="90" style="border-radius: 100%;">
            <div class="flex-column">
                <p class="body-large-semi-bold">{ user ? user.fullname : ''}</p>
                <p class="body-medium-reguler">{ user ? 'Karyawan' : ''}</p>
            </div>
            <ul class="sidebar-menu">
                <li>
                    <a href="/student/dashboard"
                        class="menu {active == 'Dasbor' ? 'menu-active' : ''}" >
                        <HouseDoorFill width="20" height="20" color={active == 'Dasbor' ? '#3951A8' : '#8191AC'} />
                        <p class="body-small-semi-bold {active == 'Dasbor' ? 'tc-primary-main' : 'tc-neutral-primary'}" >
                            Dasbor
                        </p>
                    </a>
                </li>
                <li>
                    <a href="/student/my-courses"
                        class="menu {active == 'Kursus Saya' ? 'menu-active' : ''}" >
                        <Window width="20" height="20" color={active == 'Kursus Saya' ? '#3951A8' : '#8191AC'} />
                        <p class="body-small-semi-bold {active == 'Kursus Saya' ? 'tc-primary-main' : 'tc-neutral-primary'}" >
                            Kursus Saya
                        </p>
                    </a>
                </li>
                <li>
                    <a href="/student/progress"
                        class="menu {active == 'Progres Belajar' ? 'menu-active' : ''}" >
                        <BarChartFill width="20" height="20" color={active == 'Progres Belajar' ? '#3951A8' : '#8191AC'} />
                        <p class="body-small-semi-bold {active == 'Progres Belajar' ? 'tc-primary-main' : 'tc-neutral-primary'}" >
                            Progres Belajar
                        </p>
                    </a>
                </li>
                <li>
                    <a href="/student/redeem"
                        class="menu {active == 'Tukar Kode' ? 'menu-active' : ''}" >
                        <TicketFill width="20" height="20" color={active == 'Tukar Kode' ? '#3951A8' : '#8191AC'} />
                        <p class="body-small-semi-bold {active == 'Tukar Kode' ? 'tc-primary-main' : 'tc-neutral-primary'}" >
                            Tukar Kode
                        </p>
                    </a>
                </li>
                <li>
                    <a href="/student/transactions"
                        class="menu {active == 'Riwayat Transaksi' ? 'menu-active' : ''}" >
                        <ClockHistory width="20" height="20" color={active == 'Riwayat Transaksi' ? '#3951A8' : '#8191AC'} />
                        <p class="body-small-semi-bold {active == 'Riwayat Transaksi' ? 'tc-primary-main' : 'tc-neutral-primary'}" >
                            Riwayat Transaksi
                        </p>
                    </a>
                </li>
                <li>
                    <a href="/student/settings/profile"
                        class="menu {active == 'Pengaturan Akun' ? 'menu-active' : ''}" >
                        <GearFill width="20" height="20" color={active == 'Pengaturan Akun' ? '#3951A8' : '#8191AC'} />
                        <p class="body-small-semi-bold {active == 'Pengaturan Akun' ? 'tc-primary-main' : 'tc-neutral-primary'}" >
                            Pengaturan Akun
                        </p>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</aside>

<style>
    aside {
		background-color: var(--neutral-white);
		display: flex;
		width: 20rem;
        height: fit-content;
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
		gap: .875rem;
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

	.menu-active {
		background-color: var(--hover);
	}
</style>