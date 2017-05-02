const { app } = require('electron');
const fs = require('fs');

const WikiWindow = require('./main/WikiWindow');
const TrayIcon = require('./main/TrayIcon')
const config = require('../config');

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

    app.tray = new TrayIcon();

    app.wiki = new WikiWindow(config.wikiFile);
    if (config.openWikiOnStart === true) {
        app.wiki.show();
    }
});


