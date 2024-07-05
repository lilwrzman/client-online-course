<script>
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Button from "@components/Button.svelte";
	import Navbar from "@components/Navbar.svelte";
	import ProgressBar from "@components/ProgressBar.svelte";
	import StudentSidebar from "@components/StudentSidebar.svelte";
	import Toast from "@components/Toast.svelte";
	import { onMount } from "svelte";

    let user 
    let toastData
    let toastVisible = false
    let progress

    const getProgress = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "sudent/progress",
            authToken: user.token
        }).then(response => {
            if(response.status){
                progress = response.data
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    onMount(() => {
        user = checkLogin("Student", true)

        getProgress()
    })
</script>

<Navbar bind:user={user} />

<section id="progress" class="section">
    <div class="container">
        {#if toastVisible}
            <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
        {/if}
        <div class="flex gap-4">
            <StudentSidebar bind:user={user} active="Progres Belajar" />
            <main class="w-100">
                <div class="container {progress ? progress.length == 0 ? 'h-100' : '' : ''}">
                    <div class="flex-column gap-4 {progress ? progress.length == 0 ? 'h-100' : '' : ''}">
                        <h4 class="mb-0">Progres Belajar</h4>
                        <div class="flex-column gap-3 {progress ? progress.length == 0 ? 'h-100' : '' : ''}">
                        {#if progress}
                        {#if progress.length > 0}
                        {#each progress as p (p.id)}
                        <div class="card radius-sm neutral-border p-standard">
                            <div class="row justify-content-between">
                                <div class="col-12 col-md-5 py-2">
                                    <div class="flex-column gap-2">
                                        <p class="mb-0 body-small-medium">{p.course.title}</p>
                                        <p class="mb-0 caption-light">Telah menyelesaikan {p.completed_items} dari {p.total_items} item</p>
                                    </div>
                                </div>
                                <div class="col-12 col-md-5">
                                    <div class="flex-column h-100 justify-content-center">
                                        <ProgressBar percentage={(p.completed_items / p.total_items) * 100}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/each}
                        {:else}
                        <div class="flex-column h-100 gap-3 align-items-center justify-content-center">
                            Anda belum memiliki materi.
                            <Button type="link" href="/courses" classList="btn btn-main">Jelajahi Materi</Button>
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
    <title>Progres Belajar</title>
</svelte:head>