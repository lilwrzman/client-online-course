<script>
    import { PUBLIC_SERVER_PATH } from "$env/static/public";
	import ApiController from "$lib/ApiController";
	import checkLogin from "$lib/CheckLogin";
	import { destroyCookie, extract, setCookie } from "$lib/Cookie";
	import { getFlash, setFlash } from "$lib/Flash";
	import Button from "@components/Button.svelte";
	import InputField from "@components/InputField.svelte";
	import Navbar from "@components/Navbar.svelte";
	import Sidebar from "@components/Sidebar.svelte";
	import Spinner from "@components/Spinner.svelte";
	import Tab from "@components/Tab.svelte";
	import Toast from "@components/Toast.svelte";
	import { onMount } from "svelte";

    let toastData
    let toastVisible = false
    let showSpinner = false
    let inputFile

    let user
    let isSidebarOpen = true

    let errors
    let profile
    let fullname, username, email, facebook_name, facebook_url, instagram_name, instagram_url, avatar_url, avatar_file, bio
    let facebook = {}, instagram = {}

    const changeAvatar = () => {
        if(!avatar_file){
            return alert("Mohon pilih foto profil!")
        } 

        let formData = new FormData()
        formData.append("avatar_file", avatar_file)

        showSpinner = true
        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/update/avatar",
            data: formData,
            authToken: user.token
        }).then(response => {
            if(response.status){
                getProfile(() => {
                    return setFlash({ 
                        title: 'Berhasil',
                        message: response.message, 
                        type: 'success', redirect: "/teacher/settings/profile"
                    })
                })
            }
        }).catch(e => {
            let error = e.response.data
            showSpinner = false

            console.error(error)

            if(error.error){
                errors = error.error
            }
        })
    }

    const handleSubmit = () => {
        showSpinner = true

        let fd = new FormData()
        fd.append("fullname", fullname)
        fd.append("username", username)
        fd.append("email", email)
        fd.append("bio", bio)

        if(facebook_name){
            if(!facebook_url){
                errors.facebook_url = "Harap isi data ini!"
                return 
            }

            fd.append("facebook_name", facebook_name)
            fd.append("facebook_url", facebook_url)
        }

        if(instagram_name){
            if(!instagram_url){
                errors.instagram_url = "Harap isi data ini!"
                return 
            }

            fd.append("instagram_name", instagram_name)
            fd.append("instagram_url", instagram_url)
        }

        ApiController.sendRequest({
            method: "POST",
            endpoint: "account/update",
            data: fd,
            authToken: user.token
        }).then(response => {
            if(response.error){
                showSpinner = false
                errors = response.error
                return
            }

            if(response.status){
                getProfile(() => {
                    return setFlash({ 
                        title: 'Berhasil',
                        message: response.message, 
                        type: 'success', redirect: "/teacher/settings/profile"
                    })
                })
            }
        }).catch(e => {
            let error = e.response.data
            showSpinner = false

            if(error.error){
                errors = error.error
            }
        })
    }

    const getProfile = (callback = null) => {
        ApiController.sendRequest({
            method: "GET",
            endpoint: "profile",
            authToken: user.token
        }).then(response => {
            if(response.status){
                profile = response.data
                username = profile.username
                email = profile.email
                fullname = profile.info.fullname
                bio = profile.info.bio

                if(profile.info.social_media.length > 0){
                    profile.info.social_media.map(elm => {
                        if(elm.type == 'Facebook') {
                            facebook = elm
                            facebook_name = elm.username
                            facebook_url = elm.url
                        }else if(elm.type == 'Instagram'){
                            instagram = elm
                            instagram_name = elm.username
                            instagram_url = elm.url
                        }
                    })
                }else{
                    facebook.username = ""
                    facebook.url = ""
                    instagram.username = ""
                    instagram.url = ""
                }

                let kuki = extract('datas')
                kuki.username = response.data.username
                kuki.avatar = profile.avatar
                setCookie('datas', JSON.stringify(kuki))

                if(callback != null && typeof callback === 'function'){
                    callback()
                }
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
        
        user = checkLogin("Teacher", true)

        getProfile()
    })

</script>

<div class="flex">
    <Sidebar active="else" role="Teacher" bind:isSidebarOpen={isSidebarOpen} />
    <div class="neutral-wrapper px-3">
        <Navbar active="" variant="inside" pageTitle="Pengaturan Akun"  bind:isSidebarOpen={isSidebarOpen}/>
        <main style="flex-grow: 1; overflow-y: hidden;" class="flex-column">
            <div class="container flex-column py-4 gap-4" style="flex-grow: 1;">
                {#if toastVisible}
                    <Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
                {/if}

                {#if showSpinner}
                    <Spinner/>
                {/if}
                <div class="card p-standard radius-sm">
                    <div class="card-body gap-4">
                        <Tab type="link" menus={[
                            {title: "Profil", href: "/teacher/settings/profile", active: true},
                            {title: "Kata Sandi", href: "/teacher/settings/password", active: false}
                        ]} />

                        <div class="row">
                            <div class="col-12 col-md-8">
                                <div class="flex-column gap-4">
                                    {#if profile}
                                    <div class="flex-column gap-3">
                                        <InputField id="fullname" bind:value={fullname} 
                                            inputClass="input-bg-light"
                                            labelClass="body-medium-semi-bold" 
                                            label="Nama Lengkap" placeholder="Masukkan nama lengkap anda" 
                                            rules={[{ required: true }]} 
                                            error={errors ? errors.fullname ? errors.fullname : '' : '' }/>

                                        <InputField id="username" bind:value={username}
                                            inputClass="input-bg-light"
                                            labelClass="body-medium-semi-bold"
                                            label="Username" placeholder="Masukkan username anda"
                                            rules={[{required: true}]}
                                            error={errors ? errors.username ? errors.username : '' : ''} />
                                    
                                        <div class="flex-column">
                                            <label for="email" class="body-medium-semi-bold">Email</label>
                                            <p class="default-text-input p-standard">
                                                {email}
                                            </p>
                                        </div>

                                        <div class="flex-column gap-2">
                                            <div class="body-medium-semi-bold">Media Sosial</div>
                                            <div class="card neutral-border">
                                                <div class="card-body gap-3">
                                                    <div class="flex gap-2">
                                                        <InputField labelClass="body-small-semi-bold" bind:value={facebook_name}
                                                            placeholder="Nama akun Facebook pemateri" containerClass="w-100"
                                                            label="Akun Facebook" id="facebook_name" inputClass="input-bg-light"/>
    
                                                        <div class="flex-column w-100 gap-1">
                                                            <InputField labelClass="body-small-semi-bold" bind:value={facebook_url}
                                                                placeholder="Link akun Facebook pemateri" containerClass="w-100" inputClass="input-bg-light"
                                                                label="Link Facebook" id="facebook_url" rules={[{ required: facebook_name ? true : false }]}
                                                                error={errors ? errors.facebook_name ? errors.facebook_name : '' : facebook_name && !facebook_url ? 'Harap isi data ini!' : ''}/>
                                                        </div>
                                                    </div>
                                                    <div class="flex gap-2">
                                                        <InputField labelClass="body-small-semi-bold" bind:value={instagram_name}
                                                            placeholder="Nama akun Instagram pemateri" containerClass="w-100"
                                                            label="Akun Instagram" id="instagram_name" inputClass="input-bg-light"/>
    
                                                        <div class="flex-column w-100 gap-1">
                                                            <InputField labelClass="body-small-semi-bold" bind:value={instagram_url}
                                                                placeholder="Link akun Instagram pemateri" containerClass="w-100" inputClass="input-bg-light"
                                                                label="Link Instagram" id="instagram_url" rules={[{ required: instagram_name ? true : false }]}
                                                                error={errors ? errors.instagram_name ? errors.instagram_name : '' : instagram_name && !instagram_url ? 'Harap isi data ini!' : ''}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex-column gap-2">
                                            <label for="bio" class="body-small-semi-bold mb-0">Bio Akun</label>
                                            <textarea bind:value={bio} id="bio" rows="5" placeholder="Masukkan bio akun anda..."></textarea>
                                        </div>
                                    </div>
                                    {#if ((fullname != profile.info.fullname && fullname) || 
                                        (username != profile.username && username) || 
                                        (bio != profile.info.bio && bio) ||
                                        ( facebook_name != facebook.username ) || 
                                        ( facebook_url != facebook.url ) ||
                                        ( instagram_name != instagram.username ) || 
                                        ( instagram_url != instagram.url )) && 
                                        (( facebook_name ? facebook_url : true ) && ( instagram_name ? instagram_url : true ))
                                        ? true : false}
                                    <div class="flex gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => {
                                            fullname = profile.info.fullname
                                            username = profile.username
                                            facebook_name = facebook.username
                                            facebook_url = facebook.url
                                            instagram_name = instagram.username
                                            instagram_url = instagram.url
                                        }}>Batal</Button>
                                        <Button classList="btn btn-main" onClick={handleSubmit}>Simpan</Button>
                                    </div>
                                    {/if}
                                    {/if}
                                </div>
                            </div>
                            {#if user}
                            <div class="col-12 col-md-4">
                                <div class="flex-column align-items-center justify-content-center gap-3">
                                    <div class="flex-column align-items-center justify-content-center gap-2">
                                        <img width="100" height="100" src="{PUBLIC_SERVER_PATH}/storage/{user.avatar}" alt="avatar" id="avatar" />
                                        <p class="body-small-light mb-0">Unggah file gambar JPG atau PNG</p>
                                    </div>
                                    {#if !avatar_file}
                                    <Button classList="btn btn-main-outline" onClick={() => {
                                        inputFile.click()
                                    }}>Pilih Gambar</Button>
                                    {:else}
                                    <div class="flex gap-2">
                                        <Button classList="btn btn-main-outline" onClick={() => {
                                            let avatarContainer = document.getElementById('avatar')
                                            avatarContainer.src = `${PUBLIC_SERVER_PATH}/storage/${user.avatar}`
                                            avatar_file = null
                                        }}>Batal</Button>
                                        <Button classList="btn btn-main" onClick={changeAvatar}>Simpan</Button>
                                    </div>
                                    {/if}
                                    <input bind:this={inputFile} type="file" style="display: none;" on:change={function(evt){
                                        avatar_file = evt.target.files[0]
                                        let avatarContainer = document.getElementById('avatar')

                                        const fileReader = new FileReader()
                                        fileReader.onload = (e) => {
                                            avatarContainer.src = e.target.result
                                        }

                                        fileReader.readAsDataURL(avatar_file)
                                    }} accept="image/*">
                                </div>
                            </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<style>
    #avatar {
        border-radius: 100%;
    }

    textarea {
        border-radius: .25rem;
        background-color: var(--neutral-white) !important;
        border: 1px solid var(--neutral-border);
        padding: .875rem;
        font-family: Poppins;
        font-size: 14px;
        font-weight: 400;
        white-space: normal;
    }

    textarea:focus {
        outline: none;
        border: 1px solid var(--neutral-border);
    }
</style>