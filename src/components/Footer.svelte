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
                    <div class="h5">Logo Disini</div>
                    <div class="body-medium-reguler" style="max-width: 250px;">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit Nunc tincidunt finibus tortor.
                    </div>
                </div>
                <div class="flex-column gap-4">
                    <div class="body-super-large-semi-bold">Lorem Ipsum</div>
                    <div class="flex-column gap-3">
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                    </div>
                </div>
                <div class="flex-column gap-4">
                    <div class="body-super-large-semi-bold">Lorem Ipsum</div>
                    <div class="flex-column gap-3">
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                        <a href="/" class="body-small-medium">Lorem Ipsum</a>
                    </div>
                </div>
                <div class="flex gap-4 align-items-center">
                    <a href="/"><Instagram class="tc-primary-main" width={24} height={24}/></a>
                    <a href="/"><Facebook class="tc-primary-main" width={24} height={24}/></a>
                    <a href="/"><Twitter class="tc-primary-main" width={24} height={24}/></a>
                </div>
            </div>
            <div class="body-small-reguler">
                © Lorem ipsum dolor sit amet.
            </div>
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