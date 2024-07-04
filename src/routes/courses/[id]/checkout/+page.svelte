<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { PUBLIC_MIDTRANS_CLIENT_KEY } from "$env/static/public"

    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import ApiController from "$lib/ApiController";

    import Navbar from "@components/Navbar.svelte";
	import Button from "@components/Button.svelte";
	import { Arrow90degLeft, FileEarmarkText, Pass, PlayCircle } from "svelte-bootstrap-icons";
	import checkLogin from "$lib/CheckLogin";
	import Spinner from "@components/Spinner.svelte";
	import { error } from "@sveltejs/kit";
	import { setFlash } from "$lib/Flash";

    let user
    let id = $page.params.id
    let transaction, course, isNew
    let status = false, showSpinner = false

    let toastData
    let toastVisible = false

    const checkout = () => {
		ApiController.sendRequest({
			method: "POST",
			endpoint: `checkout/process`,
            data: { course_id: id },
            authToken: user.token
		}).then(response => {
			transaction = response.transaction
			course = response.course
			isNew = response.new
			status = true
		}).catch(e => {
            let response = e.response.data
            if(response.error == "You have already purchased this course"){
                return window.location.href = `/student/my-courses/${id}`
            }
        })
	}

    const pay = () => {
        showSpinner = true
        window.snap.pay(transaction.snap_token, {
            onSuccess: function(result){
                console.log(result)
                ApiController.sendRequest({
                    method: "POST",
                    endpoint: `checkout/success/${transaction.id}`,
                    authToken: user.token
                }).then(response => {
                    showSpinner = false
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success', redirectTo: `/courses/${id}` }
                    toastVisible = true
                    showSpinner = false
                })
            },
            onPending: function(result){
                showSpinner = false
                alert("Waiting for your payment!")
                console.log(result)
                ApiController.sendRequest({
                    method: "POST",
                    endpoint: `checkout/pending/${transaction.id}`,
                    authToken: user.token
                }).then(response => {
                    showSpinner = false
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success', redirectTo: `/courses/${id}` }
                    toastVisible = true
                    showSpinner = false
                })
            },
            onError: function(result){
                showSpinner = false
                alert("Payment failed!")
                console.log(result)
            },
            onClose: function(){
                showSpinner = false
                alert('You closed the popup without finishing the payment')
            }
        })
    }

	onMount(() => {
        user = checkLogin(null, false)

		checkout()
	})
</script>

<Navbar active="materi" />

{#if status}
<main>
    <section id="checkout" class="section" style="padding-top: 0;">
        <div class="container">
            {#if showSpinner}
                <Spinner/>
            {/if}
            <Button type="link" href="/courses/{id}" classList="btn btn-neutral-outline radius-sm">
                <div class="flex gap-2 align-items-center">
                    <Arrow90degLeft/>
                    Kembali
                </div>
            </Button>
            <div class="row justify-content-center py-5">
                <div class="col-12 col-md-8">
                    <h4>Proses Pembayaran</h4>
                    <div class="card radius-sm neutral-border p-standard pb-0">
                        <div class="card-body">
                            <p class="body-large-semi-bold">Materi dibeli</p>
                            <div class="row">
                                <div class="col-12 col-md-4">
                                    <img src="{PUBLIC_SERVER_PATH}/storage/{course.thumbnail}" alt="course-thumbnail" class="thumbnail">
                                </div>
                                <div class="col-12 col-md-8">
                                    <div class="flex-column gap-4">
                                        <p class="body-medium-semi-bold">{course.title}</p>
                                        <div class="flex-column gap-1">
                                            <p class="body-small-medium">Fasilitas Pembelajaran</p>
                                            <ul class="my-0">
                                                {#each course.facilities as facility}
                                                <li><p class="body-small-reguler">{facility}</p></li>
                                                {/each}
                                            </ul>
                                        </div>
                                        <div class="flex gap-3">
                                            {#if course.items.filter(elm => elm.type == 'Video').length > 0}
                                            <div class="flex align-items-center gap-2 p-standard neutral-border radius-sm">
                                                <PlayCircle/>
                                                <p class="caption-small-reguler my-0">{course.items.filter(elm => elm.type == 'Video').length} Video</p>
                                            </div>
                                            {/if}
                                            {#if course.items.filter(elm => elm.type == 'Quiz').length > 0}
                                            <div class="flex align-items-center gap-2 p-standard neutral-border radius-sm">
                                                <FileEarmarkText/>
                                                <p class="caption-small-reguler my-0">{course.items.filter(elm => elm.type == 'Quiz').length} Kuis</p>
                                            </div>
                                            {/if}
                                            {#if course.items.filter(elm => elm.type == 'Exam').length > 0}
                                            <div class="flex align-items-center gap-2 p-standard neutral-border radius-sm">
                                                <Pass/>
                                                <p class="caption-small-reguler my-0">{course.items.filter(elm => elm.type == 'Exam').length} Ujian</p>
                                            </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-content-between align-items-center" style="border-top: 1px solid var(--neutral-border);">
                                <div class="flex-column gap-2 p-standard">
                                    <p class="body-large-semi-bold">Total jumlah yang harus dibayar</p>
                                    <p class="body-medium-reguler">{course.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0})}</p>
                                </div>
                                <Button classList="btn btn-main" onClick={pay}>Bayar Sekarang</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
{/if}

<svelte:head>
    <title>Pembelian Materi</title>
    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={PUBLIC_MIDTRANS_CLIENT_KEY}></script>
</svelte:head>

<style>
    .thumbnail {
        object-fit: cover; 
        width: 100%; 
        aspect-ratio: 4 / 3;
        border-radius: .25rem;
    }
</style>