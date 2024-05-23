<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"

    import { extract } from "$lib/Cookie"
    import { getFlash } from "$lib/Flash";

    import Sidebar from "@components/Sidebar.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Tab from "@components/Tab.svelte"
    import Button from "@components/Button.svelte"
    import InputField from "@components/InputField.svelte"
    import {DataHandler} from "@vincjo/datatables"
	import ApiController from "$lib/ApiController";
    import Toast from "@components/Toast.svelte";

    let user
    let handler, rows
    let sortBy, option = [
        {value: "newest", text:"Terbaru"}, 
        {value: "asc", text: 'A-Z'}, 
        {value: "desc", text: "Z-A"}
    ]
    sortBy = option[0].value

    let toastData = null
    let toastVisible = false

    let teachers, status = false

    const handleSort = (evt) => {
        sortBy = evt.target.value

        if(sortBy == 'newest'){
            handler.sortDesc('created_at')
        }else if(sortBy == 'asc'){
            handler.sortAsc('fullname')
        }else if(sortBy == 'desc'){
            handler.sortDesc('fullname')
        }
    }

    const getTeachers = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "account/get?role=Teacher",
            authToken: user.token
        }).then(response => {
            teachers = response.data
            handler = new DataHandler(teachers)
            rows = handler.getRows()
            handler.sortDesc('created_at')
            status = true
        })
    }

    onMount(() => {
        let flashes = getFlash()
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
        }

        if(flashes){
            toastData = {
                title: "Sukses",
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }

        getTeachers()
    })
</script>

<div class="flex">
    <Sidebar active="Manajemen Akun" role="{user ? user.role : ''}" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Akun"/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                <Tab menus={[
                    {'title': 'Pemateri', 'href': '/superadmin/account/teacher', active: true},
                    {'title': 'Mitra', 'href': '/superadmin/account/corporate'},
                    {'title': 'Karyawan', 'href': '/superadmin/account/studenr'}
                ]}/>
                <div class="card radius-sm gap-3">
                    <div class="flex-column mb-3">
                        <div class="body-medium-semi-bold">Akun Pemateri</div>
                        <div class="body-small-reguler">Kelola akun-akun untuk digunakan pemateri LPK!</div>
                    </div>
                    <div class="flex flex-wrap justify-content-between align-items-center gap-4">
                        <div class="flex flex-wrap gap-4 grow-item">
                            <InputField type="select-option" id="select-default" 
                                containerClass="grow-item grow-auto-md"   
                                inputClass="input-bg-neutral pr-8" 
                                onInput={handleSort}
                                value={sortBy} option={option}/>
                            <InputField type="search" id="search" placeholder="Search..." 
                                containerClass="grow-item grow-auto-md"   
                                inputClass="input-bg-light neutral-border" onInput={(evt) => {
                                    handler.search(evt.target.value, ['fullname'])
                                }}/>
                        </div>
                        <Button type="link" href="/superadmin/account/teacher/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                            <div class="flex align-items-center justify-content-center gap-2">
                                <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                                <div>Tambah Baru</div>
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
                                    <th class="text-center">Materi</th>
                                    <th class="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="table-border-bottom">
                                {#if status}
                                {#if $rows.length > 0}
                                {#each $rows as row, index}
                                <tr>
                                    <td class="text-center">{index + 1}</td>
                                    <td>{row.fullname}</td>
                                    <td>{row.email}</td>
                                    <td class="text-center">0</td>
                                    <td class="text-center">
                                        <Button classList="btn btn-warning py-1 px-2"
                                            onClick={() => goto(`/superadmin/account/teacher/edit/${row.id}`)}>Edit</Button>
                                        <Button classList="btn btn-danger py-1 px-2"
                                            >Hapus</Button>
                                    </td>
                                </tr>
                                {/each}
                                {:else}
                                <tr>
                                    <td colspan="5">Tidak ada data...</td>
                                </tr>
                                {/if}
                                {:else}
                                <tr>
                                    <td colspan="5">Loading...</td>
                                </tr>
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
    <title>Manajemen Akun | Pemateri</title>

    <style>
        
    </style>
</svelte:head>