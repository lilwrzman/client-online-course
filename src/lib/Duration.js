const formatTime = (timeString) => {
    const parts = timeString.split(':')
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);

    let formattedTime = [];

    if (hours > 0) {
        formattedTime.push(hours + ' jam');
    }

    if (minutes > 0) {
        formattedTime.push(minutes + ' menit');
    }
    
    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        formattedTime.push(seconds + ' detik');
    }

    return formattedTime.join(' ');
}

export default formatTime