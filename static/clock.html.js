function updateClock() {
    let date = new Date();
    document.getElementById('time-hour').innerHTML = String(date.getHours());
    document.getElementById('time-minute').innerHTML = String(date.getMinutes());
    document.getElementById('time-second').innerHTML = String((date.getSeconds() < 10) ? '0' + String(date.getSeconds()) : date.getSeconds());
    document.getElementById('date').innerHTML = String(
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] +
        ' ' +
        String(date.getDate()) +
        ', ' +
        ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()] +
        ' ' +
        String(date.getFullYear())
    );
    $.ajax({ // no error handling, just let it fail silently as to not interrupt the kiosk
        'type':'POST',
        'dataType':'json',
        'url':'/settingsAPIDownload.json',
        'timeout':1000, //make sure that if the server is down then this will fail
        'beforeSend':function() {
        },'complete':function(response) {
            let responseJSON = response.responseJSON;
            document.body.style.backgroundColor = responseJSON['darkMode'] ? responseJSON['darkmodeBGColor'] : responseJSON['lightmodeBGColor'];
            document.body.style.color = responseJSON['darkMode'] ? responseJSON['darkmodeFGColor'] : responseJSON['lightmodeFGColor'];
            document.body.style.transform = responseJSON['screenFlipped'] ? 'rotate(180deg)' : '';
            document.body.style.marginTop = responseJSON['screenFlipped'] ? '-100vh' : '';
            document.getElementById('address').innerHTML = responseJSON['address'];
        }
    });
}

window.onload = function () {
    window.setInterval(updateClock, 250)
}