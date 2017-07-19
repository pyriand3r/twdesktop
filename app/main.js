const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

app.setAppPath(path.normalize(__dirname));

/**
 * Configure winston logger
 */
let loggingPath = app.getPath('appData') + '/';
let debugLevel = 'warning';
if (process.env.NODE_ENV === 'development') {
    loggingPath = app.getAppPath() + '/';
    debugLevel = 'debug';
}

winston.configure({
    transports: [
        new (winston.transports.File)({
            filename: loggingPath + 'twdesktop.log',
            level: debugLevel
        })
    ]
});

/**
 * Trigger for keeping windows hidden on close but be able
 * to close them on app shutdown
 */
app.onQuit = false;

/**
 * @listener
 * Keep app running even if all windows are closed 
 */
app.on('window-all-closed', function () {
    //Do nothing here to prevent the app from terminating
});

/**
 * @listener
 * Basic startup on app ready event
 */
app.on('ready', function () {

    const Configuration = require('./main/Configuration');
    Configuration.initializeDataDirectory();

    const TrayIcon = require('./main/TrayIcon')
    const SettingsWindow = require('./main/SettingsWindow');
    const WikiManager = require('./main/WikiManager');

    require('./main/ConfigListener');


    app.wikiManager = new WikiManager();
    app.trayIcon = new TrayIcon();
    app.settings = new SettingsWindow();

    let config = Configuration.getConfig();

    if (config.openDefaultOnStart === true) {
        app.wikiManager.toggleDefault();
    }
});


