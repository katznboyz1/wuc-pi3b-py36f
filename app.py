import flask, json, sqlite3, socket

# the basic configuration for the app
app = flask.Flask(__name__)
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_TYPE'] = 'filesystem' # sessions are needed to restrict administrative access to only the owner of the device
app._static_folder = './static'
app.template_folder = './templates'

# the admin interface will sit on / instead of something like /admin so that the user will be able to easily access the page
# this makes the most since, because the webpage that is going to be displayed on the screen will be automatically displayed, so any url works, thus meaning that the easy root url should be reserved for the admin
@app.route('/', methods = ['GET', 'POST'])
def flaskServeHomepage():
    return flask.render_template('index.html', pageTitle = 'Home')

# settings page is for actual settings, while home page is just for basic things such as on and off
@app.route('/settings', methods = ['GET', 'POST'])
def flaskServeSettings():
    return flask.render_template('settings.html', pageTitle = 'Settings')

# the clock page (will only display the clock, doesnt need the header, and follows a different theme)
@app.route('/clock', methods = ['GET', 'POST'])
def flaskServeClock():
    return flask.render_template('clock.html')

# the api for the settings page (used to update settings) (post only)
# returns the status code in the body, as well as the normal status code
@app.route('/settingsAPI', methods = ['POST'])
def flaskServeSettingsAPI():

    # just assume that the input values are the proper ones, the worst that can happen is somebody breaks the color system which can easily be fixed
    # this program will also be deployed in a safe network anyhow so it doesnt matter
    databaseConnection = sqlite3.connect('./main.db')
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', ('1' if flask.request.json['darkMode'] else '0', 'darkMode'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', ('1' if flask.request.json['analogMode'] else '0', 'analogMode'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', ('1' if flask.request.json['screenFlipped'] else '0', 'screenFlipped'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', ('1' if flask.request.json['displayOn'] else '0', 'displayOn'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['brightness'], 'brightness'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['darkmodeBGColor'], 'darkmodeBGColor'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['darkmodeFGColor'], 'darkmodeFGColor'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['lightmodeBGColor'], 'lightmodeBGColor'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['lightmodeFGColor'], 'lightmodeFGColor'))
    databaseConnection.commit()

    # return a 200 status code and a json response thats just a 200
    return '[200]', 200

# the api for the homepage, meant to just toggle the clock on and off
# it takes a single value in an array [val] which is a boolean that says whether the clock is on or off
@app.route('/clockOnOffToggleAPI', methods = ['POST'])
def flaskServeClockOnOffToggleAPI():
    databaseConnection = sqlite3.connect('./main.db')
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', ('1' if flask.request.json[0] else '0', 'displayOn'))
    databaseConnection.commit()
    return '[200]', 200

# the api for the settings page (used to get the settings) (post only)
# returns the different settings' values so that the settings page can load with the proper presets
@app.route('/settingsAPIDownload.json', methods = ['POST'])
def flaskServeSettingsAPIDownload():
    
    # manually add that data just in case theres extra app config stuff that shouldnt be added
    response = {
        'analogMode':None,
        'darkMode':None,
        'screenFlipped':None,
        'brightness':None,
        'darkmodeBGColor':None,
        'darkmodeFGColor':None,
        'lightmodeBGColor':None,
        'lightmodeFGColor':None,
        'displayOn':None,
        'address':str(socket.gethostbyname(socket.gethostname())),
    }

    # make this iterative
    databaseCursor = sqlite3.connect('./main.db').cursor()
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('darkMode',))
    response['darkMode'] = True if str(databaseCursor.fetchall()[0][0]) == '1' else False
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('analogMode',))
    response['analogMode'] = True if str(databaseCursor.fetchall()[0][0]) == '1' else False
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('screenFlipped',))
    response['screenFlipped'] = True if str(databaseCursor.fetchall()[0][0]) == '1' else False
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('displayOn',))
    response['displayOn'] = True if str(databaseCursor.fetchall()[0][0]) == '1' else False
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('brightness',))
    # make sure that the program wont error out if the value cant be converted to an integer, and is also between 0 and 100
    try:
        response['brightness'] = int(databaseCursor.fetchall()[0][0])
        assert response['brightness'] <= 100 and response['brightness'] >= 0
    except ValueError:
        response['brightness'] = 100
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('darkmodeBGColor',))
    response['darkmodeBGColor'] = str(databaseCursor.fetchall()[0][0])
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('darkmodeFGColor',))
    response['darkmodeFGColor'] = str(databaseCursor.fetchall()[0][0])
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('lightmodeBGColor',))
    response['lightmodeBGColor'] = str(databaseCursor.fetchall()[0][0])
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('lightmodeFGColor',))
    response['lightmodeFGColor'] = str(databaseCursor.fetchall()[0][0])

    # return a 200 status code and a json response thats just a 200
    return json.dumps(response), 200