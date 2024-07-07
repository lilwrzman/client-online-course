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
    import { Arrow90degLeft, PlayCircle, CheckCircleFill, FileEarmarkText, Pass, Clock, Folder2, ChevronBarDown, ChevronUp, ChevronDown, StarFill } from "svelte-bootstrap-icons"
	import Modal from "@components/Modal.svelte";

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

    let silabusOpen = true
    let feedbackOpen = false
    let cetificateOpen = false

    let courseFeedback
    let myFeedback
    let rating = 0
    let review = ''

    let modalShow = false


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

    const getCourseFeedback = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/${$page.params.course}/feedback`,
        }).then(response => {
            if(response.status){
                courseFeedback = response.data

                if(myFeedback){
                    courseFeedback = courseFeedback.filter(elm => elm.id != myFeedback.id)
                }
            }
        }).catch(e => {
            console.error(e)
        })
    }

    const getFeedback = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/${$page.params.course}/student/feedback`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                myFeedback = response.data
                getCourseFeedback()
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    const postFeedback = () => {
        if(rating == 0){
            return alert('Mohon berikan rating, setidaknya 1!')
        }

        if(!review){
            return alert('Mohon berikan ulasan anda mengenai materi ini!')
        }

        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "course/feedback/post",
            data: {
                course_id: $page.params.course,
                rating, review
            },
            authToken: user.token
        }).then(response => {
            if(response.status){
                getFeedback()
                toastData = {
                    title: "Berhasil",
                    message: response.message,
                    color: 'toast-success'
                }

                modalShow = false
                toastVisible = true
                showSpinner = false
            }
        }).catch(e => {
            let error = e.response.data

            showSpinner = false
            modalShow = false

            if(error.error){
                if(error.error == 'Anda telah memberikan umpan balik.'){
                    toastData = {
                        title: "Oops",
                        message: error.error,
                        color: 'toast-warning'
                    }
                }else if(error.error == 'Gagal menambahkan umpan balik!'){
                    toastData = {
                        title: "Gagal",
                        message: error.error,
                        color: 'toast-danger'
                    }
                }

                toastVisible = true
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

        user = checkLogin('Student', true)

        getItem(null, false, getSilabus)
        getFeedback()
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
                    <div class="flex-column gap-2 w-100">
                        <div class="silabus-nav">
                            <div class="flex align-items-center justify-content-between gap-4">
                                <p class="body-super-large-semi-bold">Daftar Silabus</p>
                                <Button classList="btn btn-no-padding" onClick={() => silabusOpen = !silabusOpen}>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if silabusOpen}
                                        <ChevronUp/>
                                        {:else}
                                        <ChevronDown/>
                                        {/if}
                                    </div>
                                </Button>
                            </div>
                            {#if silabusOpen}
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
                                        <p class="body-small-reguler">{index + 1}. {item.title}</p>
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
                                        <p class="body-small-reguler">{silabus.length + 1}. {exam.title}</p>
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
                            {/if}
                        </div>
                        {#if completed_items.length == silabus.length + 1}
                        <div class="feedback-nav">
                            <div class="flex align-items-center justify-content-between gap-4">
                                <p class="body-super-large-semi-bold">Umpan Balik</p>
                                <Button classList="btn btn-no-padding" onClick={() => {
                                    feedbackOpen = !feedbackOpen
    
                                    if(feedbackOpen){
                                        silabusOpen = false
                                    }
                                }}>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if feedbackOpen}
                                        <ChevronUp/>
                                        {:else}
                                        <ChevronDown/>
                                        {/if}
                                    </div>
                                </Button>
                            </div>
                            {#if feedbackOpen}
    
                            <div class="flex-column gap-3 pb-2 neutral-border-bottom w-100">
                                {#if !myFeedback}
                                <Button classList="btn btn-main-outline" onClick={() => modalShow = true}>Beri Umpan Balik</Button>
                                {:else}
                                <div class="flex align-items-center justify-content-evenly">
                                    {#each Array.from({length: myFeedback.rating}, (_,i) => i) as i}
                                    <StarFill width=32 height=32 color="#3951A8"/>
                                    {/each}
                                    {#each Array.from({length: 5 - myFeedback.rating}, (_,i) => i) as i}
                                    <StarFill width=32 height=32 color="#E6EBF7"/>
                                    {/each}
                                </div>
                                <p class="body-small-reguler mb-0">{myFeedback.review}</p>
                                {/if}
                            </div>
                            
                            {#if courseFeedback}
                            <ul class="feedback-item-container">
                            {#if courseFeedback.length > 0}
                            {#each courseFeedback as feedback, index (feedback.id)}
                            <li>
                                <div class="flex gap-2 align-items-center">
                                    <img src="/images/default.png" class="radius-sm" alt="avatar" width="80" height="80">
                                    <div class="flex-column w-100 gap-1">
                                        <div class="flex align-items-center justify-content-between">
                                            <p class="body-small-semi-bold mb-0">Michael Hernandez</p>
                                            <div class="flex gap-1 align-items-center">
                                                <p class="caption-reguler mb-0">4.8</p>
                                                <StarFill color="#FF9933" width=12 height=12 />
                                            </div>
                                        </div>
                                        <p class="caption-light mb-0">
                                            Materi yang diberikan oleh pemateri asik dan mudah dipahami, terimakasih atas ilmunya yang bermanfaat.
                                        </p>
                                    </div>
                                </div>
                            </li>
                            {/each}
                            {:else}
                            <li>
                                <p class="body-small-reguler mb-0">
                                    Belum ada umpan balik dari pengguna lain
                                </p>
                            </li>
                            {/if}
                            </ul>
                            {:else}
                            Memuat data
                            {/if}

                            {#if courseFeedback.length > 0}
                            <div class="h-line-spaced p-0">
                                <Button type="link" href="/testimonials" classList="btn btn-no-padding tc-primary-main">
                                    <div>Lihat Selengkapnya</div>
                                </Button>
                            </div>
                            {/if}
    
                            {/if}
                        </div>
                        {/if}
                        <div class="certificate-nav">
    
                        </div>
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
                        {#if !myFeedback}
                        <Button classList="btn btn-main" onClick={() => modalShow = true}>Beri Umpan Balik</Button>
                        {/if}
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

{#if modalShow}
    <Modal width="28.125rem" bind:modalShow>
        <div class="card-body gap-4">
            <div class="flex-column gap-3">
                <h5 class="mb-0">Umpan Balik</h5>
                <div class="flex-column w-100 gap-2">
                    <p class="body-large-reguler">
                        Nilai
                    </p>
                    <div class="flex align-items-center justify-content-evenly">
                        {#each Array.from({length: rating}, (_,i) => i) as i}
                        <Button classList="btn btn-no-padding" onClick={() => {
                            rating = i + 1
                        }}>
                            <StarFill width=40 height=40 color="#3951A8"/>
                        </Button>
                        {/each}
                        {#each Array.from({length: 5 - rating}, (_,i) => i) as i}
                        <Button classList="btn btn-no-padding" onClick={() => {
                            rating = rating + (i + 1)
                        }}>
                            <StarFill width=40 height=40 color="#E6EBF7"/>
                        </Button>
                        {/each}
                    </div>
                </div>
                <div class="flex-column w-100 gap-2">
                    <p class="body-large-reguler">
                        Ulasan
                    </p>
                    <textarea rows="8" class="feedback-review" id="feedback" bind:value={review}></textarea>
                </div>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button classList="btn btn-main-outline" onClick={() => {
                    rating = 0
                    review = ""
                    modalShow = false
                }}>Batal</Button>
                <Button classList="btn btn-main" onClick={postFeedback}>Simpan</Button>
            </div>
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>{course ? course.title : ''}</title>
</svelte:head>

<style>
    aside {
        width: 25%;
        height: 100%;
		position: sticky;
		position: -webkit-sticky;
		top: 104px;
    }

    .silabus-nav, .feedback-nav {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: .875rem;
        gap: 1.5rem;
        border-radius: .25rem;
        border: 1px solid var(--neutral-border);
        background-color: var(--neutral-white);
    }

    .silabus-item-container, .feedback-item-container {
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

    .feedback-review {
        padding: .875rem;
        border-radius: .5rem;
        background-color: #F5F6F7;
        border: none;
        font-family: Poppins;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0.20000000298023224px;
    }

    .feedback-review:focus {
        outline: none;
    }
</style>