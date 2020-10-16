function sendSettingsUpdateRequestError() {
    alert('err')
}

function sendSettingsUpdateRequest() {
    $.ajax({
        'type':'POST',
        'url':'/settingsAPI',
        'dataType':'json',
        'contentType':'application/json',
        'data':JSON.stringify({}),
        'error':sendSettingsUpdateRequestError,
        'timeout':1000, //make sure that if the server is down then this will fail
        'beforeSend':function() {
            document.getElementById('loading-screen').style.display = 'block';
        },'complete':function() {
            document.getElementById('loading-screen').style.display = 'none';
        }
    });
}