import { extract, destroyCookie } from "./Cookie";
import { setFlash } from "./Flash";

const checkLogin = (role = null, roleCheck = true) => {
    let user = extract('datas')
        
    if(!user){
        return setFlash({ title: 'Oops', message: "Harap login terlebih dahulu!", type: 'danger', redirect: '/' })
    }

    if(roleCheck){
        if(role && user.role != role){
            destroyCookie('datas')
            return setFlash({ title: 'Oops', message: "Anda tidak berwenang, silahkan login ulang dengan akun yang sesuai!", type: 'warning', redirect: '/' })
        }
    }

    return user
}

export default checkLogin