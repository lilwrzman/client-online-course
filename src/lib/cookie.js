import { PUBLIC_KEY } from "$env/static/public"
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const extract = (name) => {
    const cookie = Cookies.get(name)
    try{
        let result = null
        if(cookie){
            const decrypted = CryptoJS.AES.decrypt(cookie, PUBLIC_KEY).toString(CryptoJS.enc.Utf8)
            result = JSON.parse(decrypted)
        }
        
        return result ? result : null
    }catch(err){
        console.error(err)
        return null
    }
}

const setCookie = (name, datas) => {
    const encrypted = CryptoJS.AES.encrypt(datas, PUBLIC_KEY)
    return Cookies.set(name, encrypted, {expires: 7, path:'/'})
}

const destroyCookie = (name) => {
    return Cookies.remove(name, {path: '/'})
}

export { extract, setCookie, destroyCookie }