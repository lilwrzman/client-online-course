<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { onMount } from "svelte";
	
    import checkLogin from "$lib/CheckLogin";
    import ApiController from "$lib/ApiController"
    
    import Navbar from "@components/Navbar.svelte";
    import StudentSidebar from "@components/StudentSidebar.svelte";
	import Tab from "@components/Tab.svelte";
    import Button from "@components/Button.svelte";

    let user, active = "Semua Materi"
    let status = false
    let myCourses = []
    let completedCourses = []

    const getMyCourses = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "my-courses",
            authToken: user.token
        }).then(response => {
            myCourses = response.data
            completedCourses = myCourses.filter(elm => elm.status == 'Completed')

            status = true
        })
    }

    onMount(() => {
        user = checkLogin('Student', true)

        getMyCourses()
    })

</script>

<Navbar/>

{#if user}
<section class="section" id="my-courses">
    <div class="container">
        <div class="flex gap-4">
            <StudentSidebar bind:user={user}/>
            <main class="w-100">
                <div class="container {(active == 'Semua Materi' && myCourses.length == 0) || (active == 'Selesai' && completedCourses.length == 0) ? 'h-100' : ''}">
                    <div class="flex-column gap-standard {(active == 'Semua Materi' && myCourses.length == 0) || (active == 'Selesai' && completedCourses.length == 0) ? 'h-100' : ''}">
                        <h4>Kursus Saya</h4>
                        
                        <Tab bind:value={active} type="variable" menus={[
                            { value: "Semua Materi", title: "Semua Materi" },
                            { value: "Selesai", title: "Selesai" }
                        ]}/>

                        {#if active == 'Semua Materi'}
                        <div class="row {myCourses.length == 0 ? 'h-100' : ''}">
                            {#if myCourses.length > 0}
                            {#each myCourses as access}
                            <div class="col-xs-12 col-sm-6 col-md-3 mb-4">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="{PUBLIC_SERVER_PATH}/storage/{access.course.thumbnail}" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            {#if access.course.learning_path.id}
                                            <p class="body-small-medium label-bullet" style="color: {access.course.learning_path.color};">{access.course.learning_path.title}</p>
                                            {:else}
                                            <p class="body-small-medium label-bullet">Belum ada Alur Belajar</p>
                                            {/if}
                                            <p class="body-small-medium">{access.course.title}</p>
                                            <div class="flex justify-content-between align-items-center">
                                                <p class="caption-small-reguler">0/{access.course.items.length} Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/student/my-courses/1" classList="btn btn-main">Mulai Belajar</Button>
                                    </div>
                                </div>
                            </div>
                            {/each}
                            {:else} 
                            <div class="flex-column gap-2 grow-item align-items-center justify-content-center h-100">
                                <p class="body-small-reguler">Anda belum memiliki materi!</p>
                                <Button type="link" href="/courses" classList="btn btn-main">Jelajahi Materi</Button>
                            </div>  
                            {/if}
                        </div>
                        {:else if active == 'Selesai'}
                        <div class="row {completedCourses.length == 0 ? 'h-100' : ''}">
                            {#if completedCourses.length > 0}
                            {#each completedCourses as access}
                            <div class="col-xs-12 col-sm-6 col-md-3 mb-4">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="{PUBLIC_SERVER_PATH}/storage/{access.course.thumbnail}" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            {#if access.course.learning_path.id}
                                            <p class="body-small-medium label-bullet" style="color: {access.course.learning_path.color};">{access.course.learning_path.title}</p>
                                            {:else}
                                            <p class="body-small-medium label-bullet">Belum ada Alur Belajar</p>
                                            {/if}
                                            <p class="body-small-medium">{access.course.title}</p>
                                            <div class="flex justify-content-between align-items-center">
                                                <p class="caption-small-reguler">0/{access.course.items.length} Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/student/my-courses/1" classList="btn btn-main">Mulai Belajar</Button>
                                    </div>
                                </div>
                            </div>
                            {/each}
                            {:else} 
                            <div class="flex-column gap-2 grow-item align-items-center justify-content-center h-100">
                                <p class="body-small-reguler">Belum ada materi yang selesai!</p>
                                <Button classList="btn btn-main" onClick={() => active = 'Semua Materi'}>Kembali Belajar</Button>
                            </div>
                            {/if}
                        </div>
                        {/if}
                    </div>
                </div>
            </main>
        </div>
    </div>
</section>
{/if}

<svelte:head>
    <title>Kursus Saya</title>
</svelte:head>