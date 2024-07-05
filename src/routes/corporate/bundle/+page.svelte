<script>
	import Sidebar from '@components/Sidebar.svelte';
	import Navbar from '@components/Navbar.svelte';
	import SortMenu from '@components/SortMenu.svelte';
	import SearchMenu from '@components/SearchMenu.svelte';
	import Button from '@components/Button.svelte';
    import Toast from '@components/Toast.svelte';
	import { Copy } from 'svelte-bootstrap-icons';
	import { onMount } from 'svelte';
	import checkLogin from '$lib/CheckLogin';
	import ApiController from '$lib/ApiController';
	import { DataHandler } from '@vincjo/datatables';

	let user
	let handler, rows, pageNumber, rowsPerPage = 10, pageCount
	let options = [
		{ val: 'newest', label: 'Terbaru' },
		{ val: 'asc', label: 'A-Z' },
		{ val: 'desc', label: 'Z-A' }
	];

	let bundles

    let toastData = null
    let toastVisible = false

	const getBundles = () => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: "bundle/get",
			authToken: user.token
		}).then(response => {
			if(response.status){
				bundles = response.data
				console.log(bundles)
				handler = new DataHandler(bundles, {rowsPerPage})
				rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
			}
		}).catch(e => {
			let error = e.response.data
			console.error(error)
		})
	}

	onMount(() => {
		user = checkLogin("Corporate Admin", true)

		getBundles()
	})

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
								<th class="text-center">Kode Tukar</th>
								<th class="text-center">Penukaran</th>
								<th class="text-center">Limit</th>
								<th class="text-center">Aksi</th>
							</tr>
						</thead>
						<tbody class="table-border-bottom">
							{#if $rows}
							{#if $rows.length > 0}
							{#each $rows as bundle, index (bundle.id)}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{bundle.bundle_code}</td>
								<td class="text-center">{bundle.bundle_items.length}</td>
								<td>{bundle.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) }</td>
								<td class="text-center">
									<div class="flex justify-content-center gap-2 align-items-center">
										{bundle.redeem_code.code}
										<Button classList="btn btn-no-padding" onClick={() => {
                                            navigator.clipboard.writeText(bundle.redeem_code.code)
                                            toastData = {title: "Berhasil", message:"Kode berhasil disalin", color: "toast-success"}
                                            toastVisible = true
                                        }}>
                                            <Copy/>
                                        </Button>
                                            
									</div>
								</td>
								<td class="text-center">{bundle.redeem_code.redeem_history.length}</td>
								<td class="text-center">{bundle.quota}x</td>
								<td class="text-center">
									<Button type="link" href="/corporate/bundle/{bundle.id}" classList="btn btn-info py-1 px-2">Detail</Button>
								</td>
							</tr>
							{/each}
							{/if}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	</div>
</div>
