const { app } = require('electron');
const fs = require('fs');

const WikiWindow = require('./main/WikiWindow');
const TrayIcon = require('./main/TrayIcon')
const config = require('../config');

/**
 * @listener
 * Keep app running even if all windows are closed 
 */
app.on('window-all-closed', function () {
    //Do nothing here to prefent the app from closing
});

/**
 * @listener
 */
app.on('ready', function () {

    app.wiki = new WikiWindow(config.wikiFile);

    let tray = new TrayIcon();
});


