const extract = () => {
    const data = document.cookie.replace(/(?:(?:^|.*;\s*)userData\s*=\s*([^;]*).*$)|^.*$/, "$1");

    if(data){
        return JSON.parse(data)
    }

    return false
}

const setCookie = (name, datas) => {
    return document.cookie = `${name}=${datas}; path=/; domain=localhost; expires=${new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).toGMTString()}`
}

export { extract, setCookie }