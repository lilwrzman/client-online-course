<script>
    import { onMount } from "svelte"
    import { page } from "$app/stores"

    import ApiController from "$lib/ApiController"
    import checkLogin from "$lib/CheckLogin"
    import { setFlash } from "$lib/Flash"

    import Spinner from "@components/Spinner.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Button from "@components/Button.svelte"
	import { Check, Circle, RecordCircle, X } from "svelte-bootstrap-icons";

    let user
    let course_slug = $page.params.course
    let id = $page.params.id
    let history_id = $page.params.history_id
    let assessment
    let history
    let showSpinner = false

    const getAssessment = () => {
        ApiController.sendRequest({
            method: "POST",
            endpoint: "student/assessment",
            data: { item_id: id, show_answer: true },
            authToken: user.token
        }).then(response => {
            if(response.status){
                assessment = response.data
                console.log(assessment)
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    const getHistory = () => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `student/assessment/history/${history_id}`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                history = response.data
                console.log(history)
                getAssessment()
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    onMount(() => {
        user = checkLogin('Student', true)

        getHistory()
    })
</script>

<Navbar variant="combined" />

<section id="assessment" class="section">
    <main>
        {#if showSpinner}
            <Spinner/>
        {/if}
        <div class="container">
            {#if assessment}
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 mb-4">
                    <div class="card radius-sm p-5 card-cap-primary">
                        <div class="card-body">
                            <div class="flex align-items-center justify-content-between">
                                <h3 class="mb-0">{assessment.title}</h3>
                                <div class="flex gap-2 align-items-center">
                                    <p class="body-medium-reguler">Total Nilai</p>        
                                    <div class="py-1 px-2 radius-sm tc-neutral-white" style="background-color: var(--primary-main);">{history.score}/100</div>
                                </div>
                            </div>
                            <p class="body-medium-reguler">
                                {history.is_pass ? 'Selamat, Anda lulus pada ' : 'Mohon maaf, Anda belum lulus pada '}
                                { assessment.type == 'Quiz' ? 'Kuis' : 'Ujian' } Ini!
                            </p>
                        </div>
                    </div>
                </div>
                {#each assessment.questions as question, index (question.id)}
                <div class="col-12 col-md-8 mb-4">
                    <div class="card radius-sm p-5">
                        <div class="card-body">
                            <p class="body-medium-reguler">{question.question}</p>
                            <div class="flex-column gap-2">
                                {#each question.options as option, index (option)}
                                <div class="flex align-items-center justify-content-between">
                                    <div class="flex gap-3 align-items-center">
                                        <Button classList="btn p-0">
                                            <div class="flex align-items-center justify-content-center">
                                                {#if option === history.answer.filter(elm => elm.question_id == question.id)[0].answer}
                                                <RecordCircle width=20 height=20/>
                                                {:else}
                                                <Circle width=20 height=20/>
                                                {/if}
                                            </div>
                                        </Button>
                                        <p class="body-medium-light">{option}</p>
                                    </div>
                                    <div class="flex align-items-center justify-content-center">
                                        {#if question.correct_answer === option}
                                        <Check width=24 height=24/>
                                        {:else}
                                        <X width=24 height=24/>
                                        {/if}
                                    </div>
                                </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
                {/each}
                <div class="col-12 col-md-8 mb-4">
                    <div class="flex justify-content-end gap-2">
                        <Button type="link" href="/student/my-courses/{course_slug}" classList="btn btn-main-outline">Kembali</Button>
                    </div>
                </div>
            </div>
            {/if}
        </div>
    </main>
</section>

<svelte:head>
    <title>Assessment</title>
</svelte:head>

<style>
    .card {
        background-color: var(--primary-surface);
    }

    .card-cap-primary {
		border-top: 8px solid var(--primary-main)
	}
</style>