<script>
	import Sidebar from '@components/Sidebar.svelte';
	import Navbar from '@components/Navbar.svelte';
	import SortMenu from '@components/SortMenu.svelte';
	import SearchMenu from '@components/SearchMenu.svelte';
	import Button from '@components/Button.svelte';

	let user;
	let handler, rows;
	let options = [
		{ val: 'newest', label: 'Terbaru' },
		{ val: 'asc', label: 'A-Z' },
		{ val: 'desc', label: 'Z-A' }
	];
</script>

<div class="flex">
	<Sidebar active="Daftar Karyawan" role="Corporate Admin" />
	<div class="neutral-wrapper px-3">
		<Navbar active="" variant="inside" pageTitle="Daftar Karyawan" />
		<main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
			<div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
				<div class="flex flex-wrap justify-content-between align-items-center gap-4">
					<div class="flex flex-wrap gap-3 grow-item">
						<SortMenu
							{options}
							action={(evt) => {
								let sortBy = evt.target.value;

								if (sortBy == 'newest') {
									handler.sortDesc('created_at');
								} else if (sortBy == 'asc') {
									handler.sortAsc('fullname');
								} else if (sortBy == 'desc') {
									handler.sortDesc('fullname');
								} else {
									handler.sort('id');
								}
							}}
						/>

						<SearchMenu action={(evt) => handler.search(evt.target.value, ['fullname'])} />
					</div>
					<Button type="link" href="" classList="btn btn-main pl-4 grow-item grow-auto-md">
						<div class="flex align-items-center justify-content-center gap-2">
							<img src="/icons/plus-lg.svg" alt="plus-icon" />
							<div>Tambah Karyawan</div>
						</div>
					</Button>
				</div>

				<div class="table-responsive radius-sm">
					<table class="table number">
						<thead>
							<tr>
								<th class="text-center">No</th>
								<th>Nama</th>
								<th>Email</th>
								<th>Jumlah Materi</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody class="table-border-bottom">
							<tr>
								<td class="text-center">1</td>
								<td>Prina Gita Adriana</td>
								<td>prinagita@gmail.com</td>
								<td>120 materi</td>
								<td>
									<Button classList="btn btn-info py-1 px-2">Detail</Button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</main>
	</div>
</div>
