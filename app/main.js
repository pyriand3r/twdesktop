const { app, Tray, Menu, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

const config = require('../config');

app.on('ready', function () {

    let tiddlyWiki = new BrowserWindow({
        show: config.openWikiOnStart
    });

    tiddlyWiki.loadURL('file://' + __dirname + '/wikiFrame/wikiFrame.html');

    tiddlyWiki.on('ready-to-show', function () {
        console.log('send source');
        tiddlyWiki.webContents.send('wikiSource', config.wikiFile);
    });

    ipcMain.on('save', function (event, text) {

        fs.writeFile(config.wikiFile, text, function (err) {
            if (err !== null) {
                console.warn('Could not save wiki file');
                console.warn(err);

                tiddlyWiki.webContents.send('save:error', err);
            }
        });
    });

    trayIcon = '/icons/tiddlycat_light.png';
    if (config.trayIconColor === 'dark') {
        trayIcon = '/icons/tiddlycat_dark.png';
    }

    let appIcon = new Tray(__dirname + trayIcon);
    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide Wiki',
            click: function () {
                if (tiddlyWiki.isVisible()) {
                    tiddlyWiki.hide();
                } else {
                    tiddlyWiki.show();
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


