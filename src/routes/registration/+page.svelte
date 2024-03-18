<script>
    import Navbar from "@components/Navbar.svelte";
    import Footer from "@components/Footer.svelte";
    import Button from "@components/Button.svelte";
    import InputField from "@components/InputField.svelte";
</script>

<Navbar/>

<main>
    <section id="registration">
        <div class="container">
            <div class="card mx-auto" style="max-width: 56.83rem;">
                <div class="card-body gap-5">
                    <div class="h4">Daftar</div>
                    <InputField label="Nama Lengkap" id="fullname" name="fullname" placeholder="Nama lengkap anda"/>
                    <InputField label="Username" id="username" name="username" placeholder="Maksimal 14 karakter"/>
                    <InputField type="email" label="Email" id="email" name="email" placeholder="Masukkan email anda"/>
                    <InputField type="password" label="Password" id="password" name="password" placeholder="Maksimal 16 karakter"/>
                    <InputField type="password" label="Konfirmasi Password" id="password-confirmation" name="password-confirmation" placeholder="Maksimal 16 karakter"/>
                    <div class="flex-column gap-2">
                        <label for="referral" class="body-large-reguler">Kode Referral</label>
                        <input type="text" id="referral" name="referral" placeholder="Optional">
                    </div>
                    <Button classList="btn btn-main">Daftar</Button>
                    <div class="flex justify-content-center gap-1 default-text-input">
                        <p>Sudah punya akun?</p>
                        <a href="" class="link">Masuk disini</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<Footer/>