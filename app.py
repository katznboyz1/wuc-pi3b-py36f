import flask, json, sqlite3

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
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['brightness'], 'brightness'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['darkmodeBGColor'], 'darkmodeBGColor'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['darkmodeFGColor'], 'darkmodeFGColor'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['lightmodeBGColor'], 'lightmodeBGColor'))
    databaseConnection.execute('UPDATE app_config SET config_data_content = ? WHERE config_data_title = ?', (flask.request.json['lightmodeFGColor'], 'lightmodeFGColor'))
    databaseConnection.commit()

    # return a 200 status code and a json response thats just a 200
    return '[200]', 200

# the api for the settings page (used to get the settings) (post only)
# returns the different settings' values so that the settings page can load with the proper presets
@app.route('/settingsAPIDownload.json', methods = ['POST'])
def flaskServeSettingsAPIDownload():
    
    response = {
        'analogMode':False,
        'darkMode':False,
    }

    databaseCursor = sqlite3.connect('./main.db').cursor()
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('darkMode',))
    response['darkMode'] = True if str(databaseCursor.fetchall()[0][0]) == '1' else False
    databaseCursor.execute('SELECT config_data_content FROM app_config WHERE config_data_title = ?', ('analogMode',))
    response['analogMode'] = True if str(databaseCursor.fetchall()[0][0]) == '1' else False

    # return a 200 status code and a json response thats just a 200
    return json.dumps(response), 200