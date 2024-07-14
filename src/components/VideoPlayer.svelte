<script>
	import { onDestroy, onMount } from "svelte";

    import videojs from 'video.js';
	import 'video.js/dist/video-js.css';

    let player
    let curInterval
    export let url
    export let token
    export let finish = false

    let controlBar = {
        skipButtons: {
            backward: 10
        }
    }

    const handleKeyPress = (event) => {
        const key = event.key;

        if(!finish){
            if (key === 'ArrowRight') {
                event.preventDefault();
                return false;
            }
        }
    }

    onMount(() => {
        let curTime = 0

        player = videojs("video-js-player", {
            aspectRatio: "16:9",
            enableSmoothSeeking: true,
            responsive: true,
            controls: true,
            autoplay: false,
            preload: 'auto',
            controlBar: controlBar,
            userActions: {
                hotkeys: function(event){
                    if(event.which === 32){
                        if(this.paused()){
                            this.play()
                        }else{
                            this.pause()
                        }
                    }

                    if(event.which === 37){
                        this.currentTime(this.currentTime() - 10)
                    }

                    if(finish && event.which == 39){
                        this.currentTime(this.currentTime() + 10)
                    }
                }
            },
            sources: [{
                src: url,
                type: 'application/x-mpegURL'
            }]
        })

        player.ready(() => {
            let tech = player.tech()
            let xhr = tech.vhs.xhr

            xhr.beforeRequest = function(options) {
                options.headers = options.headers || {}
                options.headers['Authorization'] = `Bearer ${token}`
                return options
            }
        })

        player.on('timeupdate', function(data){
            if(player.currentTime() >= player.duration()){
                finish = true
            }
        })

        player.on('seeking', function(event){
            if(!finish){
                if(curTime < player.currentTime()){
                    player.currentTime(curTime)
                }
            }
        })

        player.on('seeked', function(event){
            if(!finish){
                if(curTime < player.currentTime()){
                    player.currentTime(curTime)
                }
            }
        })

        curInterval = setInterval(() => {
            if(!player.paused()){
                curTime = player.currentTime()
            }
        })
    })

    $: {
        if(finish){
            controlBar = {
                skipButtons: {
                    forward: 10,
                    backward: 10,
                }
            }
        }
    }

    onDestroy(() => {
        if(player){
            player.dispose()
        }

        if(curInterval){
            clearInterval(curInterval)
        }

        window.removeEventListener('keydown', handleKeyPress);
    })
</script>

<div class="video-js-container">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video id="video-js-player" class="video-js vjs-default-skin"></video>
</div>

<style>
    .video-js-container { 
        width: 100%;
        border-radius: .25rem;
    }

    .video-js {
        border-radius: .25rem;
        aspect-ratio: 16 / 9;
        width: 100%;
        height: 100%;
    }
</style>