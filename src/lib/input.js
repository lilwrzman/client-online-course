const clearInput = (ids) => {
    ids.forEach((id) => {
        document.getElementById(id).value = ""
    })
}

const getValue = (ids) => {
    const datas = {}

    ids.forEach(id => {
        datas[id] = document.getElementById(id).value
    })

    return datas
}

const validateInput = (value, rules) => {
    let errors = [];

    for (let rule of rules) {
        if (rule.required && !value) {
            errors.push(rule.message || 'Harap isi data ini!');
        }

        if (rule.min && value.length < rule.min) {
            errors.push(rule.message || `Minimal panjang karakter adalah ${rule.min}!`);
        }

        if (rule.max && value.length > rule.max) {
            errors.push(rule.message || `Maksimum panjang karakter adalah ${rule.max}!`);
        }

        if (rule.type && rule.type == 'email') {
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
                errors.push(rule.message || 'Mohon masukkan email yang valid!');
            }
        }

        if (rule.type && rule.type == 'password') {
            if(!/^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(value)){
                errors.push(rule.message || 'Password harus terdiri dari 8-16 karakter dan terdapat setid
                    aknya satu huruf dan satu angka!');
            }
        }
    }

    return errors
}

export { clearInput, getValue, validateInput }
