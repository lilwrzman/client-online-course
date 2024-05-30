import { extract, destroyCookie } from "./Cookie";
import { setFlash } from "./Flash";

const checkLogin = (role = null) => {
    let user = extract('datas')
        
    if(!user){
        return setFlash({ message: "Harap login terlebih dahulu!", type: 'danger', redirect: '/' })
    }

    if(role && user.role != role){
        destroyCookie('datas')
        return setFlash({ message: "Anda tidak berwenang, silahkan login ulang dengan akun yang sesuai!", type: 'danger', redirect: '/' })
    }

    return user
}

export default checkLogin