<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { onMount } from "svelte";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

    import { getFlash } from "$lib/Flash";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";

    import { DataHandler } from "@vincjo/datatables"
    
    import Sidebar from "@components/Sidebar.svelte"
    import Navbar from "@components/Navbar.svelte"
    import Tab from "@components/Tab.svelte"
    import Button from "@components/Button.svelte"
    import Toast from "@components/Toast.svelte";
    import Modal from "@components/Modal.svelte";
    import Spinner from "@components/Spinner.svelte";
    import SortMenu from "@components/SortMenu.svelte";
    import SearchMenu from "@components/SearchMenu.svelte";
    import Pagination from '@components/Pagination.svelte';
	import { getDay } from "$lib/Date";

    let user
    let handler, rows, pageNumber, rowsPerPage = 10, pageCount
    let options = [
        {val: "newest", label:"Terbaru"}, 
        {val: "asc", label: 'A-Z'}, 
        {val: "desc", label: "Z-A"}
    ]

    let articles
    let toastData = null
    let toastVisible = false
    let modalShow = false
    let showSpinner = false

    const getArticles = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "articles/get"
        }).then(response => {
            if(response.status){
                articles = response.data
                handler = new DataHandler(articles, {rowsPerPage})
                rows = handler.getRows()
                pageCount = handler.getPageCount()
                pageNumber = handler.getPageNumber()
                handler.sortDesc('created_at')
            }
        })
    }

    onMount(() => {
        let flashes = getFlash()
        if(flashes){
            toastData = {
                title: flashes.title,
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }
        
        user = checkLogin('Superadmin', true)
        getArticles()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Manajemen Artikel" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Manajemen Artikel" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                <div class="flex-column gap-3">
                    <div class="flex flex-wrap justify-content-between align-items-center gap-4">
                        <div class="flex flex-wrap gap-3 grow-item">
                            <SortMenu options={options} action={(evt) => {
                                let sortBy = evt.target.value

                                if(sortBy == 'newest'){
                                    handler.sortDesc('created_at')
                                }else if(sortBy == 'asc'){
                                    handler.sortAsc('fullname')
                                }else if(sortBy == 'desc'){
                                    handler.sortDesc('fullname')
                                }else{
                                    handler.sort('id')
                                }
                            }}/>

                            <SearchMenu action={(evt) => handler.search(evt.target.value, ['fullname'])}/>
                        </div>
                        <Button type="link" href="/superadmin/article/add" classList="btn btn-main pl-4 grow-item grow-auto-md">
                            <div class="flex align-items-center justify-content-center gap-2">
                                <img src="/icons/plus-lg.svg" alt="plus-icon"/>
                                <div>Tambah Baru</div>
                            </div>
                        </Button>
                    </div>

                    {#if $rows}
                    {#if $rows.length > 0}
                    <div class="row">
                    {#each $rows as article, index (article.id)}
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                        <div class="card radius-sm">
                            <div class="card-body gap-3">
                                <div class="w-100 position-relative">
                                    <img src="{PUBLIC_SERVER_PATH}/storage/{article.thumbnail}" 
                                        class="card-img-fluid" alt="article-thumbnail"
                                        loading="lazy">
                                </div>
                                <div class="flex-column gap-1">
                                    <div class="body-small-medium">{article.title}</div>
                                </div>
                                <Button type="link" href="/superadmin/article/{article.id}" classList="btn btn-main radius-sm">Lihat Detail</Button>
                            </div>
                        </div>
                    </div>
                    {/each}
                    </div>
                    {/if}
                    {/if}
                    
                    {#if handler && $pageCount > 1}
                    <Pagination {handler} />
                    {/if}
                </div>
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Manajemen Acara</title>
</svelte:head>

<style>
    .card-img-fluid {
        aspect-ratio: 4/3;
        border-radius: .25rem;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
</style>