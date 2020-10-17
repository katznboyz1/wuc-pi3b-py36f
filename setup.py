import sqlite3, os

# make sure that no database exists, if there is one, then quit
if (not os.path.exists('./main.db')):
    databaseConnection = sqlite3.connect('./main.db')
    for action in [
        'CREATE TABLE app_config (config_data_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, config_data_title VARCHAR NOT NULL, config_data_content VARCHAR NOT NULL)',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("darkMode", "0")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("analogMode", "0")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("24HRTime", "0")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("displayOn", "1")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("brightness", "100")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("screenFlipped", "0")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("darkmodeBGColor", "#1d1f23")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("darkmodeFGColor", "#b3b6b9")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("lightmodeBGColor", "#ebecf0")',
        'INSERT INTO app_config (config_data_title, config_data_content) VALUES ("lightmodeFGColor", "#414150")',
    ]:
        databaseConnection.execute(action)
    databaseConnection.commit()

else:
    print('A database already exists. Setup failed.')
    exit(-1)