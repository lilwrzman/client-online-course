<script>
    import { PUBLIC_MIDTRANS_CLIENT_KEY } from "$env/static/public"

    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import ApiController from "$lib/ApiController";

    import Navbar from "@components/Navbar.svelte";
	import Button from "@components/Button.svelte";
	import { Arrow90degLeft } from "svelte-bootstrap-icons";
	import checkLogin from "$lib/CheckLogin";
	import Spinner from "@components/Spinner.svelte";

    let user
    let id = $page.params.id
    let transaction, course, isNew
    let status = false, showSpinner = false

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
                    <div class="card radius-sm neutral-border p-standard">
                        <div class="card-body">
                            <div class="flex justify-content-between align-items-center neutral-border radius-sm p-standard">
                                <p class="body-medium">{ course.title }</p>
                                <p class="body-small-reguler">{ transaction.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) }</p>
                            </div>
                            <div class="flex justify-content-between align-items-center neutral-border radius-sm p-standard">
                                <p class="body-medium">Metode Pembayaran</p>
                            </div>
                            <div class="flex justify-content-between align-items-center">
                                <div class="flex-column">
                                    <p class="body-medium">Total jumlah yang harus dibayar</p>
                                    <p class="body-small-reguler">{ transaction.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}) }</p>
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
    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={PUBLIC_MIDTRANS_CLIENT_KEY}></script>
</svelte:head>