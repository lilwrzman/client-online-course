<script>
    import Button from "@components/Button.svelte"
    import Modal from "@components/Modal.svelte"
    import InputField from "@components/InputField.svelte"
    export let modalShow = false
</script>

<Modal bind:modalShow>
	<div class="card-body gap-5">
		<div class="flex justify-content-between align-items-center">
			<div class="h4">Masuk</div>
			<Button classList="btn btn-no-padding" onClick={() => modalShow = false}>
				<img src="/icons/x-lg.svg" alt="icon">
			</Button>
		</div>
		<InputField type="email" id="email" name="email" label="Alamat Email" placeholder="Ketik disini"/>
		<InputField type="password" id="password" name="password" label="Password" placeholder="Ketik disini"/>
		<Button classList="btn btn-main">Masuk</Button>
		<div class="flex justify-content-center gap-1 default-text-input">
			<p>Belum punya akun?</p>
			<Button type="link" href="/registration" classList="btn btn-no-padding" onClick={() => modalShow = false}>
                <p class="link default-text-input">Daftar disini</p>
            </Button>
		</div>
	</div>
</Modal>