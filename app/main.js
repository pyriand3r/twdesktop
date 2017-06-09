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
const WikiWindow = require('./main/WikiWindow');
const TrayIcon = require('./main/TrayIcon')
const config = Configuration.getConfig();
const SettingsWindow = require('./main/SettingsWindow');

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

    app.wikis = [];

    let wikiFiles = config.wikiFiles;
    for (let i = 0; i < wikiFiles.length; i++) {
        try {
            let wikiWindow = new WikiWindow(wikiFiles[i], i);
            app.wikis.push(wikiWindow);
        } catch (error) {
            winston.log('error', 'Wiki could not be added', {
                wikiFile: wikiFiles[i],
                error: error.message
            });
        }
    }

    app.trayIcon = new TrayIcon();
    app.settings = new SettingsWindow();
});


