<script>
    import Instagram from "svelte-bootstrap-icons/lib/Instagram.svelte";
    import Facebook from "svelte-bootstrap-icons/lib/Facebook.svelte";
    import Twitter from "svelte-bootstrap-icons/lib/Twitter.svelte";
</script>

<footer>
    <div class="container pt-6">
        <hr>
        <div class="flex-column gap-6 my-6">
            <div class="flex justify-content-between">
                <div class="flex-column gap-4">
                    <div class="h5">CITRATAMA</div>
                    <div class="body-small-reguler" style="max-width: 300px;">
                        Citratama adalah platform belajar online yang menyediakan materi berkualitas untuk membantu Anda mencapai tujuan belajar Anda. Bergabunglah dan mulai perjalanan belajar Anda hari ini.
                    </div>
                </div>
                <div class="flex-column gap-4">
                    <div class="body-super-large-semi-bold">Navigasi</div>
                    <div class="flex-column gap-3">
                        <a href="/" class="body-small-medium">Beranda</a>
                        <a href="/learning-paths" class="body-small-medium">Alur Belajar</a>
                        <a href="/courses" class="body-small-medium">Materi</a>
                    </div>
                </div>
                <div class="flex-column gap-4">
                    <div class="body-super-large-semi-bold">&nbsp;</div>
                    <div class="flex-column gap-3">
                        <a href="/events" class="body-small-medium">Acara</a>
                        <a href="/articles" class="body-small-medium">Artikel</a>
                        <a href="/testimonials" class="body-small-medium">Testimonial</a>
                    </div>
                </div>
                <div class="flex gap-4 align-items-center">
                    <a href="https://www.instagram.com/citratama_indonesia" target="_blank"><Instagram class="tc-primary-main" width={24} height={24}/></a>
                    <!-- <a href="/"><Facebook class="tc-primary-main" width={24} height={24}/></a>
                    <a href="/"><Twitter class="tc-primary-main" width={24} height={24}/></a> -->
                </div>
            </div>
            <div class="body-small-reguler">© 2024 CITRATAMA. Semua hak dilindungi.</div>
        </div>
    </div>
</footer>

<style>
    footer > div > hr{
        border: 1px solid var(--neutral-border);
    }

    footer a{
        color: #718284;
    }
</style>