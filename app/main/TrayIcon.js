'use strict';

const { app, Tray, Menu } = require('electron');
const path = require('path');

const config = require('./Configuration').getConfiguration();


/**
 * @class TrayIcon
 * 
 * The tray icon with dynamic context menu
 */
class TrayIcon {

    /**
     * @constructor
     */
    constructor() {
        this.icon = '/../icons/tiddlycat_light.png';
        if (config.trayIconColor === 'dark') {
            this.icon = '/../icons/tiddlycat_dark.png';
        }
        this.tray = new Tray(path.normalize(__dirname + this.icon));
        this.tray.setToolTip('TiddlyWiki Desktop');

        this.setContextMenu();
    }

    /**
     * @method
     * Set the context menu of the tray icon
     */
    setContextMenu() {
        this.contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show/Hide Wiki',
                click: function () {
                    if (app.wiki.getWindow().isVisible()) {
                        app.wiki.hide();
                    } else {
                        app.wiki.show();
                    }
                },
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                click: function () {
                    app.onQuit = true;
                    app.quit();
                }
            }
        ]);

        this.tray.setContextMenu(this.contextMenu);
    }
}

module.exports = TrayIcon;