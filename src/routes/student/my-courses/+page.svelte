<script>
    import { onMount } from "svelte";
	import checkLogin from "$lib/CheckLogin";
    import Navbar from "@components/Navbar.svelte";
    import StudentSidebar from "@components/StudentSidebar.svelte";
	import Tab from "@components/Tab.svelte";
    import Button from "@components/Button.svelte";

    let user, active = "Semua Materi"

    onMount(() => {
        user = checkLogin('Student', true)
    })

</script>

<Navbar/>

{#if user}
<section class="section" id="my-courses">
    <div class="container">
        <div class="flex gap-4">
            <StudentSidebar bind:user={user}/>
            <main class="w-100">
                <div class="container">
                    <div class="flex-column gap-standard">
                        <h4>Kursus Saya</h4>
                        
                        <Tab bind:value={active} type="variable" menus={[
                            { value: "Semua Materi", title: "Semua Materi" },
                            { value: "Selesai", title: "Selesai" }
                        ]}/>

                        <div class="row">
                            <div class="col-xs-12 col-sm-6 col-md-3 mb-4">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="/images/building-trust-image.png" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium label-bullet">Sales Marketing</p>
                                            <p class="body-small-medium">Building Trust</p>
                                            <div class="flex justify-content-between align-items-center"> 
                                                <p class="caption-small-reguler">Rp. 150.000</p>
                                                <p class="caption-small-reguler">20 Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/courses/1" classList="btn btn-main">Lihat Detail</Button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-3">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="/images/building-trust-image.png" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium label-bullet">Sales Marketing</p>
                                            <p class="body-small-medium">Building Trust</p>
                                            <div class="flex justify-content-between align-items-center"> 
                                                <p class="caption-small-reguler">Rp. 150.000</p>
                                                <p class="caption-small-reguler">20 Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/courses/1" classList="btn btn-main">Lihat Detail</Button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-3">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="/images/building-trust-image.png" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium label-bullet">Sales Marketing</p>
                                            <p class="body-small-medium">Building Trust</p>
                                            <div class="flex justify-content-between align-items-center"> 
                                                <p class="caption-small-reguler">Rp. 150.000</p>
                                                <p class="caption-small-reguler">20 Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/courses/1" classList="btn btn-main">Lihat Detail</Button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-3">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="/images/building-trust-image.png" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium label-bullet">Sales Marketing</p>
                                            <p class="body-small-medium">Building Trust</p>
                                            <div class="flex justify-content-between align-items-center"> 
                                                <p class="caption-small-reguler">Rp. 150.000</p>
                                                <p class="caption-small-reguler">20 Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/courses/1" classList="btn btn-main">Lihat Detail</Button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-3">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="/images/building-trust-image.png" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium label-bullet">Sales Marketing</p>
                                            <p class="body-small-medium">Building Trust</p>
                                            <div class="flex justify-content-between align-items-center"> 
                                                <p class="caption-small-reguler">Rp. 150.000</p>
                                                <p class="caption-small-reguler">20 Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/courses/1" classList="btn btn-main">Lihat Detail</Button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-3">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="/images/building-trust-image.png" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium label-bullet">Sales Marketing</p>
                                            <p class="body-small-medium">Building Trust</p>
                                            <div class="flex justify-content-between align-items-center"> 
                                                <p class="caption-small-reguler">Rp. 150.000</p>
                                                <p class="caption-small-reguler">20 Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/courses/1" classList="btn btn-main">Lihat Detail</Button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xs-12 col-sm-6 col-md-3">
                                <div class="card neutral-border radius-sm">
                                    <div class="card-body gap-3">
                                        <img src="/images/building-trust-image.png" class="radius-sm" alt="gambar courses" />
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium label-bullet">Sales Marketing</p>
                                            <p class="body-small-medium">Building Trust</p>
                                            <div class="flex justify-content-between align-items-center"> 
                                                <p class="caption-small-reguler">Rp. 150.000</p>
                                                <p class="caption-small-reguler">20 Item</p>                         
                                            </div>                          
                                        </div>
                                        <Button type="link" href="/courses/1" classList="btn btn-main">Lihat Detail</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</section>
{/if}