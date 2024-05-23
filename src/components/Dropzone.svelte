<script>
    import { CloudUpload } from "svelte-bootstrap-icons";
    import Button from "./Button.svelte";
	import { onDestroy, onMount } from "svelte";

    export let useDefault = true
    export let file
    export let url = ''
    export let minHeight = 0.75

    let dropzone, dropzoneMessage, preview, input

    const previewByURL = (url) => {
        document.querySelector('.dropzone-text').style.visibility = 'hidden'
        preview.style.display = 'block'
        preview.style.backgroundImage = `url(${url})`
        preview.style.backgroundSize = "contain"
        preview.style.backgroundPosition = "center"
        preview.style.backgroundRepeat = "no-repeat"
    }
    
    const reset = () => {
        file = null
        dropzoneMessage.textContent = ''
        dropzoneMessage.classList.remove = 'tc-danger-main'
    }

    const openFileHandler = () => {
        input = document.getElementById('dropzone-file')
        input.click()
        input.onchange = (evt) => {
            send(evt.target.files[0])
        }
    }

    const send = (data) => {
        file = data

        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            document.querySelector('.dropzone-text').style.visibility = 'hidden'
            preview.style.display = 'block'
            preview.style.backgroundImage = `url(${e.target.result})`
            preview.style.backgroundSize = "contain"
            preview.style.backgroundPosition = "center"
            preview.style.backgroundRepeat = "no-repeat"
        }
        fileReader.readAsDataURL(file)
    }

    onMount(() => {
        dropzone = document.getElementById('dropzone-container')
        dropzoneMessage = document.querySelector('#dropzone-container p')
        preview = document.getElementById('dropzone-preview')

        dropzone.style.height = `${dropzone.getBoundingClientRect().width * minHeight}px`

        window.addEventListener('resize', (evt) => {
            dropzone.style.height = `${dropzone.getBoundingClientRect().width * minHeight}px`
        })

        dropzone.addEventListener('drop', async (evt) => {
            console.log(evt.dataTransfer.files)
            console.log(evt.dataTransfer.items[0])
            evt.preventDefault()

            if(evt.dataTransfer.items[0].kind !== 'file'){
                dropzoneMessage.style.display = 'block'
                dropzoneMessage.classList.add('tc-danger-main')
                dropzoneMessage.textContent = 'Error: Bukan file!'
                throw new Error('Bukan file!')
            }else{
                dropzoneMessage.style.display = 'none'
            }

            if(evt.dataTransfer.items.length > 1){
                dropzoneMessage.style.display = 'block'
                dropzoneMessage.classList.add('tc-danger-main')
                dropzoneMessage.textContent = 'Error: Tidak bisa lebih dari 1 file!'
                throw new Error('Tidak bisa lebih dari 1 file!')
            }else{
                dropzoneMessage.style.display = 'none'
            }

            const filesArray = [...evt.dataTransfer.files]

            const isFile = await new Promise((resolve) => {
                const fileReader = new FileReader()
                fileReader.onprogress = (e) => {
                    if(e.onload > 50){
                        fileReader.abort()
                        resolve(true)
                    }
                }
                fileReader.onload = () => { resolve(true) }
                fileReader.onerror = () => { resolve(false) }
                fileReader.readAsArrayBuffer(evt.dataTransfer.files[0])
            })

            if(!isFile){
                dropzoneMessage.style.display = 'block'
                dropzoneMessage.classList.add('tc-danger-main')
                dropzoneMessage.textContent = 'Error: Bukan file (tidak bisa folder)!'
                throw new Error('Bukan file (tidak bisa folder)!')
            }else{
                dropzoneMessage.style.display = 'none'
            }

            dropzone.style.backgroundColor = '#ffffff'
            send(filesArray[0])
        })

        dropzone.addEventListener('dragover', (evt) => {
            evt.preventDefault()
            dropzone.style.backgroundColor = '#F4F5F6'
        })

        dropzone.addEventListener('dragleave', (evt) => {
            evt.preventDefault()
            dropzone.style.backgroundColor = '#ffffff'
        })

        if(url){
            previewByURL(url)
        }
    })
</script>

<div id="dropzone-container" class="dashed">
    <div class="dropzone-text py-8">
        {#if useDefault}
        <div class="flex-column align-items-center gap-3">
            <CloudUpload width=34 height=34 />
            <div class="flex-column align-items-center">
                <div class="body-medium">Seret dan Lepas File di Sini</div>
                <div class="body-small-reguler">atau</div>
            </div>
            <Button classList="btn btn-main" onClick={openFileHandler}>Pilih File</Button>
            <p class="body-small-reguler" style="display: none;"></p>
        </div>
        {:else}
        <slot/>
        {/if}
    </div>
    <div id="dropzone-preview"></div>
    <input type="file" id="dropzone-file">
</div>

<style>
    #dropzone-file{
        display: none;
    }

    #dropzone-preview{
        aspect-ratio: 4 /3;
        width: calc(100% - 1rem);
        position: absolute;
        display: none;
        border-radius: 0.25rem;
    }

    .dashed{
        background-image: repeating-linear-gradient(0deg, #333333, #333333 12px, transparent 12px, transparent 19px, #333333 19px), repeating-linear-gradient(90deg, #333333, #333333 12px, transparent 12px, transparent 19px, #333333 19px), repeating-linear-gradient(180deg, #333333, #333333 12px, transparent 12px, transparent 19px, #333333 19px), repeating-linear-gradient(270deg, #333333, #333333 12px, transparent 12px, transparent 19px, #333333 19px);
        background-size: 2px 100%, 100% 2px, 2px 100% , 100% 2px;
        background-position: 0 0, 0 0, 100% 0, 0 100%;
        background-repeat: no-repeat;
    }

    #dropzone-container{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(fit-content + 2rem);
        border-radius: 0.25rem;
    }
</style>