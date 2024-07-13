<script>
	import { onMount } from "svelte";
	
    import checkLogin from "$lib/CheckLogin";
	import { getFlash } from "$lib/Flash";
	import { getDay, getCurrentTime } from "$lib/Date";
    import ApiController from "$lib/ApiController"

    import Toast from "@components/Toast.svelte";
    import Navbar from "@components/Navbar.svelte";
    import StudentSidebar from "@components/StudentSidebar.svelte";
    import Button from "@components/Button.svelte"
	import { PlayCircle, FileEarmarkText, Pass } from "svelte-bootstrap-icons";

    let user
    let toastData
    let toastVisible = false
    let histories

    const getHitories = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "transaction/histories",
            authToken: user.token
        }).then(response => {
            if(response.status){
                histories = response.data
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
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

        user = checkLogin("Student", true)

        getHitories()
    })
</script>

<Navbar  />

<section id="transaction" class="section">
    <div class="container">
        {#if toastVisible}
            <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
        {/if}
        <div class="flex gap-4">
            <StudentSidebar bind:user={user} active="Riwayat Transaksi" />
            <main class="w-100">
                <div class="container {histories ? histories.length == 0 ? 'h-100' : '' : ''}">
                    <div class="flex-column gap-4 {histories ? histories.length == 0 ? 'h-100' : '' : ''}">
                        <h4 class="mb-0">Riwayat Transaksi</h4>
                        <div class="flex-column gap-3 {histories ? histories.length == 0 ? 'h-100' : '' : ''}">
                            {#if histories}
                            {#if histories.length > 0}
                            {#each histories as history}
                            <div class="card p-standard neutral-border radius-sm">
                                <div class="card-body gap-standard">
                                    <div class="flex align-items-center gap-3">
                                        {#if history.status == 'success'}
                                        <div class="badge badge-success">SUKSES</div>
                                        {:else}
                                        <div class="badge badge-danger">GAGAL</div>
                                        {/if}
                                        <p class="body-small-reguler">{getDay(history.created_at)} | {getCurrentTime(history.created_at)}</p>
                                        <p class="body-small-reguler">ID Transaksi: #{history.id}</p>
                                    </div>
                                    <div class="flex align-items-center justify-content-between flex-wrap">
                                        <div class="row">
                                            <div class="col-12 col-md-4">
                                                <div class="flex align-items-center justify-content-center">
                                                    <img src="/images/building-trust-courses-image.png" alt="thumbnail" class="thumbnail">
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-8">
                                                <div class="h-100 flex-column align-items-start justify-content-center gap-3">
                                                    <p class="body-large-semi-bold mb-0">{history.course.title}</p>
                                                    <div class="flex gap-3">
                                                        {#if history.course.items.filter(elm => elm.type == 'Video').length > 0}
                                                        <div class="flex align-items-center gap-2 p-2 neutral-border radius-sm">
                                                            <PlayCircle/>
                                                            <p class="caption-small-reguler my-0">{history.course.items.filter(elm => elm.type == 'Video').length} Video</p>
                                                        </div>
                                                        {/if}
                                                        {#if history.course.items.filter(elm => elm.type == 'Quiz').length > 0}
                                                        <div class="flex align-items-center gap-2 p-2 neutral-border radius-sm">
                                                            <FileEarmarkText/>
                                                            <p class="caption-small-reguler my-0">{history.course.items.filter(elm => elm.type == 'Quiz').length} Kuis</p>
                                                        </div>
                                                        {/if}
                                                        {#if history.course.items.filter(elm => elm.type == 'Exam').length > 0}
                                                        <div class="flex align-items-center gap-2 p-2 neutral-border radius-sm">
                                                            <Pass/>
                                                            <p class="caption-small-reguler my-0">{history.course.items.filter(elm => elm.type == 'Exam').length} Ujian</p>
                                                        </div>
                                                        {/if}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-column gap-2 align-items-end">
                                            <p class="body-small-reguler tc-neutral-disabled">Harga Materi</p>
                                            <p class="body-medium-semi-bold">{history.course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/each}
                            {:else}
                            <div class="flex-column h-100 gap-3 align-items-center justify-content-center">
                                Anda belum melakukan transaksi apapun.
                                <Button classList="btn btn-main">Jelajahi Materi</Button>
                            </div>
                            {/if}
                            {/if}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</section>

<svelte:head>
    <title>Riwayat Transaksi</title>
</svelte:head>

<style>
    .badge {
        padding: .5rem;
        border-radius: .25rem;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        text-align: center;
    }

    .badge-success {
        background-color: var(--success-focus);
        color: var(--success-main);
    }

    .badge-danger {
        background-color: var(--danger-focus);
        color: var(--danger-main);
    }

    .thumbnail {
        border-radius: .25rem;
        aspect-ratio: 4 / 3;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
</style>