function updateClock() {
    let date = new Date();
    document.getElementById('time-hour').innerHTML = String(date.getHours());
    document.getElementById('time-minute').innerHTML = String(date.getMinutes());
    document.getElementById('time-second').innerHTML = String(date.getSeconds());
    document.getElementById('date').innerHTML = String(
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] +
        ' ' +
        String(date.getDate()) +
        ', ' +
        ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()] +
        ' ' +
        String(date.getFullYear())
    );
}

window.onload = function () {
    updateClock();
}