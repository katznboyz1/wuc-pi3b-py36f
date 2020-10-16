let isClockOn = true;

//sends a request to the server that will either turn the clock on or off
function toggleClockOnOff() {
    isClockOn = !isClockOn;
    console.log('DEBUG: Turning clock ' + String((isClockOn) ? 'on' : 'off'));
}