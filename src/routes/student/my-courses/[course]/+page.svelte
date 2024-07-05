<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import {onMount} from "svelte"
    import {page} from "$app/stores"

    import checkLogin from "$lib/CheckLogin"
	import ApiController from "$lib/ApiController";
	import formatTime from "$lib/Duration";
    import { getFlash } from "$lib/Flash"

    import Toast from "@components/Toast.svelte";
    import VideoPlayer from "@components/VideoPlayer.svelte";
    import Navbar from "@components/Navbar.svelte"
    import Button from "@components/Button.svelte"
    import Tab from "@components/Tab.svelte"
	import InputField from "@components/InputField.svelte";
    import Spinner from "@components/Spinner.svelte"
    import { Arrow90degLeft, PlayCircle, CheckCircleFill, FileEarmarkText, Pass, Clock, Folder2 } from "svelte-bootstrap-icons"

    const returnNada = () => ''

    let user
    let tabActive = 'Deskripsi'
    
    let haveAccess = false
    let course
    let item_status = false
    let selected_item
    let silabus_status = false
    let silabus = []
    let exam
    let completed_items = []
    let histories = null

    let replyTypeShow = false

    let doneWatching = false
    let showSpinner = false
    let toastData
    let toastVisible = false

    const getItem = (item_id = null, next_item = false, callback = null) => {
        doneWatching = false
        item_status = false
        ApiController.sendRequest({
            method: "POST",
            endpoint: "student/learn",
            data: { course: $page.params.course, item_id, next_item },
            authToken: user.token
        }).then(response => {
            if(response.status){
                course = response.course
                selected_item = response.item
                completed_items = response.completed_items

                if(callback != null && typeof callback === 'function'){
                    callback(course.id)
                }

                item_status = true
                haveAccess = true
            }
        })
    }

    const getSilabus = (course_id) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/${course_id}/items/get`,
        }).then(response => {
            if(response.status){
                silabus_status = true
                silabus = response.data.filter(elm => elm.type != 'Exam')
                exam = response.data.filter(elm => elm.type == 'Exam').pop()
            }
        })
    }

    const nextProgress = () => {
        ApiController.sendRequest({
            method: "POST",
            endpoint: "sudent/progress/update",
            data: { item_id: selected_item.id },
            authToken: user.token
        }).then(response => {
            if(response.status){
                getItem(null, true, null)
            }
        }).catch(e => {
            let error = e.response.data
            console.log(error)
        })
    }

    const getAssessmentHistories = () => {
        if(selected_item && (selected_item.type == 'Exam' || selected_item.type == 'Quiz')){
            histories = null
            ApiController.sendRequest({
                method: "POST",
                endpoint: "student/assessment/history",
                data: { item_id: selected_item.id },
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

        user = checkLogin('Student', true)

        getItem(null, false, getSilabus)
    })
</script>

<Navbar bind:user={user}/>

<section id="learning" class="section">
    <div class="container">
        {#if toastVisible}
            <Toast bind:toastVisible={toastVisible} title={toastData.title} message={toastData.message} color="{toastData.color}"/>
        {/if}
        {#if showSpinner}
            <Spinner/>        
        {/if}
        <div class="flex gap-4">
            <aside>
                <div class="flex-column gap-4 align-items-start">
                    <Button type="link" href="/student/my-courses" classList="btn btn-neutral-outline radius-sm">
                        <div class="flex gap-2 align-items-center">
                            <Arrow90degLeft/>
                            <p class="body-small-reguler">Kembali</p>
                        </div>
                    </Button>
                    <div class="silabus-nav">
                        <p class="body-super-large-semi-bold">Daftar Silabus</p>
                        <ul class="silabus-item-container">
                            {#if silabus_status}
                            {#each silabus as item, index (item.id)}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                            <li class="silabus-item
                                {selected_item.id === item.id ? 'active' : ''}
                                {index <= completed_items.length ? 'unlocked' : 'locked'}
                                "
                                on:click={() => {
                                    if(index <= completed_items.length){
                                        getItem(item.id, false, null)
                                    }
                                }}>
                                <div class="flex gap-2 align-items-center">
                                    {#if item.type == 'Video'}
                                    <PlayCircle width=20 height=20/>
                                    {:else if item.type == 'Quiz'}
                                    <FileEarmarkText width=20 height=20/>
                                    {:else if item.type == 'Exam'}
                                    <Pass width=20 height=20/>
                                    {/if}
                                    <p class="body-medium-reguler">{index + 1}. {item.title}</p>
                                </div>
                                <div class="flex align-items-center justify-content-center">
                                    {#if completed_items.filter(elm => elm.item.id == item.id).pop()}
                                    <CheckCircleFill width=20 height=20 color="#A1E0C5"/>
                                    {/if}
                                </div>
                            </li>
                            {/each}
                            {#if exam}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                            <li class="silabus-item 
                                {selected_item.id === exam.id ? 'active' : ''}
                                {completed_items.length === silabus.length || completed_items.map(elm => elm.item_id).includes(exam.id) ? 'unlocked' : 'locked'}" 
                                on:click={() => {
                                    if(completed_items.length == silabus.length || completed_items.map(elm => elm.item_id).includes(exam.id)){
                                        getItem(exam.id, false, null)
                                    }
                                }}>
                                <div class="flex gap-2 align-items-center">
                                    <Pass width=20 height=20/>
                                    <p class="body-medium-reguler">{silabus.length + 1}. {exam.title}</p>
                                </div>
                                <div class="flex align-items-center justify-content-center">
                                    {#if completed_items.filter(elm => elm.item.id == exam.id).pop()}
                                    <CheckCircleFill width=20 height=20 color="#A1E0C5"/>
                                    {/if}
                                </div>
                            </li> 
                            {/if}
                            {/if}
                        </ul>
                    </div>
                </div>
            </aside>
            <main class="grow-item">
                {#if item_status}
                <div class="flex-column gap-5">
                    {#if selected_item.type === 'Video'}
                    <div class="flex-column gap-3">
                        <VideoPlayer bind:finish={doneWatching}
                            token={user.token} url="{PUBLIC_SERVER_PATH}/api/video/playlist/{selected_item.info.playlist.split('.')[0]}/{selected_item.info.playlist}" />
                        <div class="flex align-items-center justify-content-between">
                            <div class="flex-column align-items-start gap-2">
                                <h4 class="mb-0">{selected_item.title}</h4>
                                <div class="flex gap-2 p-standard radius-sm neutral-border">
                                    <Clock/>
                                    <p class="caption-small-reguler">
                                        {formatTime(selected_item.info.duration)}
                                    </p>
                                </div>
                            </div>
                            <Button disabled={doneWatching || completed_items.map(elm => elm.item_id).includes(selected_item.id) ? false : true} classList="btn btn-main" onClick={nextProgress}>Berikutnya</Button>
                        </div>
                    </div>

                    <div class="flex-column gap-3">
                        <Tab bind:value={tabActive} type="variable" menus={[
                            {value: "Deskripsi", title: "Deskripsi"},
                            {value: "Forum Diskusi", title: "Forum Diskusi"},
                        ]}/>

                        <section id="deskripsi" class="mb-5">
                            {@html selected_item.description}
                        </section>

                        <section id="forum-diskusi">
                            <div class="flex-column gap-5">
                                <div class="flex-column gap-3">
                                    <h5 class="mb-0">Forum Diskusi</h5>
                                    <div class="flex-column gap-2">
                                        <InputField type="tinymce" id="new-discuss" />
                                        <div class="flex justify-content-end gap-2">
                                            <Button classList="btn btn-main-outline">Batal</Button>
                                            <Button classList="btn btn-main">Kirim</Button>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex-column gap-3">
                                    <div class="discuss-container">
                                        <div class="discuss-header">
                                            <div class="flex gap-3">
                                                <img src="/images/default.png" alt="avatar" width="60" height="60" style="border-radius: 100%;">
                                                <div class="flex-column gap-2 align-items-start">
                                                    <p class="body-large-semi-bold">Michael Hernandez</p>
                                                    <div class="neutral-border px-2 py-1 radius-sm">
                                                        <p class="body-small-reguler">Karyawan</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex-column align-items-end">
                                                <p class="caption-reguler tc-neutral-disabled">14.00</p>
                                                <p class="caption-reguler tc-neutral-disabled">27 Aug 2024</p>
                                            </div>
                                        </div>
                                        <div class="discuss-body">
                                            <p>Apakah bisa melakukan perkenalan melalui sosial media? </p>
                                        </div>
                                        <div class="discuss-footer">
                                            {#if !replyTypeShow}
                                            <Button classList="btn btn-no-padding" onClick={() => {
                                                replyTypeShow = true
                                            }}>
                                                <p class="body-small-semi-bold tc-primary-main">
                                                    Beri Tanggapan
                                                </p>
                                            </Button>
                                            {:else}
                                            <div class="flex-column gap-2 w-100">
                                                <InputField type="tinymce" id="reply-discuss"/>
                                                <div class="flex justify-content-end gap-2">
                                                    <Button classList="btn btn-main-outline" onClick={() => {
                                                        replyTypeShow = false
                                                    }}>Batal</Button>
                                                    <Button classList="btn btn-main">Kirim</Button>
                                                </div>
                                            </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {:else if selected_item.type == 'Quiz' || selected_item.type == 'Exam'}
                    <div class="flex align-items-center justify-content-between">
                        <div class="flex-column align-items-start gap-2">
                            <h4 class="mb-0">{selected_item.title}</h4>
                            <div class="flex gap-2 p-standard radius-sm neutral-border">
                                <Folder2/>
                                <p class="caption-small-reguler">
                                    {selected_item.questions.length} Soal
                                </p>
                            </div>
                        </div>
                        {#if !histories}
                        <Button type="link" href="/student/my-courses/{$page.params.course}/assessment/{selected_item.id}" classList="btn btn-main">Mulai {selected_item.type == 'Quiz' ? 'Kuis' : 'Ujian'}</Button>
                        {:else}
                        {#if histories.length == 0}
                        <Button type="link" href="/student/my-courses/{$page.params.course}/assessment/{selected_item.id}" classList="btn btn-main">Mulai {selected_item.type == 'Quiz' ? 'Kuis' : 'Ujian'}</Button>
                        {:else}
                        {#if histories[histories.length-1].is_pass}
                        {#if selected_item.type == 'Quiz'}
                        <Button classList="btn btn-main" onClick={nextProgress}>Berikutnya</Button>
                        {:else if selected_item.type == 'Exam' && completed_items.map(elm => elm.item_id).includes(exam.id)}
                        <Button classList="btn btn-main" onClick={nextProgress}>Beri Umpan Balik</Button>
                        {/if}
                        {:else}
                        <Button type="link" href="/student/my-courses/{$page.params.course}/assessment/{selected_item.id}" classList="btn btn-main">Ulang {selected_item.type == 'Quiz' ? 'Kuis' : 'Ujian'}</Button>
                        {/if}
                        {/if}
                        {/if}
                    </div>

                    <div class="flex-column gap-3">
                        <Tab bind:value={tabActive} type="variable" menus={[
                            {value: "Deskripsi", title: "Deskripsi"},
                            {value: `Riwayat ${selected_item.type == 'Quiz' ? 'Kuis' : 'Ujian'}`, title: `Riwayat ${selected_item.type == 'Quiz' ? 'Kuis' : 'Ujian'}`},
                        ]}/>

                        <section id="deskripsi">
                            {@html selected_item.description}
                        </section>
                    </div>

                    {returnNada(getAssessmentHistories())}
                    <section id="riwayat">
                        <div class="flex-column gap-3">
                            <h5 class="mb-0">Riwayat {selected_item.type == 'Quiz' ? 'Kuis' : 'Ujian'}</h5>
                            <div class="table-scroll radius-sm">
                                <table class="table number">
                                    <thead>
                                        <tr>
                                            <th class="text-center">No</th>
                                            <th>Tanggal {selected_item.type == 'Quiz' ? 'Kuis' : 'Ujian'}</th>
                                            <th class="text-center">Total Skor</th>
                                            <th class="text-center">Status</th>
                                            <th class="text-center">Riwayat</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-border-bottom">
                                        {#if histories}
                                        {#if histories.length > 0}
                                        {#each histories as history, index (history.id)}
                                        <tr>
                                            <td class="text-center">{index + 1}</td>
                                            <td>Senin, 24 Feb 2024</td>
                                            <td class="text-center">{ history.score }</td>
                                            <td class="text-center">
                                                <div class="flex align-items-center justify-content-center">
                                                    {#if history.is_pass}
                                                    <Button classList="btn btn-success py-2 px-3">Lulus</Button>
                                                    {:else}
                                                    <Button classList="btn btn-danger py-2 px-3">Gagal</Button>
                                                    {/if}
                                                </div>
                                            </td>
                                            <td class="text-center">
                                                {#if history.is_pass}
                                                <Button type="link" href="/student/my-courses/{$page.params.course}/assessment/{selected_item.id}/history/{history.id}" classList="link tc-primary-main">Lihat Riwayat</Button>
                                                {/if}
                                            </td>
                                        </tr>
                                        {/each}
                                        {:else}
                                        <tr>
                                            <td colspan="5">Belum ada riwayat</td>
                                        </tr>
                                        {/if}
                                        {:else}
                                        <tr>
                                            <td colspan="5">Memuat data...</td>
                                        </tr>
                                        {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                    {/if}
                </div>
                {/if}
            </main>
        </div>
    </div>
</section>

<style>
    aside {
        height: fit-content;
		position: sticky;
		position: -webkit-sticky;
		top: 104px;
    }

    .silabus-nav {
        display: flex;
        flex-direction: column;
        padding: .875rem;
        gap: 1.5rem;
        border-radius: .25rem;
        border: 1px solid var(--neutral-border);
        background-color: var(--neutral-white);
    }

    .silabus-item-container {
        min-width: 18rem;
        max-width: 20rem;
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: .875rem;
    }

    .silabus-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: .875rem;
        border-radius: .25rem;
        transition: all 0.25s ease;
    }

    .silabus-item:not(.disabled):hover {
        background-color: var(--hover);
        padding: 1.25rem 0.875rem;
        color: var(--dark);
    }

    .active {
        border: none !important;
        background-color: var(--primary-main) !important;
        color: var(--neutral-white) !important;
        padding: 1.25rem 0.875rem !important;
        cursor: pointer;
    }

    .unlocked {
        background-color: var(--neutral-white);
        border: 1px solid var(--neutral-border);
        cursor: pointer;
    }

    .locked { 
        background-color: var(--neutral-surface);
        color: var(--neutral-disabled);
        cursor: not-allowed;
    }

    .discuss-container { 
        padding: .875rem;
        display: flex;
        flex-direction: column;
        gap: .875rem;
        border-radius: .25rem;
        border: 1px solid var(--neutral-border); 
    }

    .discuss-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .discuss-body {
        display: flex;
        flex-direction: column;
    }

    .discuss-footer {
        display: flex;
    }
</style>