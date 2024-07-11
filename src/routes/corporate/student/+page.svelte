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
	let isAdd = false
	let errors = {}
	let email = ""
	let target

	let showSpinner = false
	let toastData
	let toastVisible = false

	const getStudents = () => {
		ApiController.sendRequest({
			method: "GET",
			endpoint: "corporate/student",
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

	const findByEmail = () => {
		if(!email){
			return alert('Mohon isi email terlebih dahulu!')
		}

		showSpinner = true
		ApiController.sendRequest({
			method: "POST",
			endpoint: "corporate/student/check",
			data: {email},
			authToken: user.token
		}).then(response => {
			if(response.status){
				target = response.data

				if(students.filter(elm => elm.email == target.email)){
					target = null
					errors.email = `Akun dengan email ${email} sudah ditambahkan!`
				}

				showSpinner = false
			}
		}).catch(e => {
			let error = e.response.data
			if(error.error == `Akun dengan email ${email} tidak ditemukan!`){
				errors.email = error.error
			}
			showSpinner = false
		})
	}

	const addStudent = (id) => {
		showSpinner = true
		ApiController.sendRequest({
			method: "POST",
			endpoint: "corporate/student/add",
			data: { student_id: id },
			authToken: user.token
		}).then(response => {
			if(response.status){
				target = null
				email = ""
				isAdd = false
				getStudents()
				toastData = {
					title: "Berhasil",
					message: response.message,
					color: "toast-success"
				}
				toastVisible = true
				showSpinner = false
			}
		}).catch(e => {
			target = null
			email = ""
			isAdd = false
			let error = e.response.data
			console.error(error)

			if(error.error){
				toastData = {
					title: "Gagal",
					message: error.error,
					color: "toast-danger"
				}
				toastVisible = true
				showSpinner = false
			}
		})
	}

	onMount(() => {
		user = checkLogin("Corporate Admin", true)

		getStudents()
	})

	let isSidebarOpen = true
</script>

<div class="flex">
	<Sidebar active="Daftar Karyawan" role="Corporate Admin" bind:isSidebarOpen={isSidebarOpen}/>
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
					{#if !isAdd}
					<Button classList="btn btn-main pl-4 grow-item grow-auto-md" onClick={() => {
						target = null
						email = ""
						isAdd = true
					}}>
						<div class="flex align-items-center justify-content-center gap-2">
							<img src="/icons/plus-lg.svg" alt="plus-icon" />
							<div>Tambah Karyawan</div>
						</div>
					</Button>
					{/if}
				</div>

				{#if isAdd}
				<div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, x: -100, opacity: 0, easing: quintOut }}>
					<div class="card-body">
						<div class="flex justify-content-between">
							<div class="flex-column gap-1">
								<p class="body-medium-semi-bold">Tambah Karyawan</p>
								<p class="body-small-reguler">Masukkan email karyawan yang ingin ditambahkan dengan tepat</p>
							</div>
							<div class="flex align-items-start justify-content-start">
								<Button classList="btn btn-no-padding" onClick={() => {
									isAdd = false
									errors = {}	
								}}>
									<X width=24 height=24/>
								</Button>
							</div>
						</div>
						<div class="row align-items-start">
							<div class="col-4">
								<InputField inputClass="input-bg-light radius-sm" id="find-email" placeholder="Masukkan email karyawan ..."
									bind:value={email}
									rules={[{required: true, type: 'email'}]}
									error={errors ? errors.email ? errors.email : '' : ''}/>
							</div>
							<div class="col-2 px-0">
								<Button classList="btn btn-main" onClick={findByEmail}>
									<div class="flex align-items-center gap-2">
										<Search/>
										Temukan
									</div>
								</Button>
							</div>
						</div>
						{#if target}
						<div class="flex align-items-start">
							<div class="card neutral-border radius-sm p-standard">
								<div class="card-body">
									<div class="flex align-items-center justify-content-between gap-6">
										<div class="flex align-items-center gap-standard">
											<div class="flex align-items-center justify-content-center">
												<img src="{PUBLIC_SERVER_PATH}/storage/{target.avatar}" alt="avatar" class="avatar">
											</div>
											<div class="flex-column h-100 justify-content-center">
												<p class="body-small-semi-bold">
													{target.info.fullname}
												</p>
												<p class="caption-small-reguler">
													{target.email}
												</p>
											</div>
										</div>
										<Button classList="btn btn-main-outline" onClick={() => addStudent(target.id)}>
											<div class="flex align-items-center gap-2">
												<PlusLg/>
												Tambahkan
											</div>
										</Button>
									</div>
								</div>
							</div>
						</div>
						{/if}
					</div>
				</div>
				{/if}

				<div class="card radius-sm gap-3" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
					<div class="table-responsive radius-sm">
						<table class="table number">
							<thead>
								<tr>
									<th class="text-center">No</th>
									<th>Nama</th>
									<th>Email</th>
									<th class="text-center">Jumlah Materi</th>
									<th class="text-center">Aksi</th>
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
									<td class="text-center">{student.corporate_course.length} materi</td>
									<td class="text-center">
										<Button classList="btn btn-info py-1 px-2">Detail</Button>
									</td>
								</tr>
								{/each}
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


<style>
	.avatar {
		width: 60px;
		border-radius: .25rem;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}
</style>