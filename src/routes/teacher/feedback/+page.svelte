<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Button from "@components/Button.svelte";
	import Navbar from "@components/Navbar.svelte";
	import Sidebar from "@components/Sidebar.svelte";
	import Toast from "@components/Toast.svelte";
	import { onMount } from "svelte";
	import { Hourglass } from "svelte-bootstrap-icons";

    let user
    let courses

    let toastData
    let toastVisible = false

    const getCourses = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "course/get",
            authToken: user.token
        }).then(response => {
            courses = response.data.my_courses
            console.log(courses)
        }).catch(e => {
            console.error(e)
        })
    }

    onMount(() => {
        user = checkLogin("Teacher", true)

        getCourses()
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

                {#if !courses}
                <div class="flex justify-content-center align-items-center h-100">
                    <div class="flex-column align-items-center justify-content-center gap-3">
                        <Hourglass width=60 height=60 color="#3951A8"/>
                        <div class="caption-reguler tc-neutral-disabled">Memuat Data...</div>
                    </div>
                </div>
                {:else}
                {#if courses.length > 0}
                <div class="row">
                    {#each courses as course, index (course.id)}
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                        <div class="card radius-sm">
                            <div class="card-body">
                                <div class="w-100 position-relative">
                                    <img src="{PUBLIC_SERVER_PATH}/storage/{course.thumbnail}" 
                                        class="card-img-fluid radius-sm" alt="course-thumbnail"
                                        loading="lazy">
                                </div>
                                {#if course.learning_path}
                                <p class="label-bullet body-small-medium" style="color: {course.learning_path.color};">{course.learning_path.title}</p>
                                {:else}
                                <p class="label-bullet body-small-medium">Belum ada alur belajar</p>
                                {/if}
                                <div class="flex-column gap-1">
                                    <div class="body-small-medium">{course.title}</div>
                                </div>
                                <Button type="link" href="/teacher/feedback/{course.id}" classList="btn btn-main radius-sm">Lihat Umpan Balik</Button>
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
    <title>Umpan Balik</title>
</svelte:head>

<style>
    .card-img-fluid {
        object-fit: cover;
        object-position: center;
        aspect-ratio: 4/3;
    }
</style>