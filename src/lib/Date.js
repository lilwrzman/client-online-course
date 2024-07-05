let now = new Date()
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const dayName = days[now.getDay()]
const monthName = months[now.getMonth()]
const dayOfMonth = now.getDate()
const year = now.getFullYear()
let hours = now.getHours()
const minutes = now.getMinutes()
const amOrPm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;

const addLeadingZero = (num) => (num < 10 ? '0' + num : num)
let formattedTime = `${addLeadingZero(hours)}.${addLeadingZero(minutes)} ${amOrPm}`

const getCurrentDay = () => {
    return `${dayName}, ${dayOfMonth} ${monthName} ${year}`
}

const getCurrentTime = (date = null) => {
    if(date){
        now = new Date(date)
        formattedTime = `${addLeadingZero(hours)}.${addLeadingZero(minutes)} ${amOrPm}`
    }
    
    return `${formattedTime}`
}

const getDay = (date) => {
    now = new Date(date)
    return `${dayName}, ${dayOfMonth} ${monthName} ${year}`
}

export { getCurrentDay, getCurrentTime, getDay }