<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public"
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { flip } from "svelte/animate";

    import { fly } from "svelte/transition"
    import { quintOut } from "svelte/easing"

	import ApiController from "$lib/ApiController";
    import { setFlash, getFlash } from "$lib/Flash.js";
    
    import Navbar from "@components/Navbar.svelte";
    import Sidebar from "@components/Sidebar.svelte";
    import InputField from "@components/InputField.svelte";
    import Button from "@components/Button.svelte";
    import Toast from "@components/Toast.svelte";
    import Dropzone from "@components/Dropzone.svelte";
    import Spinner from "@components/Spinner.svelte";
    import Modal from "@components/Modal.svelte";

    import { ImageFill, ExclamationLg, NutFill, CheckLg, Hourglass, PersonWorkspace, Coin, PersonFill, PencilFill, PassFill, LightbulbFill, Trash, TrashFill, List, PlusLg, PlayCircle, FileEarmarkText, Pass, X, PencilSquare } from "svelte-bootstrap-icons"
	import checkLogin from "$lib/CheckLogin.js";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";

    let id = $page.params.id

    let user, errors, teachers, status = false
    let title, description, price, thumbnail_url, thumbnail_file, selected_teacher, facilities

    let toastData = null
    let toastVisible = false

    let active = 'Umum'
    let addItem = false
    let itemStatus = false
    let items = []
    let exam = null
    let newItem = ""
    let deleteType = "course"
    let selectedItem = null

    let teacherListExpand = false
    let isChangingThumbnail = false
    let showSpinner = false
    let modalShow = false
    let detail

    let timeoutId = null

    const flipDurationMs = 300
    const handleDndConsider = (e) => items = e.detail.items
    const handleSort = (e) => { 
        items = e.detail.items.map((elm, index) => {
            return {...elm, order: index + 1}
        })

        if(timeoutId){
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            reorderItems(items.filter(item => item.type != 'Exam').map(item => ({id: item.id, order: item.order})))
            timeoutId = null
        }, 1500)
    }

    const handleSubmit = (section) => {
        showSpinner = true

        let formData = new FormData()
        formData.append('section', section)
        formData.append('id', detail.id)

        if(section == 'General'){
            formData.append('title', title)
            formData.append('description', description)
            facilities.forEach((facility, index) => {
                formData.append('facilities[]', facility.text)
            })
        }else if(section == 'Thumbnail'){
            formData.append('thumbnail_file', thumbnail_file)
        }else if(section == 'Teacher'){
            formData.append('teacher_id', selected_teacher.id)
        }else if(section == 'Price'){
            formData.append('price', price)
        }else{
            return
        }

        ApiController.sendRequest({
            method: "POST",
            endpoint: "course/update",
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.error){
                errors = response.error
                showSpinner = false
                return
            }

            if(response.status){
                if(section == 'Thumbnail'){
                    thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${response.data.thumbnail}`
                    isChangingThumbnail = false
                }else if(section == 'Teacher'){
                    teacherListExpand = false
                }

                getDetail(() => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                    toastVisible = true
                    showSpinner = false
                })
            }else{
                toastData = { title: "Gagal", message: response.message, color: 'toast-danger' }
                toastVisible = true
                showSpinner = false
            }
        })
    }

    function isObjectEqual(obj1, obj2) {
		const keys1 = Object.keys(obj1)
		const keys2 = Object.keys(obj2)

		if (keys1.length !== keys2.length) return false

		for (let key of keys1) {
			const val1 = obj1[key]
			const val2 = obj2[key]

			const areObjects = isObject(val1) && isObject(val2)
			if (areObjects && !isObjectEqual(val1, val2)) return false

			if (!areObjects && val1 !== val2) return false
		}

		return true
	}

	function isObject(value) {
		return (value && typeof value === 'object' && !Array.isArray(value)) || Array.isArray(value)
	}

	function compareArrays(array1, array2) {
		if (array1.length !== array2.length) return true

		for (let i = 0; i < array1.length; i++) {
			if (!isObjectEqual(array1[i], array2[i])) return true
		}

		return false
	}

    const formatedFacilities = (datas) => {
        let result = datas.map((elm, index) => {
            return { order:  index + 1, text: elm}
        })

        return result
    }

    const getDetail = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: `course/get/${id}?with_teachers=yes`,
        }).then(response => {
            detail = response.data
            title = detail.title
            description = detail.description
            price = detail.price
            selected_teacher = detail.teacher
            teachers = detail.teachers
            thumbnail_url = `${PUBLIC_SERVER_PATH}/storage/${detail.thumbnail}`
            detail.facilities = formatedFacilities(detail.facilities)
            facilities = JSON.parse(JSON.stringify(detail.facilities))

            getItems()
            
            status = true

            if(callback != null && typeof callback === 'function'){
                callback()
            }
        })
    }

    const removeTeacher = () => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: `course/${detail.id}/remove-teacher`,
            authToken: user.token
        }).then(response => {
            if(response.status){
                getDetail(null, () => {
                    toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                    toastVisible = true
                    showSpinner = false
                })
            }
        })
    }

    const deleteCourse = () => {
        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'course/delete',
            data: { id: detail.id },
            authToken: user.token
        }).then(response => {
            if(response.status){
                setFlash({ title: 'Berhasil', message: response.message, type: 'success', redirect: '/superadmin/course' })
                return
            }else if(!response.status){
                toastData = {
                    title: "Gagal",
                    message: response.message,
                    color: 'toast-danger'
                }
                toastVisible = true
            }else{
                errors = response.error
            }
            
            modalShow = false
            showSpinner = false
        })
    }

    const getItems = () => {
        itemStatus = false
        items = []
        ApiController.sendRequest({
            endpoint: `course/${id}/items/get`,
            type: "GET"
        }).then(response => {
            if(response.status){
                items = response.data
                    .filter(elm => elm.type != 'Exam')
                    .sort((a, b) => a.order - b.order)
                exam = response.data.filter(elm => elm.type == 'Exam')
                
                if(exam.length == 1){
                    exam = exam[0]
                }else{
                    exam = null
                }

                itemStatus = true
            }
        })
    }

    const reorderItems = (datas) => {
        ApiController.sendRequest({
            method: "POST",
            endpoint: 'items/reorder',
            data: JSON.stringify(datas),
            authToken: user.token
        }).then(response => {
            if(response.status){
                toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                toastVisible = true
                return
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const deleteItem = (type, id) => {
        showSpinner = true
        ApiController.sendRequest({
            endpoint: `${type === 'Video' ? 'video' : 'assessment'}/delete`,
            method: 'POST',
            data: {id},
            authToken: user.token
        }).then(response => {
            modalShow = false
            if(response.status){
                exam = type === 'Exam' ? null : exam
                items = items.filter(elm => elm.id != id)
                toastData = { title: "Berhasil", message: response.message, color: 'toast-success' }
                toastVisible = true
                showSpinner = false
                return
            }
        }).catch(e => {
            modalShow = false
            let response = e.response.data
            if(response.error){
                console.error(response.error)
                toastData = { title: "Gagal", message: response.message, color: 'toast-danger' }
                toastVisible = true
                showSpinner = false
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

    onMount(() => {
        let flashes = getFlash()
        if(flashes){
            toastData = {
                title: flashes.title,
                message: flashes.message,
                color: `toast-${flashes.type}`
            }
            toastVisible = true
        }
        
        user = checkLogin("Superadmin")

        if($page.url.searchParams.has('active')){
            active = $page.url.searchParams.get('active')
        }

        getDetail()
    })

    $: {
        if(items.length == 0){
            addItem = true
        }else {
            addItem = false
        }
    }

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

                <div class="flex gap-2">
                    <a href="/superadmin/course" class="body-medium-semi-bold tc-neutral-disabled">Materi</a>
                    <div class="body-medium-semi-bold tc-neutral-disabled">/</div>
                    <a href="/superadmin/course/{id}" class="body-medium-semi-bold tc-primary-main">{ detail ? detail.title : '' }</a>
                </div>
                
                {#if status}
                <div class="row">
                    <div class="col-12 col-md-4 col-xl-3 mb-3 flex-column gap-3">
                        <div class="card radius-sm">
                            <div class="card-body gap-2">
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Umum'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Umum" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <NutFill width=20 height=20 color="{active == "Umum" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Umum" ? 'tc-primary-main' : 'tc-dark' }">Umum</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if title && description}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Thumbnail'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Thumbnail" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <ImageFill width=20 height=20 color="{active == "Thumbnail" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Thumbnail" ? 'tc-primary-main' : 'tc-dark' }">Thumbnail</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if thumbnail_file || detail.thumbnail}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Pemateri'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Pemateri" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <PersonWorkspace width=20 height=20 color="{active == "Pemateri" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Pemateri" ? 'tc-primary-main' : 'tc-dark' }">Pemateri</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if selected_teacher && selected_teacher.id}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Harga'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Harga" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <Coin width=20 height=20 color="{active == "Harga" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Harga" ? 'tc-primary-main' : 'tc-dark' }">Harga</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if price}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Submateri'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Submateri" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <PassFill width=20 height=20 color="{active == "Submateri" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Submateri" ? 'tc-primary-main' : 'tc-dark' }">Submateri</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if items.length > 0}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="row-menu-container" on:click={() => active = 'Publikasi'}>
                                    <div class="flex align-items-center py-1 row-menu {active == "Publikasi" ? 'row-menu-active' : '' }">
                                        <div class="flex flex-wrap align-items-center gap-4 p-2">
                                            <LightbulbFill width=20 height=20 color="{active == "Publikasi" ? '#3951A8' : '#8191AC' }"/>
                                            <div class="body-small-semi-bold {active == "Publikasi" ? 'tc-primary-main' : 'tc-dark' }">Publikasi</div>
                                        </div>
                                    </div>
                                    <div class="flex justify-content-center align-items-center">
                                        {#if price}
                                        <CheckLg width=20 height=20 color="#2ECC71"/>
                                        {:else}
                                        <ExclamationLg width=20 height=20 color="#E74C3C"/>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button classList="btn btn-danger" onClick={() => {
                            deleteType = 'course'
                            modalShow = true
                        }}>
                            <div class="flex gap-2 justify-content-center align-items-center">
                                <TrashFill/>
                                Hapus
                            </div>
                        </Button>
                    </div>
                    <div class="col-12 col-md-8 col-xl-9">
                        {#if active == 'Umum'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Umum</div>
                                    <div class="body-small-reguler">Atur judul dan deskripsi materi!</div>
                                </div>

                                <div class="flex-column gap-3">
                                    <InputField labelClass="body-medium-semi-bold" label="Judul" id="title" placeholder="Masukkan judul" 
                                        bind:value={title} rules={[{required: true}]} error={errors ? errors.title ? errors.title : '' : ''}/>

                                    <InputField labelClass="body-medium-semi-bold" type="tinymce" label="Deskripsi" id="description" 
                                        bind:value={description} rules={[{ required: true }]} 
                                        error={errors ? errors.description ? errors.description : '' : '' }/>

                                    <div class="flex-column gap-2">
                                        <label for="" class="body-medium-semi-bold">Fasilitas Pembelajaran</label>
                                        {#each facilities as facility, index}
                                        <div class="flex gap-2 align-items-center">
                                            <InputField id="facility-{index+1}" containerClass="w-100"
                                                placeholder="Masukkan fasilitas pembelajaran"
                                                bind:value={facilities[index].text} rules={[{ required: true }]} 
                                                error={errors ? errors[`description.${index}`] ? errors[`description.${index}`] : '' : '' }/>
                                            {#if facilities.length > 1}
                                            <Button classList="btn btn-no-padding" onClick={() => {
                                                facilities = facilities.filter(elm => elm.order != facility.order)
                                            }}>
                                                <div class="flex align-items-center px-2">
                                                    <X/>
                                                </div>
                                            </Button>
                                            {/if}
                                        </div>
                                        {/each}
                                        <div class="flex justify-content-center">
                                            <Button classList="btn btn-main-outline" onClick={() => {
                                                facilities[facilities.length] = {order: facilities[facilities.length-1].order + 1, text: ""}
                                            }}>
                                                <div class="flex gap-2 align-items-center">
                                                    <PlusLg/>
                                                    Tambah Fasilitas
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {#if title != detail.title || description != detail.description || compareArrays(facilities, detail.facilities)}
                                <div class="flex justify-content-end gap-2">
                                    <Button classList="btn btn-main-outline" onClick={() => {
                                        title = detail.title
                                        description = detail.description
                                        facilities = JSON.parse(JSON.stringify(detail.facilities))
                                    }}>Batal</Button>
                                    <Button disabled={title && description ? false : true} 
                                    classList="btn btn-main" onClick={() => handleSubmit('General')}>Simpan</Button>
                                </div>
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Thumbnail'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">

                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Thumbnail</div>
                                    <div class="body-small-reguler">
                                        <ul class="my-0">
                                            <li>Unggah file gambar JPG atau PNG (rasio gambar 4:3 maksimal 500kb)</li>
                                            <li>Opsional, apabila tidak mengunggah apapun, maka menggunakan gambar default.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="px-8">
                                    {#if isChangingThumbnail}
                                    <Dropzone bind:file={thumbnail_file} />
                                    {:else}
                                    <Dropzone bind:file={thumbnail_file} bind:url={thumbnail_url} />
                                    {/if}
                                </div>

                                {#if isChangingThumbnail}
                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" onClick={() => handleSubmit('Thumbnail')}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => isChangingThumbnail = false}>Batal</Button>
                                </div>
                                {:else}
                                <div class="flex justify-content-center gap-2">
                                    <Button classList='btn pt-0' onClick={() => {
                                        isChangingThumbnail = true
                                    }}>
                                        <div class="flex tc-primary-main justify-content-center align-items-center gap-2">
                                            <PencilFill />
                                            Ubah
                                        </div>
                                    </Button>
                                </div>
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Pemateri'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Pemateri</div>
                                    <div class="body-small-reguler">Atur pemateri untuk materi {title} dibawah ini!</div>
                                </div>

                                <div class="flex-column gap-2">
                                    {#if !detail.teacher}
                                    <div class="body-small-reguler">Belum ada Pemateri untuk Materi ini!</div>
                                    {:else}
                                    <div class="flex align-items-center p-3 justify-content-between 
                                        neutral-border radius-md">
                                        <div class="flex gap-2 align-items-center">
                                            <PersonFill width=15 height=15 />
                                            <div class="body-small-semi-bold">{ detail.teacher.info.fullname }</div>    
                                        </div>
                                        <Button classList="btn btn-no-padding" onClick={removeTeacher}>
                                            <div class="flex align-items-center">
                                                <Trash width=15 height=15/>
                                            </div>
                                        </Button>
                                    </div>
                                    {/if}
                                    {#if !teacherListExpand}
                                    <Button classList="btn btn-neutral-outline" onClick={() => teacherListExpand = true}>
                                        <div class="flex body-small-semi-bold tc-dark justify-content-center align-items-center gap-2">
                                            <PencilFill/>
                                            {#if detail.teacher}
                                            Ubah Pemateri
                                            {:else}
                                            Atur Pemateri
                                            {/if}
                                        </div>
                                    </Button>
                                    {/if}
                                </div>

                                {#if teacherListExpand}
                                    {#if teachers && teachers.length > 0}
                                        <div class="flex-column gap-2">
                                            <div class="body-small-reguler">Pilih pemateri dibawah ini!</div>
                                            {#each teachers as item}
                                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                                            <div on:click={() => {
                                                if(!selected_teacher){
                                                    selected_teacher = item
                                                }else{
                                                    selected_teacher = selected_teacher == item ? null : item
                                                }
                                            }} 
                                                class="flex align-items-center p-3 gap-2 radius-md teacher-data
                                                {selected_teacher && selected_teacher.id == item.id ? 'success-border' : 'neutral-border'}">
                                                <PersonFill width=15 height=15 />
                                                <div class="body-small-semi-bold">{ item.info.fullname }</div>
                                            </div>
                                            {/each}
                                        </div>
                                    {:else}
                                        <div class="flex justify-content-center align-items-center h-100">
                                            <div class="flex-column align-items-center justify-content-center gap-3">
                                                <Hourglass width=60 height=60 color="#3951A8"/>
                                                <div class="caption-reguler tc-neutral-disabled">Data tidak ditemukan...</div>
                                            </div>
                                        </div>
                                    {/if}
                                {/if}

                                {#if teacherListExpand}
                                <div class="flex justify-content-between align-items-center">
                                    <div class="body-small-reguler">
                                        {#if !detail.teacher && selected_teacher}
                                            Atur {selected_teacher.info.fullname} sebagai pemateri {detail.title}?
                                        {:else}
                                            {#if selected_teacher != detail.teacher}
                                                Ganti Pemateri {detail.teacher.info.fullname} menjadi {selected_teacher.info.fullname}?
                                            {/if}
                                        {/if}
                                    </div>
                                    <div class="flex gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => {
                                            selected_teacher = detail.teacher
                                            teacherListExpand = false
                                        }}>Batal</Button>
                                        <Button classList="btn btn-main" onClick={() => handleSubmit('Teacher')}>Simpan</Button>
                                    </div>
                                </div>
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Harga'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex-column gap-1">
                                    <div class="body-large-semi-bold">Harga</div>
                                    <div class="body-small-reguler">Masukkan harga di bawah ini.</div>
                                </div>
                                
                                <InputField prefix="Rp." labelClass="body-medium-semi-bold" type="number" id="price" 
                                    placeholder = "Masukkan nominal harga"
                                    label="Harga" bind:value={price}
                                    error={errors ? errors.price ? errors.price : '' : '' }/>
                                
                                {#if price != detail.price}
                                <div class="flex-row-reverse gap-2">
                                    <Button classList="btn btn-main" disabled={price ? false : true} onClick={() => handleSubmit('Price')}>Simpan</Button>
                                    <Button classList="btn btn-main-outline" onClick={() => price = detail.price}>Batal</Button>
                                </div>
                                {/if}
                            </div>
                        </div>
                        {:else if active == 'Submateri'}
                        <div class="card radius-sm" transition:fly={{ delay: 250, duration: 300, y: 100, opacity: 0, easing: quintOut }}>
                            <div class="card-body gap-4">
                                <div class="flex justify-content-between align-items center">
                                    <div class="flex-column gap-1">
                                        <div class="body-large-semi-bold">Submateri</div>
                                        <div class="body-small-reguler">Masukkan submateri dengan rinci dan jelas</div>
                                    </div>
                                    {#if !exam}
                                    <Button type="link" href="/superadmin/course/{id}/exam" classList="btn btn-main-outline">Tambah Ujian</Button>
                                    {/if}
                                </div>

                                <div class="flex-column gap-2">
                                    <label class="body-medium-semi-bold" for="datalist">Judul</label>
                                    <div class="flex-column gap-3" id="datalist">
                                        <div class="flex-column gap-3" use:dragHandleZone={{ items, flipDurationMs }} on:consider={handleDndConsider} on:finalize="{handleSort}">
                                            {#if itemStatus}
                                            {#each items as item, index (item.id)}
                                            <div class="flex-column gap-2" animate:flip="{{ duration: flipDurationMs }}">
                                                <div class="flex gap-2 align-items-center">
                                                    <div class="px-2 flex align-items-center" 
                                                        use:dragHandle aria-label="drag-handle for {item.id}"
                                                        style="cursor: grab;">
                                                        <List/>
                                                    </div>
                                                    <div id="course-{index}" class="flex w-100 align-items-center p-3 gap-3 radius-md neutral-border bg-neutral-white">
                                                        {#if item.type == 'Video'}
                                                        <PlayCircle/>
                                                        {:else if item.type == 'Quiz'}
                                                        <FileEarmarkText/>
                                                        {/if}
                                                        <div class="body-small-semi-bold">{ item.title }</div>
                                                    </div>
                                                    <div class="flex gap-3 px-2">
                                                        <Button type="link" href="/superadmin/course/{id}/{item.type.toLowerCase()}/{item.id}" classList="btn btn-no-padding">
                                                            <div class="flex justify-content-center align-items-center">
                                                                <PencilSquare/>
                                                            </div>
                                                        </Button>    
                                                        <Button classList="btn btn-no-padding" onClick={() => {
                                                            deleteType = 'item'
                                                            selectedItem = item
                                                            modalShow = true
                                                        }}>
                                                            <div class="flex justify-content-center align-items-center">
                                                                <Trash/>
                                                            </div>
                                                        </Button>    
                                                    </div>
                                                </div>
                                            </div>
                                            {/each}
                                            {/if}
                                        </div>

                                        {#if exam}
                                        <div class="flex-column gap-2">
                                            <div class="flex gap-2 align-items-center">
                                                <div class="px-2 flex align-items-center tc-neutral-white">
                                                    <List/>
                                                </div>
                                                <div id="course-exam" class="flex w-100 align-items-center p-3 gap-3 radius-md neutral-border bg-neutral-white">
                                                    <Pass/>
                                                    <div class="body-small-semi-bold">{ exam.title }</div>
                                                </div>
                                                <div class="flex gap-3 px-2">
                                                    <Button type="link" href="/superadmin/course/{id}/exam/{exam.id}" classList="btn btn-no-padding">
                                                        <div class="flex justify-content-center align-items-center">
                                                            <PencilSquare/>
                                                        </div>
                                                    </Button>    
                                                    <Button classList="btn btn-no-padding" onClick={() => {
                                                        deleteType = 'item'
                                                        selectedItem = exam
                                                        modalShow = true
                                                    }}>
                                                        <div class="flex justify-content-center align-items-center">
                                                            <Trash/>
                                                        </div>
                                                    </Button>    
                                                </div>
                                            </div>
                                        </div>
                                        {/if}

                                        {#if addItem}
                                        <div class="flex-column gap-2">
                                            <div class="flex gap-2 align-items-center">
                                                <div class="px-2 flex align-items-center tc-neutral-white">
                                                    <List/>
                                                </div>
                                                <div class="flex-column w-100 gap-2">
                                                    <div class="flex gap-2 align-items-center">
                                                        <InputField id="input-title" bind:value={newItem} containerClass="w-100" placeholder="Masukkan judul submateri"/>
                                                        <Button classList="btn py-0 px-2" onClick={() => {
                                                            newItem = ""
                                                            addItem = false
                                                        }}>
                                                            <div class="flex align-items-center">
                                                                <X/>
                                                            </div>
                                                        </Button>
                                                    </div>
                                                    <div class="row justify-content-center gap-2">
                                                        <div class="col-3 px-0">
                                                            <Button type="link" href="/superadmin/course/{id}/video{newItem ? `?title=${newItem}` : ''}" classList="btn btn-neutral-outline-disabled w-100">Video</Button>
                                                        </div>
                                                        <div class="col-3 px-0">
                                                            <Button type="link" href="/superadmin/course/{id}/quiz{newItem ? `?title=${newItem}` : ''}" classList="btn btn-neutral-outline-disabled w-100">Kuis</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/if}
                                    </div>
                                </div>

                                {#if !addItem}
                                <div class="flex justify-content-start">
                                    <Button classList="btn btn-main-outline pl-4" onClick={() => addItem = true}>
                                        <div class="flex align-items-center justify-content-center gap-2">
                                            <PlusLg/>
                                            <div>Tambah</div>
                                        </div>
                                    </Button>
                                </div>
                                {/if}
                            </div>
                        </div>
                        {/if}
                    </div>  
                </div>
                {/if}
            </div>
        </main>
    </div>
</div>

{#if modalShow}
    <Modal bind:modalShow>
        <div class="card-body gap-5">
            {#if deleteType == 'course'}
            <div class="flex-column">
                <div class="h4">Hapus Alur Belajar</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus alur belajar {detail.title}? Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={deleteCourse}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => modalShow = false}>Tidak</Button>
            </div>
            {:else if deleteType == 'item'}
            {#if selectedItem.type == 'Video'}
            <div class="flex-column">
                <div class="h4">Hapus Video</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus video {selectedItem.title}? 
                    Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            {:else if selectedItem.type == 'Quiz'}
            <div class="flex-column">
                <div class="h4">Hapus Kuis</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus kuis {selectedItem.title}? 
                    Seluruh daftar soal pada kuis ini akan dihapus. 
                    Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            {:else if selectedItem.type == 'Exam'}
            <div class="flex-column">
                <div class="h4">Hapus Ujian</div>
                <div class="default-text-input">
                    Apakah anda yakin ingin menghapus alur belajar {selectedItem.title}? 
                    Seluruh daftar soal pada ujian ini akan dihapus. 
                    Proses ini tidak dapat dibatalkan!
                </div>
            </div>
            {/if}
            <div class="flex-row-reverse gap-2">
                <Button classList="btn btn-danger" onClick={() => deleteItem(selectedItem.type, selectedItem.id)}>Ya, hapus!</Button>
                <Button classList="btn btn-main-outline" onClick={() => {
                    selectedItem = null
                    modalShow = false
                }}>Tidak</Button>
            </div>
            {/if}
        </div>  
    </Modal> 
{/if}

<svelte:head>
    <title>{ title ? "Materi " + title : 'Loading' }</title>

    <style>
        .row-menu-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            cursor: pointer;
            border-radius: 4px;
            transition: all .25s ease;
        }
    
        .row-menu-container:hover{
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            background-color: var(--hover);
        }
    
        .row-menu-active::before{
            border-color: var(--primary-main) !important;
        }
    
        .row-menu::before{
            content: "";
            height: 90%;
            border-radius: 3px;
            border: 2px solid transparent;
        }
    
        .teacher-data:hover{
            cursor: pointer;
        }
    </style>
</svelte:head>