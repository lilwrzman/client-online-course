<script>
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation"

    import ApiController from '$lib/ApiController.js';
    import { extract } from "$lib/Cookie.js"
    
    import Navbar from '@components/Navbar.svelte'
    import Button from "@components/Button.svelte";
    import PlusLg from "svelte-bootstrap-icons/lib/PlusLg.svelte"
    import Trash from "svelte-bootstrap-icons/lib/Trash.svelte"
    import Pencil from "svelte-bootstrap-icons/lib/Pencil.svelte"
    import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'

    let user, handler, rows

    const getStudent = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "account/get?role=Student",
            authToken: user.token
        }).then(response => {
            if(response.status){
                handler = new DataHandler(response.data, { rowsPerPage: 10 })
                rows = handler.getRows()
            }
        })
    }

    const rowClickHandler = (id) => {
        goto(`/superadmin/account/student/${id}`)
    }

    const editData = (evt, id) => {
        evt.stopPropagation()
        goto(`/superadmin/account/student/edit/${id}`)
    }

    const deleteData = (evt, id) => {
        evt.stopPropagation()
        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/delete",
            data: {id},
            authToken: user.token
        }).then(response => {
            if(response.status){
                console.log(response.message)
                getStudent()
            }
        })
    }

    onMount(() => {
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
        }

        getStudent()
    })
</script>

<div class="flex">
    <aside class="w-50">
        sidebar
    </aside>
    <div class="flex-column w-100">
        <Navbar active="" variant="inside"/>
        <main>
            <div class="container">
                content
                <Button type="link" href="/superadmin/account/student/add" classList="btn btn-main pl-3">
                    <div class="flex gap-2 align-items-center">
                        <PlusLg/>
                        Tambah
                    </div>
                </Button>
                <br>
                {#if handler}
                <Datatable {handler}>
                    <table>
                        <thead>
                            <tr>
                                <Th {handler} orderBy="fullname">Fullname</Th>
                                <Th {handler} orderBy="username">Username</Th>
                                <Th {handler} orderBy="email">Email</Th>
                                <Th {handler} orderBy="status">Status</Th>
                                <Th {handler}>Action</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each $rows as row}
                                <tr on:click={() => rowClickHandler(row.id)}>
                                    <td>{row.fullname}</td>
                                    <td>{row.username}</td>
                                    <td>{row.email}</td>
                                    <td>{row.status}</td>
                                    <td>
                                        <Button id="btn-edit" classList="btn p-1 btn-warning" onClick={(evt) => editData(evt, row.id)}>
                                            <div class="flex justify-content-center align-items-center">
                                                <Pencil/>
                                            </div>
                                        </Button>
                                        <Button id="btn-delete" classList="btn p-1 btn-danger" onClick={(evt) => deleteData(evt, row.id)}>
                                            <div class="flex justify-content-center align-items-center">
                                                <Trash/>
                                            </div>
                                        </Button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </Datatable>
                {:else}
                <p>Loading...</p>
                {/if}
            </div>
        </main>
    </div>
</div>

<style>
    thead {
        background: #fff;
    }
    tbody td {
        border: 1px solid #f5f5f5;
        padding: 4px 20px;
    }
    tbody tr {
        transition: all, 0.2s;
        cursor: pointer;
    }
    tbody tr:hover {
        background: #f5f5f5;
    }
</style>