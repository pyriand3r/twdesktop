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

        let menu = [];
        for (let i = 0; i < app.wikis.length; i++) {
            let wikiWindow = app.wikis[i];
            menu.push({
                label: wikiWindow.getLabel(),
                click: function () {
                    if (wikiWindow.getWindow().isVisible()) {
                        wikiWindow.hide();
                    } else {
                        wikiWindow.show();
                    }
                },
            })
        }
        menu.push({
            type: 'separator'
        });
        menu.push({
                label: 'Quit',
                click: function () {
                    app.onQuit = true;
                    app.quit();
                }
            });

        this.contextMenu = Menu.buildFromTemplate(menu);
        this.tray.setContextMenu(this.contextMenu);
    }
}

module.exports = TrayIcon;