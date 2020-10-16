import flask

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
    return '[200]', 200