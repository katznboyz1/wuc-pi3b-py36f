function sendSettingsUpdateRequestError() {
    alert('Server Error');
}

function sendSettingsUpdateRequest() {
    $.ajax({
        'type':'POST',
        'url':'/settingsAPI',
        'dataType':'json',
        'contentType':'application/json',
        'data':JSON.stringify({
            'analogMode':document.getElementById('settings-analog-mode-toggle').checked,
            'darkMode':document.getElementById('settings-dark-mode-toggle').checked,
            'screenFlipped':document.getElementById('settings-screen-flip-toggle').checked,
            'displayOn':document.getElementById('settings-display-on-toggle').checked,
            'brightness':document.getElementById('settings-brightness-selector').value,
            '24HRTime':document.getElementById('settings-24hr-mode-toggle').checked,
            'darkmodeBGColor':document.getElementById('settings-darkmode-background-color-selector').value,
            'darkmodeFGColor':document.getElementById('settings-darkmode-foreground-color-selector').value,
            'lightmodeBGColor':document.getElementById('settings-lightmode-background-color-selector').value,
            'lightmodeFGColor':document.getElementById('settings-lightmode-foreground-color-selector').value,
        }),
        'error':sendSettingsUpdateRequestError,
        'timeout':5000, //make sure that if the server is down then this will fail
        'beforeSend':function() {
            document.getElementById('loading-screen').style.display = 'block';
        },'complete':function() {
            document.getElementById('loading-screen').style.display = 'none';
        }
    });
}

window.onload = function() {
    $.ajax({
        'type':'POST',
        'dataType':'json',
        'url':'/settingsAPIDownload.json',
        'error':sendSettingsUpdateRequestError,
        'timeout':5000, //make sure that if the server is down then this will fail
        'beforeSend':function() {
            document.getElementById('loading-screen').style.display = 'block';
        },'complete':function(response) {
            document.getElementById('loading-screen').style.display = 'none';
            let responseJSON = response.responseJSON;
            document.getElementById('settings-analog-mode-toggle').checked = responseJSON['analogMode'];
            document.getElementById('settings-dark-mode-toggle').checked = responseJSON['darkMode'];
            document.getElementById('settings-screen-flip-toggle').checked = responseJSON['screenFlipped'];
            document.getElementById('settings-display-on-toggle').checked = responseJSON['displayOn'];
            document.getElementById('settings-24hr-mode-toggle').checked = responseJSON['24HRTime'];
            document.getElementById('settings-brightness-selector').value = responseJSON['brightness'];
            document.getElementById('settings-darkmode-background-color-selector').value = responseJSON['darkmodeBGColor'];
            document.getElementById('settings-darkmode-foreground-color-selector').value = responseJSON['darkmodeFGColor'];
            document.getElementById('settings-lightmode-background-color-selector').value = responseJSON['lightmodeBGColor'];
            document.getElementById('settings-lightmode-foreground-color-selector').value = responseJSON['lightmodeFGColor'];
        }
    });
}