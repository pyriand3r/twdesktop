'use strict';

const { app, Tray, Menu } = require('electron');
const path = require('path');

const config = require('./Configuration');


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
        if (config.getTrayIconColor() === 'dark') {
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
        let wikis = this._getWikiEntries();
        wikis.push({
            type: 'separator'
        });
        wikis.push({
            label: 'Quit',
            click: function () {
                app.onQuit = true;
                app.quit();
            }
        });
        this.contextMenu = Menu.buildFromTemplate(wikis);

        this.tray.setContextMenu(this.contextMenu);
    }

    /**
     * @method
     * Return context menu entries for 
     */
    _getWikiEntries() {
        let wikis = [];
        let defaultWiki = config.getDefaultWiki();

        for (let i = 0; i < app.wikis.length; i++) {
            let wikiWindow = app.wikis[i];
            wikis.push({
                label: wikiWindow.getLabel(),
                click: function () {
                    if (wikiWindow.getWindow().isVisible() === true) {
                        wikiWindow.hide();
                    } else {
                        wikiWindow.show();
                    }
                }
            });
        }
        return wikis;
    }
}

module.exports = TrayIcon;