<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	import ApiController from "$lib/ApiController";
	import { extract } from "$lib/Cookie";
    import { getFlash } from "$lib/Flash";

    import Toast from "@components/Toast.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Button from "@components/Button.svelte";
    import InputField from "@components/InputField.svelte";
    import { PlusLg, Hourglass } from "svelte-bootstrap-icons";
    import {DataHandler} from "@vincjo/datatables"
	import checkLogin from "$lib/CheckLogin";

    let user, paths, handler, rows
    
    let option = [
        {value: "newest", text:"Terbaru"}, 
        {value: "asc", text: 'A-Z'}, 
        {value: "desc", text: "Z-A"}
    ]
    
    let sortBy = option[0].value
    let toastData, toastVisible = false

    const getPaths = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: 'learning-path/get'
        }).then(response => {
            if(response.data){
                paths = response.data
                handler = new DataHandler(paths)
                rows = handler.getRows()
                handler.sortDesc('created_at')
            }
        })
    }

    const handleSort = (evt) => {
        sortBy = evt.target.value

        if(sortBy == 'newest'){
            handler.sortDesc('created_at')
        }else if(sortBy == 'asc'){
            handler.sortAsc('title')
        }else if(sortBy == 'desc'){
            handler.sortDesc('title')
        }
    }

    onMount(() => {
        user = checkLogin('Superadmin')
        
        let flashes = getFlash()
        if(flashes){
            toastData = {
                    title: flashes.title,
                    message: flashes.message,
                    color: `toast-${flashes.type}`
                }
            toastVisible = true
        }

        getPaths()
    })
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Alur Belajar" role="Superadmin" />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Bank Kursus" bind:user={user}/>
        <main style="flex-grow: 1;" class="flex-column">
            <div class="container flex-column py-4 gap-8" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}
                <div class="flex flex-wrap justify-content-between align-items-center gap-4">
                    <div class="flex flex-wrap gap-3 grow-item">
                        <InputField type="select-option" id="select-default" 
                            containerClass="grow-item grow-auto-md"   
                            inputClass="input-bg-light pr-8" 
                            onInput={handleSort}
                            value={sortBy} option={option}/>

                        <InputField type="search" id="search" placeholder="Search..." 
                            containerClass="grow-item grow-auto-md"   
                            inputClass="input-bg-light" onInput={(evt) => {
                                handler.search(evt.target.value, ['title'])
                            }}/>
                    </div>
                    <Button type="link" href="/superadmin/learning-path/add" 
                        classList="btn btn-main pl-4 grow-item grow-auto-md">
                        <div class="flex align-items-center justify-content-center gap-2">
                            <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                            <div>Tambah Baru</div>
                        </div>
                    </Button>
                </div>
                {#if !$rows}
                <div class="flex justify-content-center align-items-center h-100">
                    <div class="flex-column align-items-center justify-content-center gap-3">
                        <Hourglass width=60 height=60 color="#3951A8"/>
                        <div class="caption-reguler tc-neutral-disabled">Memuat Data...</div>
                    </div>
                </div>
                {:else}
                {#if $rows.length > 0}
                <div class="row">
                    {#each $rows as path}
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                        <div class="card radius-sm">
                            <div class="card-body gap-3">
                                <div class="w-100">
                                    <img src="http://127.0.0.1:8000/storage/{path.thumbnail}" 
                                        class="card-img-fluid radius-sm" alt="course-thumbnail"
                                        loading="lazy">
                                </div>
                                <div class="flex-column gap-1">
                                    <div class="body-small-medium">{path.title}</div>
                                    <div class="caption-light">{path.courses} Materi</div>
                                </div>
                                <Button type="link" href="/superadmin/learning-path/{path.slug}" classList="btn btn-main radius-sm">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
                {:else}
                <div class="flex justify-content-center align-items-center h-100">
                    <div class="flex-column align-items-center justify-content-center gap-3">
                        <Hourglass width=60 height=60 color="#3951A8"/>
                        <div class="caption-reguler tc-neutral-disabled">Data tidak ditemukan...</div>
                    </div>
                </div>
                {/if}
                {/if}
            </div>
        </main>
    </div>  
</div>

<svelte:head>
    <title>Alur Belajar</title>

    <style>
        .card-img-fluid {
            width: 100%;
            aspect-ratio: 4 / 3;
        }
    </style>
</svelte:head>