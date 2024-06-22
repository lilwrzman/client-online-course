<script>
	import Sidebar from '@components/Sidebar.svelte';
	import Navbar from '@components/Navbar.svelte';
	import SortMenu from '@components/SortMenu.svelte';
	import SearchMenu from '@components/SearchMenu.svelte';
	import Button from '@components/Button.svelte';
    import Toast from '@components/Toast.svelte';
	import { Copy } from 'svelte-bootstrap-icons';

	let user;
	let handler, rows;
	let options = [
		{ val: 'newest', label: 'Terbaru' },
		{ val: 'asc', label: 'A-Z' },
		{ val: 'desc', label: 'Z-A' }
	];

    let toastData = null
    let toastVisible = false

</script>

<div class="flex">
	<Sidebar active="Paket Kursus" role="Corporate Admin" />
	<div class="neutral-wrapper px-3">
		<Navbar active="" variant="inside" pageTitle="Paket Kursus" />
		<main style="flex-grow: 1: overvlow-y: hidden;" class="flex-column">
			<div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color}/>
                    
                {/if}
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
				</div>

				<div class="table-responsive radius-sm">
					<table class="table number">
						<thead>
							<tr>
								<th class="text-center">No</th>
								<th>Kode Paket</th>
								<th class="text-center">Isi Materi</th>
								<th>Harga</th>
								<th>Kode Tukar</th>
								<th class="text-center">Penukaran</th>
								<th class="text-center">Limit</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody class="table-border-bottom">
							<tr>
								<td class="text-center">1</td>
								<td>#BANKBNI_17181139201473</td>
								<td class="text-center">13</td>
								<td>Rp 152.500.000</td>
								<td>
									<div class="flex justify-content-center gap-2 align-items-center">
										TU239028
										<Button classList="btn btn-no-padding" onClick={() => {
                                            navigator.clipboard.writeText("TU239028")
                                            toastData = {title: "Berhasil", message:"Kode berhasil disalin", color: "toast-success"}
                                            toastVisible = true
                                        }}>
                                            <Copy/>
                                        </Button>
                                            
									</div>
								</td>
								<td class="text-center">1</td>
								<td class="text-center">2500x</td>
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
