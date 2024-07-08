let now = new Date()
let days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
let dayName = days[now.getDay()]
let monthName = months[now.getMonth()]
let dayOfMonth = now.getDate()
let year = now.getFullYear()
let hours = now.getHours()
let minutes = now.getMinutes()
let amOrPm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;

const addLeadingZero = (num) => (num < 10 ? '0' + num : num)
let formattedTime = `${addLeadingZero(hours)}.${addLeadingZero(minutes)} ${amOrPm}`

const getCurrentDay = () => {
    return `${dayName}, ${dayOfMonth} ${monthName} ${year}`
}

const getCurrentTime = (date = null) => {
    if(date){
        now = new Date(date)
        hours = now.getHours()
        minutes = now.getMinutes()
        amOrPm = hours >= 12 ? 'PM' : 'AM';
        formattedTime = `${addLeadingZero(hours)}.${addLeadingZero(minutes)} ${amOrPm}`
    }
    
    return `${formattedTime}`
}

const getDay = (date) => {
    now = new Date(date)
    dayName = days[now.getDay()]
    dayOfMonth = now.getDate()
    monthName = months[now.getMonth()]
    year = now.getFullYear()
    return `${dayName}, ${dayOfMonth} ${monthName} ${year}`
}

export { getCurrentDay, getCurrentTime, getDay }