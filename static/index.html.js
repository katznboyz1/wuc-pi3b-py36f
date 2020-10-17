let isClockOn = true;

let clockElement = document.getElementById('index-clock-container');
let clockTextElement = document.getElementById('index-clock-text');

function networkError() {
    alert('Server Error')
}

// sends a request to the server that will either turn the clock on or off
// will only update server side if the updateServer argument is true
function toggleClockOnOff(updateServer) {
    isClockOn = !isClockOn;
    clockTextElement.innerHTML = String((isClockOn) ? 'ON' : 'OFF');
    if (updateServer) {
        $.ajax({
            'type':'POST',
            'url':'/clockOnOffToggleAPI',
            'dataType':'json',
            'contentType':'application/json',
            'data':JSON.stringify([isClockOn]),
            'error':networkError,
            'timeout':1000, //make sure that if the server is down then this will fail
            'beforeSend':function() {
                document.getElementById('loading-screen').style.display = 'block';
            },'complete':function() {
                document.getElementById('loading-screen').style.display = 'none';
            }
        });
    }
}

window.onload = function() {
    $.ajax({
        'type':'POST',
        'dataType':'json',
        'url':'/settingsAPIDownload.json',
        'error':networkError,
        'timeout':1000, //make sure that if the server is down then this will fail
        'beforeSend':function() {
            document.getElementById('loading-screen').style.display = 'block';
        },'complete':function(response) {
            document.getElementById('loading-screen').style.display = 'none';
            let responseJSON = response.responseJSON;

            // to update the text on the homepage, set isClockOn to the opposite of the actual clocks statis, then run the clock toggle function (which will reverse the change, this making isClockOn the proper value again) to update the text
            isClockOn = !responseJSON['displayOn'];
            toggleClockOnOff(false);
        }
    });
}