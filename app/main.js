const { app } = require('electron');
const fs = require('fs');
const path = require('path');

app.setAppPath(path.normalize(__dirname + '/../'));

const WikiWindow = require('./main/WikiWindow');
const TrayIcon = require('./main/TrayIcon')
const config = require('./main/Configuration').getConfiguration();

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

    app.wikis = [];

    for (let i = 0; i < config.wikiFiles.length; i++) {
        app.wikis.push(new WikiWindow(config.wikiFiles[i]));
    }

    app.tray = new TrayIcon();
});


