<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import Navbar from "@components/Navbar.svelte";
    import Button from "@components/Button.svelte";
    import Footer from "@components/Footer.svelte";
	import { onMount } from "svelte";
	import ApiController from "$lib/ApiController";
	import { DataHandler } from "@vincjo/datatables";

    let articles, handler, rows, pageCount, pageNumber, rowsPerPage = 10

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
        getArticles()
    })
</script>

<Navbar active="artikel"/>

<main class="mb-6">
    <section id="articles" class="section">
        <div class="container">
            <div class="flex-column gap-3">
                <div class="d-flex justify-content-center align-items-center">
                    <h4>Artikel</h4>
                </div>

                {#if $rows}
                <div class="row">
                    {#if $rows.length > 0}
                    {#each $rows as article, index (article.id)}
                    <div class="col-xs-12 col-sm-6 col-md-3 mb-5">
                        <div class="card">
                            <div class="card-body gap-3">
                                <img src="{PUBLIC_SERVER_PATH}/storage/{article.thumbnail}" alt="gambar artikel" class="thumbnail" />
                                <div class="flex-column gap-2">
                                    <p class="body-small-medium">{article.title}</p>
                                    <p class="caption-small-reguler">{article.author.username}</p>
                                </div>
                                <Button type="link" href="/articles/{article.id}" classList="btn btn-main">Baca Artikel</Button>
                            </div>
                        </div>
                    </div>
                    {/each}
                    {:else}
                    <div class="flex justify-content-center align-items-center">
                        Belum ada data artikel.
                    </div>
                    {/if}
                </div>
                {:else}
                <div class="flex justify-content-center align-items-center">
                    Memuat Data...
                </div>
                {/if}
            </div>
        </div>
    </section>
</main>

<Footer/>

<svelte:head>
    <title>Artikel</title>
</svelte:head>

<style>
    .thumbnail {
        aspect-ratio: 4 / 3;
        width: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: .25rem;
    }
</style>