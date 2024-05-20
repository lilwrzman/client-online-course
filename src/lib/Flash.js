import { goto } from "$app/navigation"

const setFlash = (flash) => {
    sessionStorage.setItem('flashMessage', flash.message)
    sessionStorage.setItem('flashType', flash.type)

    goto(flash.redirect)
}

const getFlash = () => {
    let message = sessionStorage.getItem('flashMessage')
    let type = sessionStorage.getItem('flashType')

    if(!message || !type){
        return null
    }

    sessionStorage.removeItem('flashMessage');
    sessionStorage.removeItem('flashType');

    return { message, type }
}

export { setFlash, getFlash }