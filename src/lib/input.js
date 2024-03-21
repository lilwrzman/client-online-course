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
            errors.push(rule.message || 'This field is required');
        }

        if (rule.min && value.length < rule.min) {
            errors.push(rule.message || `Minimum length is ${rule.min}`);
        }

        if (rule.max && value.length > rule.max) {
            errors.push(rule.message || `Maximum length is ${rule.max}`);
        }

        if (rule.type && rule.type == 'email') {
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
                errors.push(rule.message || 'Please enter a valid email address');
            }
        }

        if (rule.type && rule.type == 'password') {
            if(!/^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/.test(value)){
                errors.push(rule.message || 'Password must be 8-16 characters long and contain at least one letter and one number');
            }
        }
    }

    return errors
}

export { clearInput, getValue, validateInput }
