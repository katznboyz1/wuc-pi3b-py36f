var _24HRTime = false;

function updateClock() {
    let date = new Date();

    // ditigal clock update
    document.getElementById('time-hour').innerHTML = _24HRTime ? String(date.getHours()) : String(date.getHours() % 12);
    document.getElementById('time-minute').innerHTML = String((date.getMinutes() < 10) ? '0' + String(date.getMinutes()) : date.getMinutes());
    document.getElementById('time-second').innerHTML = String((date.getSeconds() < 10) ? '0' + String(date.getSeconds()) : date.getSeconds());
    document.getElementById('time-am-pm').innerHTML = !_24HRTime ? String((date.getHours() >= 12) ? 'PM' : 'AM') : '';
    document.getElementById('time').style.fontSize = _24HRTime ? '20vw' : '14vw';
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
            document.body.style.transform = responseJSON['screenFlipped'] ? 'rotateX(180deg) scaleX(-1)' : '';
            document.getElementById('address').innerHTML = responseJSON['address'];
            document.getElementById('time-date-parent-container').style.display = responseJSON['analogMode'] ? 'none' : 'block';
            document.getElementById('analog-clock').style.display = responseJSON['analogMode'] ? 'block' : 'none';
            foregroundColor = responseJSON['darkMode'] ? responseJSON['darkmodeFGColor'] : responseJSON['lightmodeFGColor'];
            _24HRTime = responseJSON['24HRTime'];
        }
    });
}

window.onload = function () {
    window.setInterval(updateClock, 250)
}