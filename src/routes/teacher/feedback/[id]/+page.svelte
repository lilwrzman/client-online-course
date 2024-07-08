<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Button from "@components/Button.svelte";
	import Navbar from "@components/Navbar.svelte";
	import Sidebar from "@components/Sidebar.svelte";
	import Toast from "@components/Toast.svelte";
	import { onMount } from "svelte";
	import { Hourglass, StarFill } from "svelte-bootstrap-icons";
    import { page } from "$app/stores";

    let user
    let course

    let toastData
    let toastVisible = false

    const getFeedbacks = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/${$page.params.id}/feedback`
        }).then(response => {
            course = response.data
        }).catch(e => {
            console.error(e)
        })
    }

    onMount(() => {
        user = checkLogin("Teacher", true)

        getFeedbacks()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar active="Umpan Balik" role="Teacher" bind:isSidebarOpen={isSidebarOpen}/>
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Umpan Balik" bind:user={user} bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                <div class="flex gap-2">
                    <a href="/teacher/feedback" class="body-medium-semi-bold tc-neutral-disabled">Umpan Balik</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/teacher/feedback/{$page.params.id}" class="body-medium-semi-bold tc-primary-main">{ course ? course.title : '' }</a>
                </div>

                {#if !course}
                <div class="flex justify-content-center align-items-center h-100">
                    <div class="flex-column align-items-center justify-content-center gap-3">
                        <Hourglass width=60 height=60 color="#3951A8"/>
                        <div class="caption-reguler tc-neutral-disabled">Memuat Data...</div>
                    </div>
                </div>
                {:else}
                {#if course.feedbacks.length > 0}
                <div class="row">
                    {#each course.feedbacks as feedback, index (feedback.id)}
                    <div class="col-12 col-md-4">
                        <div class="flex gap-3 bg-neutral-white neutral-border radius-sm p-standard">
                            <img src="{PUBLIC_SERVER_PATH}/storage/{feedback.user.avatar}" class="radius-sm" alt="avatar" width="80" height="80">
                            <div class="flex-column w-100 gap-1">
                                <div class="flex align-items-center justify-content-between">
                                    <p class="body-small-semi-bold mb-0">{feedback.user.info.fullname}</p>
                                    <div class="flex gap-1 align-items-center">
                                        <p class="caption-reguler mb-0">{feedback.rating}</p>
                                        <StarFill color="#FF9933" width=12 height=12 />
                                    </div>
                                </div>
                                <p class="caption-light mb-0">{feedback.review}</p>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>
                {:else}
                <div class="flex justify-content-center align-items-center h-100">
                    <div class="flex-column align-items-center justify-content-center gap-3">
                        <Hourglass width=60 height=60 color="#3951A8"/>
                        <div class="caption-reguler tc-neutral-disabled">Belum ada umpan balik untuk materi ini</div>
                    </div>
                </div>
                {/if}
                {/if}
            </div> 
        </main>
    </div>  
</div>

<svelte:head>
    <title>Umpan Balik</title>
</svelte:head>