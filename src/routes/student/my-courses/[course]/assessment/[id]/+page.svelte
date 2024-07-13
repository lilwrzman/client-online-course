<script>
    import { onMount } from "svelte"
    import { page } from "$app/stores"

    import ApiController from "$lib/ApiController"
    import checkLogin from "$lib/CheckLogin"
    import { setFlash } from "$lib/Flash"

    import Spinner from "@components/Spinner.svelte";
    import Navbar from "@components/Navbar.svelte";
    import Button from "@components/Button.svelte"
	import { Circle, RecordCircle } from "svelte-bootstrap-icons";

    let user
    let course_slug = $page.params.course
    let id = $page.params.id
    let assessment
    let answers
    let showSpinner = false

    const getAssessment = () => {
        ApiController.sendRequest({
            method: "POST",
            endpoint: "student/assessment",
            data: { item_id: id, show_answer: false },
            authToken: user.token
        }).then(response => {
            if(response.status){
                assessment = response.data
                answers = response.data.questions.map(elm => {
                    return { question_id: elm.id, answer: "" }
                })
            }
        }).catch(e => {
            let error = e.response.data
        })
    }

    const handleSubmit = () => {
        for(let i = 0; i < answers.length; i++){
            if(answers[i].answer == "") return alert('Mohon langkapi jawaban anda!')
        }

        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "student/assessment/submit",
            data: { item_id: id, answers },
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({title: response.title, message: response.message, type: response.title == 'Selamat!' ? 'success' : 'warning', redirect: `/student/my-courses/${course_slug}`})
                return
            }
        }).catch(e => {
            let error = e.response.data
            console.error(error)
        })
    }

    onMount(() => {
        user = checkLogin('Student', true)

        getAssessment()
    })
</script>

<Navbar  />

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
                            <h3 class="mb-0">{assessment.title}</h3>
                            <p class="body-medium-reguler">Nilai minimum untuk lulus pada kuis yaitu {assessment.info.passing_score}.</p>
                            <p class="body-medium-reguler">{@html assessment.description}</p>
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
                                <div class="flex gap-3 align-items-center">
                                    <Button classList="btn p-0" onClick={() => {
                                        if(answers[assessment.questions.map(elm => elm.id).indexOf(question.id)].answer){
                                            answers[assessment.questions.map(elm => elm.id).indexOf(question.id)].answer = ""
                                        }else{
                                            answers[assessment.questions.map(elm => elm.id).indexOf(question.id)].answer = option
                                        }
                                    }}>
                                        <div class="flex align-items-center justify-content-center">
                                            {#if answers[assessment.questions.map(elm => elm.id).indexOf(question.id)].answer == option}
                                            <RecordCircle width=20 height=20/>
                                            {:else}
                                            <Circle width=20 height=20/>
                                            {/if}
                                        </div>
                                    </Button>
                                    <p class="body-medium-light">{option}</p>
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
                        <Button classList="btn btn-main" onClick={handleSubmit}>Selesai</Button>
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