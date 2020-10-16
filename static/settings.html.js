function sendSettingsUpdateRequestError() {
    alert('err')
}

function sendSettingsUpdateRequest() {
    $.ajax({
        'type':'POST',
        'url':'/settingsAPI',
        'dataType':'json',
        'contentType':'application/json',
        'data':JSON.stringify({
            'analogMode':document.getElementById('settings-analog-mode-toggle').checked,
            'darkMode':document.getElementById('settings-dark-mode-toggle').checked
        }),
        'error':sendSettingsUpdateRequestError,
        'timeout':1000, //make sure that if the server is down then this will fail
        'beforeSend':function() {
            document.getElementById('loading-screen').style.display = 'block';
        },'complete':function() {
            document.getElementById('loading-screen').style.display = 'none';
        }
    });
}