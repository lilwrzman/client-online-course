<script>
	import ApiController from "$lib/ApiController";
	import { onMount } from "svelte";
	import { X } from "svelte-bootstrap-icons";
	import Button from "./Button.svelte";

    export let user
    export let notificationOpen = false

    let notifications 

    const getNotification = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "notification/get",
            authToken: user.token
        }).then(response => {
            if(response.status){
                notifications = response.data
                for(let i = 0; i < 20; i++){
                    notifications.push(notifications[0])
                }
                console.log(response.data)
            }
        }).catch(e => {
            let error = e.response.data
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

    onMount(() => {
        getNotification()
    })
</script>

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
        {#each notifications as notif, index}
        {#if notif.notification.info.menu == 'articles'}
        <a href="/articles/{notif.notification.info.article_id}">
            <div class="flex-column p-standard neutral-border-bottom {notif.is_seen ? 'old' : 'new'}">
                <p class="body-small-semi-bold mb-0">Artikel</p>
                <p class="body-small-reguler mb-2">{notif.notification.message}</p>
                <p class="caption-reguler-thin">{timeAgo(notif.notification.created_at)}</p>
            </div>
        </a>
        {/if}
        {/each}
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
    }

    .new {
        background-color: var(--primary-surface);
    }
</style>