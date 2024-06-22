import { goto } from "$app/navigation"

const setFlash = (flash) => {
    sessionStorage.setItem('flashTitle', flash.title)
    sessionStorage.setItem('flashMessage', flash.message)
    sessionStorage.setItem('flashType', flash.type)

    return goto(flash.redirect)
}

const getFlash = () => {
    let title = sessionStorage.getItem('flashTitle')
    let message = sessionStorage.getItem('flashMessage')
    let type = sessionStorage.getItem('flashType')

    if(!message || !type || !title){
        return null
    }

    sessionStorage.removeItem('flashTitle');
    sessionStorage.removeItem('flashMessage');
    sessionStorage.removeItem('flashType');

    return { title, message, type }
}

export { setFlash, getFlash }