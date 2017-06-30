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

const Configuration = require('./main/Configuration');
const TrayIcon = require('./main/TrayIcon')
const SettingsWindow = require('./main/SettingsWindow');
const WikiManager = require('./main/WikiManager');

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

    Configuration.initializeDataDirectory();

    app.trayIcon = new TrayIcon();
    app.wikiManager = new WikiManager();
    app.settings = new SettingsWindow();
});


