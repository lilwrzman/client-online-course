<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { flip } from "svelte/animate";

    import checkLogin from "$lib/CheckLogin";
    import ApiController from "$lib/ApiController";
    import { setFlash } from "$lib/Flash";

    import Sidebar from "@components/Sidebar.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Toast from "@components/Toast.svelte";
    import Spinner from "@components/Spinner.svelte";
	import InputField from "@components/InputField.svelte";
	import Button from "@components/Button.svelte";
	import { Circle, List, PlusLg, RecordCircle, X, Trash3 } from "svelte-bootstrap-icons";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";

    let user, detail, errors
    let toastData, toastVisible = false, showSpinner = false, status = false
    let id = $page.params.id

    let title, passing_score, description
    let items = [{ 
        id: 1,
        question: "", 
        options: [ 
            { id: 1, text: "", is_true: false },
            { id: 2, text: "", is_true: false } 
        ] 
    }]

    const flipDurationMs = 300
    const handleDndConsider = (e) => items = e.detail.items
    const handleSort = (e) => items = e.detail.items

    const handleSubmit = () => {
        description = "Lorem ipsum dolor sit amet"
        if(!title){
            alert('Mohon isi judul kuis!')
            return
        }

        if(!passing_score){
            alert('Mohon tentukan nilai KKM kuis!')
            return
        }

        if(!description){
            alert('Mohon isi deskripsi kuis!')
            return
        }

        let shouldStop = false;

        items.forEach(elm => {
            if (shouldStop) return;

            if (!elm.question) {
                alert('Mohon pastikan semua soal memiliki pertanyaan!');
                shouldStop = true;
                return;
            }

            elm.options.forEach(opt => {
                if (shouldStop) return

                if (!opt.text) {
                    alert('Mohon pastikan seluruh pilihan ganda telah terisi!')
                    shouldStop = true
                    return
                }

                opt.is_true = Boolean(opt.is_true);
            })

            if (shouldStop) return;

            if (elm.options.filter(opt => opt.is_true).length == 0) {
                alert('Mohon pastikan semua pilihan ganda telah diatur jawaban yang benar!')
                shouldStop = true
                return
            }
        })

        if (shouldStop) return;

        let datas = {
            type: "Quiz", title: title, description: description, 
            passing_score: passing_score, question_list: items
        }

        showSpinner = true

        ApiController.sendRequest({
            method: "POST",
            endpoint: `course/${id}/assessment/add`,
            data: JSON.stringify(datas),
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: `/superadmin/course/${id}?active=Submateri` })
            }  
        }).catch(e => {
            let response = e.response.data
            if(response.error){
                errors = response.error
                showSpinner = false
                toastData = { title: "Gagal", message: "Mohon periksa kembali data kuis!", color: 'toast-danger' }
                toastVisible = true
                return
            }

            if(!response.status){
                toastData = { title: "Gagal", message: response.message, color: 'toast-danger' }
                toastVisible = true
                showSpinner = false
                return
            }
        })
    }

    const getDetail = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/get/${id}`,
        }).then(response => {
            detail = response.data
            status = true
        })
    }

    onMount(() => {
        user = checkLogin("Superadmin")

        if($page.url.searchParams.has('title')){
            title = $page.url.searchParams.get('title')
        }

        getDetail()
    })

    let isSidebarOpen = true
</script>

<div class="flex">
    <Sidebar isOpen={true} active="Materi" role="Superadmin" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Bank Kursus"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-5" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} redirectTo={toastData.redirectTo}/>
                {/if}

                {#if showSpinner}
                    <Spinner/>    
                {/if}

                {#if status}
                <div class="row justify-content-center">
                    <div class="flex gap-2 col-12 col-md-10 p-0">
                        <a href="/superadmin/course" class="body-medium-semi-bold tc-neutral-disabled">Materi</a>
                        <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                        <a href="/superadmin/course/{id}?active=Submateri" class="body-medium-semi-bold tc-neutral-disabled">{detail.title}</a>
                        <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                        <a href="/superadmin/course/{id}/quiz#" class="body-medium-semi-bold tc-primary-main">Kuis</a>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <div class="card radius-sm p-5 card-cap-primary col-12 col-md-10">
                        <div class="card-body gap-3">
                            <InputField bind:value={title} rules={[{required: true}]} error={errors ? errors.title ? errors.title : '' : ''}
                                label="Judul Kuis" labelClass="body-medium-semi-bold" id="title" placeholder="Masukkan judul"/>
                            <InputField bind:value={passing_score} rules={[{required: true}]} error={errors ? errors.passing_score ? errors.passing_score : '' : ''}
                                type="number" label="Nilai KKM Kuis" labelClass="body-medium-semi-bold" id="passing_score" placeholder="Masukkan nilai kriteria ketuntasan minimal"/>
                            <InputField bind:value={description} rules={[{required: true}]} error={errors ? errors.description ? errors.description : '' : ''}
                                type="tinymce" label="Deskripsi Kuis" labelClass="body-medium-semi-bold" id="description" placeholder="Masukkan deskripsi"/>
                        </div>
                    </div>
                </div>

                <div class="row gap-4 position-relative justify-content-center" 
                    use:dragHandleZone={{ items, flipDurationMs }} on:consider={handleDndConsider} on:finalize="{handleSort}">
                    {#each items as question, index (question.id)}
                    <div class="card radius-sm col-12 col-md-10 p-5 pt-2 card-cap-secondary" animate:flip="{{ duration: flipDurationMs }}">
                        <div class="card-body gap-3">
                            <div class="flex align-items-center justify-content-center" 
                                use:dragHandle aria-label="drag-handle for {question.id}"
                                style="cursor: grab;">
                                <List />
                            </div>
                            <InputField bind:value={question.question} rules={[{required: true}]} error={errors ? errors[`question_list${index}.question`] ? errors[`question_list${index}.question`] : '' : ''}
                                label="Soal {index + 1}" labelClass="body-medium-semi-bold" id="question-{index + 1}" placeholder="Masukkan pertanyaan"/>
                            <div class="flex-column gap-2">
                                <label for="options-list-{index + 1}" class="body-medium-semi-bold">Pilihan Ganda</label>
                                {#each question.options as option, option_index}
                                    <div class="flex gap-3 align-items-center">
                                        <Button classList="btn btn-no-padding" onClick={() => {
                                            items[index].options = items[index].options.map((option, index) => {
                                                if (index === option_index) {
                                                    return { ...option, is_true: !option.is_true };
                                                }
                                                return { ...option, is_true: false };
                                            })
                                        }}>
                                            <div class="flex align-items-center">
                                                {#if option.is_true}
                                                <RecordCircle color="#2ECC71" width=24 height=24/>
                                                {:else}
                                                <Circle width=24 height=24/>
                                                {/if}
                                            </div>
                                        </Button>
                                        <InputField bind:value={option.text} rules={[{required: true}]} 
                                            error={errors ? 
                                                errors[`question_list.${index}.options.${option_index}.text`] ? errors[`question_list.${index}.options.${option_index}.text`] : 
                                                errors[`question_list.${index}.options.${option_index}.is_true`] ? errors[`question_list.${index}.options.${option_index}.is_true`] : '' : ''}
                                            placeholder="Pilihan ganda {option_index + 1}" id="option-{option_index + 1}-{index + 1}" containerClass="w-100"/>
                                        
                                        {#if question.options.length > 2}
                                        <Button classList="btn btn-no-padding" onClick={() => {
                                            question.options = question.options.filter(elm => elm != option)
                                        }}> 
                                            <div class="flex align-items-center"><X width=24 height=24 /></div> 
                                        </Button>
                                        {/if}
                                    </div>

                                    {#if option_index + 1 == question.options.length}
                                    <div class="flex justify-content-center align-items-center gap-2">
                                        <Button classList="btn btn-main-outline pl-4" onClick={() => {
                                            question.options[option_index + 1] = { id: question.options[option_index].id + 1, text: "", is_true: false }
                                        }}>
                                            <div class="flex align-items-center justify-content-center gap-2">
                                                <PlusLg/>
                                                <div>Tambah Pilihan</div>
                                            </div>
                                        </Button>
                                        {#if items.length > 1}
                                        <Button classList="btn btn-danger-outline pl-4" onClick={() => {
                                            items = items.filter(elm => elm != question)
                                        }}>
                                            <div class="flex align-items-center justify-content-center gap-2">
                                                <Trash3/>
                                                <div>Hapus Soal</div>
                                            </div>
                                        </Button>
                                        {/if}
                                    </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                    {/each}

                    <div class="tc-primary-main h-line-spaced col-12 col-md-10 p-0">
                        <Button classList="btn btn-no-padding tc-primary-main" onClick={() => {
                            items[items.length] = { 
                                id: items[items.length - 1].id + 1,
                                question: "", 
                                options: [ 
                                    { id: 1, text: "", is_true: false },
                                    { id: 2, text: "", is_true: false } 
                                ] 
                            }
                        }}>
                            <div class="flex align-items-center justify-content-center gap-2">
                                <PlusLg/>
                                <div>Tambah Soal</div>
                            </div>
                        </Button>
                    </div>

                    <div class="flex justify-content-end gap-2 col-12 col-md-10 p-0">
                        <Button type="link" href="/superadmin/course/{id}?active=Submateri" classList="btn btn-main-outline">Kembali</Button>
                        <Button classList="btn btn-main" onClick={handleSubmit}>Simpan Kuis</Button>
                    </div>
                </div>
                {/if}
            </div>
        </main>
    </div>
</div>

<svelte:head>
    <title>Tambah Kuis</title>
</svelte:head>

<style>
    :global([draggable]) {
        -webkit-touch-callout:none;
        -ms-touch-action:none; touch-action:none;
        -moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;
    }

    .card-cap-primary{
        border-top: 8px solid var(--primary-main);
    }

    .card-cap-secondary{
        border-top: 8px solid var(--primary-focus);
    }
</style>