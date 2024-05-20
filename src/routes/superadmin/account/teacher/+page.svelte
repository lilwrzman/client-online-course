<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation"

    import { extract } from "$lib/Cookie"

    import Sidebar from "@components/Sidebar.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Tab from "@components/Tab.svelte"
    import Button from "@components/Button.svelte"
    import InputField from "@components/InputField.svelte"
    import Table from "@components/Table.svelte"
    import { PlusLg } from "svelte-bootstrap-icons"
    import {DataHandler} from "@vincjo/datatables"
	import ApiController from "$lib/ApiController";

    let user
    let handler, rows, handleSort
    let sortBy, option = [
        {value: "newest", text:"Terbaru"}, 
        {value: "asc", text: 'A-Z'}, 
        {value: "desc", text: "Z-A"}
    ]
    sortBy = option[0].value

    let teachers, status = false

    const getTeachers = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "account/get?role=Teacher",
            authToken: user.token
        }).then(response => {
            console.log(response)
            teachers = response.data
            status = true
        })
    }

    onMount(() => {
        user = extract('datas')

        if(!user){
            goto('/superadmin/login')
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
                                inputClass="input-bg-light neutral-border"/>
                        </div>
                        <Button type="link" href="/superadmin/course/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                            <div class="flex align-items-center justify-content-center gap-2">
                                <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                                <div>Tambah Baru</div>
                            </div>
                        </Button>
                    </div>

                    {#if status}
                    <Table bind:rows={teachers}/>
                    {/if}
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Manajemen Akun</title>

    <style>
        
    </style>
</svelte:head>