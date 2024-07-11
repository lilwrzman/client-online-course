<script>
	import { page } from "$app/stores";
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import ApiController from "$lib/ApiController";
	import { getDay } from "$lib/Date";
	import Button from "@components/Button.svelte";
	import Footer from "@components/Footer.svelte";
	import Navbar from "@components/Navbar.svelte";
	import { onMount } from "svelte";
	import { Arrow90degLeft } from "svelte-bootstrap-icons";

    let id = $page.params.id
    let detail

    const getDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `article/get/${id}`
        }).then(response => {
            if(response.status){
                detail = response.data
            }
        })
    } 

    onMount(() => {
        getDetail()
    })
</script>

<Navbar active="artikel"/>

<main>
    <section id="artikel" class="section">
        <div class="container">
            {#if detail}
            <div class="row justify-content-center">
                <div class="col-12 col-md-8">
                    <div class="flex-column gap-4">
                        <div>
                            <Button type="link" href="/articles" classList="btn btn-neutral-outline radius-sm">
                                <div class="flex gap-2 align-items-center">
                                    <Arrow90degLeft/>
                                    Kembali
                                </div>
                            </Button>
                        </div>
                        <div class="flex-column gap-3">
                            <img src="{PUBLIC_SERVER_PATH}/storage/{detail.thumbnail}" alt="thumbnail" class="thumbnail">
                            <div class="flex-column gap-1">
                                <p class="body-small-reguler mb-0">Ditulis oleh: {detail.author.username}</p>
                                <p class="body-small-reguler mb-0">Dipublikasikan pada: {getDay(detail.created_at)}</p>
                            </div>
                        </div>
                        <h4>{detail.title}</h4>
                        {@html detail.content}
                    </div>
                </div>
            </div>
            {/if}
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