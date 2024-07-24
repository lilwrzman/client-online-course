<script>
	import { X } from "svelte-bootstrap-icons";
	import Button from "./Button.svelte";
	import ApiController from "$lib/ApiController";
	import Spinner from "./Spinner.svelte";
	import { onMount } from "svelte";

    export let token
    export let notificationOpen = false
    export let notifications

    let showSpinner = false

    const updateIsSeen = (id, redirect = null) => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "notification/update",
            data: {id},
            authToken: token
        }).then(response => {
            if(response.status){
                notifications = notifications.map(elm => {
                    if(id == elm.id){
                        return {...elm, is_seen: true}
                    }else {
                        return {...elm}
                    }
                })

                if(redirect){
                    window.location.href = redirect
                }

                return
            }
        }).catch(e => {
            let error = e.response.data
            showSpinner = false
            console.error(error)
        })
    }

    const timeAgo = (createdAt) => {
        const now = new Date
        const createdDate = new Date(createdAt)
        const diffInSeconds = Math.floor((now - createdDate) / 1000)

        const secondInMinute = 60
        const secondInHour = 60 * secondInMinute
        const secondInDay = 24 * secondInHour

        if(diffInSeconds < secondInMinute){
            return "Baru saja"
        } else if (diffInSeconds < secondInHour){
            const minutes = Math.floor(diffInSeconds / secondInMinute)
            return `${minutes} menit yang lalu`
        } else if (diffInSeconds < secondInDay){
            const hours = Math.floor(diffInSeconds / secondInHour)
            return `${hours} jam yang lalu`
        } else {
            const days = Math.floor(diffInSeconds / secondInDay)
            return `${days} hari yang lalu`
        }
    }
</script>

{#if showSpinner}
    <Spinner/>
{/if}

{#if notificationOpen}
<div class="dropdown-content-notification">
    <div class="flex align-items-center justify-content-between p-standard">
        <h5 class="mb-0">Notifikasi</h5>
        <Button classList="btn btn-no-padding" onClick={() => notificationOpen = false}>
            <div class="flex align-items-center justify-content-center">
                <X width=24 height=24 />
            </div>
        </Button>
    </div>
    <div class="notification-list">
        {#if notifications}
        {#if notifications.length > 0}
        {#each notifications as notif, index (notif.id)}
        <Button classList="btn btn-no-padding border-0" onClick={() => {
            let redirect = ""
            if(notif.notification.info.menu == 'articles'){
                redirect = `/articles/${notif.notification.info.article_id}`
            }else if(notif.notification.info.menu == 'events'){
                redirect = "/events"
            }else if(notif.notification.info.menu == 'learning-paths'){
                redirect = `/learning-paths/${notif.notification.info.learning_path_id}`
            }else if(notif.notification.info.menu == 'course'){
                if(notif.notification.info.target.includes("teacher")){
                    redirect = `/teacher/course/${notif.notification.info.course_id}`
                }else if(notif.notification.info.target.includes("superadmin")){
                    redirect = `/superadmin/course/${notif.notification.info.course_id}`
                }
            }else if(notif.notification.info.menu == 'transactions'){
                redirect = `/student/transactions`
            }else if(notif.notification.info.menu == 'transaction'){
                redirect = `/superadmin/transaction`
            }else if(notif.notification.info.menu == 'bundle'){
                if(notif.notification.info.target.includes("superadmin")){
                    redirect = `/superadmin/bundle/${notif.notification.info.target.bundle_id}`
                }else if(notif.notification.info.target.includes("corporate admin")){
                    redirect = `/corporate/bundle/${notif.notification.info.target.bundle_id}`
                }
            }else if(notif.notification.info.menu == 'my-courses'){
                redirect = `/student/my-courses/${notif.notification.info.course_id}`
            }else if(notif.notification.info.menu == 'progress'){
                redirect = `/teacher/progress/${notif.notification.info.course_id}`
            }else if(notif.notification.info.menu == 'testimonials'){
                redirect = `/testimonials`
            }else if(notif.notification.info.menu == 'feedback'){
                redirect = `/teacher/feedback/${notif.notification.info.course_id}`
            }else if(notif.notification.info.menu == 'discussion'){
                if(notif.notification.info.target.includes("teacher")){
                    redirect = `/teacher/discussion/${notif.notification.info.target.course_id}`
                }else if(notif.notification.info.target.includes("student")){
                    redirect = `/student/my-courses/${notif.notification.info.target.course_id}`
                }
            }else if(notif.notification.info.menu == 'courses'){
                redirect = `/courses/${notif.notification.info.course_id}#description`
            }

            updateIsSeen(notif.id, redirect)
        }}>
            <div class="flex-column align-items-start p-standard neutral-border-bottom {notif.is_seen ? 'old' : 'new'}">
                <p class="body-small-semi-bold mb-0">{notif.notification.title}</p>
                <p class="body-small-reguler mb-2">{notif.notification.message}</p>
                <p class="caption-reguler-thin">{timeAgo(notif.notification.created_at)}</p>
            </div>
        </Button>
        {/each}
        {:else}
        <div class="flex align-items-center justify-content-center p-standard">
            <p class="body-small-reguler">Belum ada notifikasi</p>
        </div>
        {/if}
        {/if}
    </div>
</div>
{/if}

<style>
    .dropdown-content-notification {
        width: 34.375rem;
        max-width: 34.375rem;
		display: flex;
		flex-direction: column;
		position: absolute;
		top: calc(100% + 1rem);
		right: 0;
		background-color: var(--neutral-white);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		border-radius: .25rem;
		z-index: 10;
		overflow: hidden;
	}

    .notification-list {
        max-height: 34rem;
		overflow-y: scroll;
        display: flex;
        flex-direction: column;
    }

    .old {
        background-color: var(--neutral-white);
        border: 1px solid var(--neutral-white);
    }

    .new {
        background-color: var(--primary-surface);
        border: 1px solid var(--primary-surface);
    }

    p {
        text-align: left;
    }
</style>