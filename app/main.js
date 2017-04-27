const { app, Tray, Menu, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

const WikiWindow = require('./main/WikiWindow.js');
const config = require('../config');

app.on('ready', function () {

    let wiki = new WikiWindow(config.wikiFile);
    wiki.getWindow();

    trayIcon = '/icons/tiddlycat_light.png';
    if (config.trayIconColor === 'dark') {
        trayIcon = '/icons/tiddlycat_dark.png';
    }

    let appIcon = new Tray(__dirname + trayIcon);
    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide Wiki',
            click: function () {
                if (wiki.getWindow().isVisible()) {
                    wiki.hide();
                } else {
                    wiki.show();
                }
            },
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: function () {
                app.quit();
            }
        }
    ]);

    appIcon.setToolTip('TiddlyWiki Desktop');
    appIcon.setContextMenu(contextMenu);
});


