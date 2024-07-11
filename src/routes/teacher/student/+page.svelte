<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public"
	import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"
	import Sidebar from '@components/Sidebar.svelte';
	import Navbar from '@components/Navbar.svelte';
	import SortMenu from '@components/SortMenu.svelte';
	import SearchMenu from '@components/SearchMenu.svelte';
	import Button from '@components/Button.svelte';
	import { onMount } from 'svelte';
	import ApiController from '$lib/ApiController';
	import checkLogin from '$lib/CheckLogin';
	import { DataHandler } from '@vincjo/datatables';
	import { X, Search, PlusLg } from "svelte-bootstrap-icons"
	import InputField from "@components/InputField.svelte"
	import Spinner from "@components/Spinner.svelte"
	import Toast from "@components/Toast.svelte"

	let user;
	let handler, rows, pageNumber, rowsPerPage = 10, pageCount
	let options = [
		{ val: 'newest', label: 'Terbaru' },
		{ val: 'asc', label: 'A-Z' },
		{ val: 'desc', label: 'Z-A' }
	];

	let students

	let showSpinner = false
	let toastData
	let toastVisible = false

	const getStudents = () => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: "teacher/student",
			authToken: user.token
		}).then(response => {
			if(response.status){
				students = response.data
				handler = new DataHandler(students, {rowsPerPage})
				rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
			}
		}).catch(e => {
			let error = e.response.data
		})
	}

	onMount(() => {
		user = checkLogin("Teacher", true)

		getStudents()
	})

	let isSidebarOpen = true
</script>

<div class="flex">
	<Sidebar active="Daftar Karyawan" role="Teacher" bind:isSidebarOpen={isSidebarOpen}/>
	<div class="neutral-wrapper px-3">
		<Navbar active="" variant="inside" pageTitle="Daftar Karyawan" bind:isSidebarOpen={isSidebarOpen}/>
		<main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
			{#if toastVisible}
				<Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color}/>
			{/if}
			
			{#if showSpinner}
				<Spinner/>
			{/if}
			<div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
				<div class="flex flex-wrap gap-3">
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

				<div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
					<div class="table-responsive radius-sm">
						<table class="table number">
							<thead>
								<tr>
									<th class="text-center">No</th>
									<th>Nama</th>
									<th>Email</th>
									<th class="text-center">Jumlah Materi</th>
								</tr>
							</thead>
							<tbody class="table-border-bottom">
								{#if $rows}
								{#if $rows.length > 0}
								{#each $rows as student, index (student.id)}
								<tr>
									<td class="text-center">{index + 1}</td>
									<td>{student.info.fullname}</td>
									<td>{student.email}</td>
									<td class="text-center">{student.course_count} materi</td>
								</tr>
								{/each}
								{:else}
								<tr>
									<td colspan="4" class="text-center">Belum ada karyawan yang terdaftar di materi-materi anda.</td>
								</tr>
								{/if}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>

<svelte:head>
	<title>Daftar Karyawan</title>
</svelte:head>