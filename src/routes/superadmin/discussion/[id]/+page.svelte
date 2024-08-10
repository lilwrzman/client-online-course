<script>
	import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import Button from "@components/Button.svelte";
	import Navbar from "@components/Navbar.svelte";
	import Sidebar from "@components/Sidebar.svelte";
	import Toast from "@components/Toast.svelte";
	import { onMount } from "svelte";
    import { page } from "$app/stores";
	import Spinner from "@components/Spinner.svelte";
	import { getCurrentTime, getDay } from "$lib/Date";

    let user
    let datas
    let discussions

    let toastData
    let toastVisible = false
    let showSpinner = false

    let showReplies = false
    let activeDiscussion
    let replyTypeShow = false

    const getDiscussion = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/${$page.params.id}/discussion`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                datas = response.data
                discussions = response.data.discussions

                console.log(datas)
                console.log(discussions)
            }
        })
    }

    const postDiscussion = (content, parent_id = null) => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "discussion/post",
            data: {
                course_id: $page.params.id,
                parent_id, content
            },
            authToken: user.token
        }).then(response => {
            if(response.status){
                toastData = {
                    title: "Berhasil",
                    message: "Diskusi dikirim!",
                    color: "toast-success"
                }
                toastVisible = true

                if(window.document.getElementById('new-discuss')){
                    window.document.getElementById('new-discuss').value = ''
                }

                if(window.document.getElementById(`reply-discuss-${parent_id}`)){
                    window.document.getElementById(`reply-discuss-${parent_id}`).value = ''
                }
                
                getDiscussion()
                showSpinner = false
            }
        }).catch(e => {
            console.error(e)
            showSpinner = false
        })
    }

    let isSidebarOpen = true

    onMount(() => {
        user = checkLogin("Superadmin", true)

        getDiscussion()
    })
</script>

<div class="flex">
    <Sidebar active="Forum Diskusi" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Forum Diskusi"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>        
                {/if}
                <div class="flex gap-2">
                    <a href="/superadmin/discussion" class="body-medium-semi-bold tc-neutral-disabled">Umpan Balik</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/discussion/{$page.params.id}" class="body-medium-semi-bold tc-primary-main">{ datas ? datas.title : '' }</a>
                </div>

                <div class="row">
                    <div class="col-12 col-md-8 bg-neutral-white p-standard">
                        <div class="flex-column gap-2 mb-5">
                            <textarea id="new-discuss" rows="10" class="text-discuss" placeholder="Masukkan pertanyaan disini..."></textarea>
                            <div class="flex justify-content-end gap-2">
                                <Button classList="btn btn-main-outline" onClick={() => {
                                    window.document.getElementById('new-discuss').value = ""
                                }}>Batal</Button>
                                <Button classList="btn btn-main" onClick={() => {
                                    let content = window.document.getElementById('new-discuss').value
                                    
                                    if(!content){
                                        return alert('Mohon isi sesuatu pada area input!')
                                    }

                                    postDiscussion(content)
                                }}>Kirim</Button>
                            </div>
                        </div>
                        {#if discussions}
                        <div class="flex-column gap-3">
                            {#if discussions.length > 0}
                            {#each discussions as discuss, index (discuss.id)}
                            <div class="discuss-container">
                                <div class="discuss-header">
                                    <div class="flex gap-3">
                                        <img src="{PUBLIC_SERVER_PATH}/storage/{discuss.user.avatar}" alt="avatar" width="60" height="60" style="border-radius: 100%;">
                                        <div class="flex-column gap-2 align-items-start">
                                            <p class="body-large-semi-bold">{discuss.user.role == 'Superadmin' ? discuss.user.username : discuss.user.info.fullname}</p>
                                            <div class="neutral-border px-2 py-1 radius-sm">
                                                {#if discuss.user.role == 'Student'}
                                                <p class="body-small-reguler">Karyawan</p>
                                                {:else if discuss.user.role == 'Teacher'}
                                                <p class="body-small-reguler">Pemateri</p>
                                                {:else if discuss.user.role == 'Superadmin'}
                                                <p class="caption-reguler-thin">Admin</p>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-column align-items-end">
                                        <p class="caption-reguler tc-neutral-disabled">{getCurrentTime(discuss.created_at)}</p>
                                        <p class="caption-reguler tc-neutral-disabled">{getDay(discuss.created_at)}</p>
                                    </div>
                                </div>
                                <div class="discuss-body">
                                    <p class="body-small-reguler">{discuss.content}</p>
                                </div>
                                <div class="discuss-footer">
                                    {#if discuss.replies.length > 0}
                                    <Button classList="btn btn-no-padding" onClick={() => {
                                        if(showReplies && activeDiscussion && activeDiscussion == discuss.id){
                                            showReplies = false
                                            activeDiscussion = null
                                        }else{
                                            showReplies = true
                                            activeDiscussion = discuss.id
                                        }
                                    }}>
                                        <p class="body-small-semi-bold tc-primary-main">
                                            {showReplies && activeDiscussion ? activeDiscussion == discuss.id ? 'Tutup' : 'Lihat' : 'Lihat'} Balasan [{discuss.replies.length}]
                                        </p>
                                    </Button>
                                    {/if}

                                    {#if !replyTypeShow }
                                    <Button classList="btn btn-no-padding" onClick={() => {
                                        activeDiscussion = discuss.id
                                        replyTypeShow = true
                                    }}>
                                        <p class="body-small-semi-bold tc-primary-main">
                                            Beri Tanggapan
                                        </p>
                                    </Button>
                                    {/if}
                                </div>

                                {#if discuss.replies.length > 0 && showReplies && activeDiscussion == discuss.id}    
                                <div id="discuss-replies-{index + 1}" class="flex-column w-100 pl-5 mt-3 gap-4">
                                    {#each discuss.replies as reply, reply_index (reply.id)}
                                    <div class="flex-column w-100 gap-standard">
                                        <div class="flex align-items-center justify-content-between">
                                            <div class="flex gap-3">
                                                <img src="{PUBLIC_SERVER_PATH}/storage/{reply.user.avatar}" alt="avatar" width="60" height="60" style="border-radius: 100%;">
                                                <div class="flex-column gap-2 align-items-start">
                                                    <p class="body-small-semi-bold">{reply.user.role == 'Superadmin' ? reply.user.username : reply.user.info.fullname}</p>
                                                    <div class="neutral-border px-2 py-1 radius-sm">
                                                        {#if reply.user.role == 'Student'}
                                                        <p class="caption-reguler-thin">Karyawan</p>
                                                        {:else if reply.user.role == 'Teacher'}
                                                        <p class="caption-reguler-thin">Pemateri</p>
                                                        {:else if reply.user.role == 'Superadmin'}
                                                        <p class="caption-reguler-thin">Admin</p>
                                                        {/if}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex-column align-items-end">
                                                <p class="caption-reguler tc-neutral-disabled">{getCurrentTime(reply.created_at)}</p>
                                                <p class="caption-reguler tc-neutral-disabled">{getDay(reply.created_at)}</p>
                                            </div>
                                        </div>
                                        <p class="body-small-reguler">{reply.content}</p>
                                    </div>
                                    {/each}
                                </div>
                                {/if}

                                {#if replyTypeShow && activeDiscussion == discuss.id}
                                <div class="flex-column gap-2 w-100">
                                    <textarea id="reply-discuss-{discuss.id}" rows="10" class="text-discuss" placeholder="Masukkan balasan disini..."></textarea>
                                    <div class="flex justify-content-end gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => {
                                            window.document.getElementById(`reply-discuss-${discuss.id}`).value = ""
                                            replyTypeShow = false
                                            activeDiscussion = null
                                        }}>Batal</Button>
                                        <Button classList="btn btn-main" onClick={() => {
                                            let content = window.document.getElementById(`reply-discuss-${discuss.id}`).value
                                            
                                            if(!content){
                                                return alert('Mohon isi sesuatu pada area input!')
                                            }
                                            
                                            replyTypeShow = false
                                            activeDiscussion = null
                                            postDiscussion(content, discuss.id)
                                        }}>Kirim</Button>
                                    </div>
                                </div>
                                {/if}
                            </div>
                            {/each}
                            {/if}
                        </div>
                        {/if}
                    </div>
                </div>
            </div> 
        </main>
    </div>  
</div>

<svelte:head>
    <title>Umpan Balik</title>
</svelte:head>

<style>
    .discuss-container { 
        padding: .875rem;
        display: flex;
        flex-direction: column;
        gap: .875rem;
        border-radius: .25rem;
        border: 1px solid var(--neutral-border); 
        background-color: var(--neutral-white);
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
        gap: 1rem;
    }

    .text-discuss {
        border-radius: .25rem;
        background-color: var(--neutral-white) !important;
        border: 1px solid var(--neutral-border);
        padding: .875rem;
        font-family: Poppins;
        font-size: 14px;
        font-weight: 400;
        white-space: normal;
    }

    .text-discuss:focus {
        outline: none;
        border: 1px solid var(--neutral-border);
    }
</style>