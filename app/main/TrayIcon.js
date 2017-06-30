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
    setContextMenu(wikis) {
        if (!Array.isArray(wikis)) {
            wikis = [];
        }
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
     * Show hide the default wiki on left click on tray icon
     */
    openDefaultWiki() {
        app.wikiManager.toggleDefault();
        return;
    }
}

module.exports = TrayIcon;