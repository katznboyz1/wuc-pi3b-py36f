var _24HRTime = false;
var FGColor = 'white';

function calculateAngledLineEdge(originX, originY, radius, degrees) {
    degrees -= 90;
    return [
        originX + radius * Math.cos(Math.PI * degrees / 180.0),
        originY + radius * Math.sin(Math.PI * degrees / 180.0)
    ];
}

function drawAngledCanvasLine(originX, originY, ctx, radius, angleDegrees, color) {
    ctx.strokeStyle = color;
    let endsOfLines = calculateAngledLineEdge(originX, originY, radius, angleDegrees);
    ctx.moveTo(originX, originY);
    ctx.lineTo(endsOfLines[0], endsOfLines[1]); // from https://stackoverflow.com/a/23598710
    ctx.stroke();
    ctx.strokeStyle = 'white';
    return endsOfLines;
}

function updateClock() {
    let date = new Date();

    // ditigal clock update
    document.getElementById('time-hour').innerHTML = _24HRTime ? String((date.getHours() < 10) ? '0' + String(date.getHours()) : date.getHours()) : String((date.getHours() == 0 || date.getHours() == 12) ? '12' : String(date.getHours() % 12))
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

    // analog clock update
    let canvas = document.getElementById('clock-canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let clockRadius = canvas.width / 2;
    drawAngledCanvasLine(canvas.width / 2, canvas.height / 2, ctx, clockRadius * 1, ((date.getSeconds() / 60) * 360), FGColor);
    drawAngledCanvasLine(canvas.width / 2, canvas.height / 2, ctx, clockRadius * 0.75, (date.getMinutes() * 6), FGColor);
    drawAngledCanvasLine(canvas.width / 2, canvas.height / 2, ctx, clockRadius * 0.5, (((date.getHours() % 12) / 12) * 360), FGColor);

    // draw the clock ticks for the analog clock
    for (tick = 0; tick < 60; tick++) {
        let degree = 90 + ((tick / 60) * 360);
        let rayCastEdge = calculateAngledLineEdge(canvas.width / 2, canvas.height / 2, tick % 15 == 0 ? clockRadius * 0.8 : clockRadius * 0.9, degree) //drawAngledCanvasLine(canvas.width / 2, canvas.height / 2, ctx, clockRadius * 0.9, degree, 'rgba(0, 0, 0, 0)');
        drawAngledCanvasLine(rayCastEdge[0], rayCastEdge[1], ctx, tick % 15 == 0 ? clockRadius * 0.2 : clockRadius * 0.1, degree, '#ffffff');
    }

    $.ajax({ // no error handling, just let it fail silently as to not interrupt the kiosk
        'type':'POST',
        'dataType':'json',
        'url':'/settingsAPIDownload.json',
        'timeout':1000, //make sure that if the server is down then this will fail
        'beforeSend':function() {
        },'complete':function(response) {
            let responseJSON = response.responseJSON;
            _24HRTime = responseJSON['24HRTime'];
            FGColor = responseJSON['darkMode'] ? responseJSON['darkmodeFGColor'] : responseJSON['lightmodeFGColor'];
            document.getElementById('loading-screen').style.display = 'none';
            document.body.style.backgroundColor = responseJSON['darkMode'] ? responseJSON['darkmodeBGColor'] : responseJSON['lightmodeBGColor'];
            document.body.style.color = responseJSON['darkMode'] ? responseJSON['darkmodeFGColor'] : responseJSON['lightmodeFGColor'];
            document.body.style.transform = responseJSON['screenFlipped'] ? 'rotateX(180deg) scaleX(-1)' : '';
            document.getElementById('address').innerHTML = responseJSON['address'];
            document.getElementById('time-date-parent-container').style.display = responseJSON['analogMode'] ? 'none' : 'block';
            document.getElementById('analog-clock').style.display = responseJSON['analogMode'] ? 'block' : 'none';
            foregroundColor = responseJSON['darkMode'] ? responseJSON['darkmodeFGColor'] : responseJSON['lightmodeFGColor'];
        }
    });
}

window.onload = function () {
    window.setInterval(updateClock, 250);
}