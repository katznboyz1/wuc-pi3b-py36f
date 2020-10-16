let isClockOn = true;

let clockElement = document.getElementById('index-clock-container');
let clockTextElement = document.getElementById('index-clock-text');

//sends a request to the server that will either turn the clock on or off
function toggleClockOnOff() {
    isClockOn = !isClockOn;
    clockTextElement.innerHTML = String((isClockOn) ? 'ON' : 'OFF');
}