'use strict';

const { app, Tray, Menu, dialog } = require('electron');
const path = require('path');

const config = require('./Configuration').getConfig();


/**
 * @class TrayIcon
 * 
 * The tray icon. Main entry point of twdesktop.
 * Allows access to all registered wikis and settings.
 */
class TrayIcon {

    /**
     * @constructor
     */
    constructor() {
        let me = this;
        this.tray = null;

        this.initializeTray();
        
        this.tray.on('click', me.openDefaultWiki);        
    }

    /**
     * @method
     * Initialize the tray icon
     */
    initializeTray() {
        this.tray = new Tray(path.normalize(__dirname + '/../icons/tiddlycat_light.png'));
        this.setIcon();
        this.tray.setToolTip('TiddlyWiki Desktop');

        this.setContextMenu();
    }

    /**
     * @method
     * Update the tray contextmenu and icon
     */
    update() {
        if (this.tray === null) {
            return;
        }
        this.setContextMenu();
        this.setIcon();
    }

    /**
     * @method
     * Set the icon of the tray
     */
    setIcon() {
        let icon = '/../icons/tiddlycat_light.png';
        if (config.darkTrayIcon === true) {
            icon = '/../icons/tiddlycat_dark.png';
        }
        this.tray.setImage(path.normalize(__dirname + icon));
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
            label: 'Settings',
            click: function () {
                if (app.settings.getWindow().isVisible() === true) {
                    app.settings.hide();
                } else {
                    app.settings.show();
                }
            }
        })
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
     * Return list of menu entries for every single registered wiki file
     * 
     * @private
     */
    _getWikiEntries() {
        let wikis = [];

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

    /**
     * @method
     * Show hide the default wiki on left click on tray icon
     */
    openDefaultWiki() {
        let defaultWiki = app.wikis[config.defaultWiki];

        if (defaultWiki === undefined) {
            dialog.showMessageBox({
                title: 'No default wiki',
                message: 'You haven\'t defined a default wiki or the settings are wrong. Please do so in the settings.',
                type: 'info'
            });
            return;
        }
        
        if (defaultWiki.getWindow().isVisible() === true) {
            defaultWiki.hide();
        } else {
            defaultWiki.show();
        }
    }
}

module.exports = TrayIcon;