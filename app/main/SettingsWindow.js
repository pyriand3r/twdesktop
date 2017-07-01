'use strict';

const { BrowserWindow } = require('electron')
const path = require('path')

/**
 * @class SettingsWindow
 * The settings window of the app
 */
class SettingsWindow {

    /**
     * @constructor
     */
    constructor() {
        this.window = null
    }

    /**
     * @method
     * Return the settings window
     *@return {BrowserWindow}
     */
    getWindow() {
        let me = this;
        if (this.window === null) {
            this.window = new BrowserWindow({
                show: false,
                width: 1000,
                height: 500,
                autoHideMenuBar: true,
                resizable: false,
                title: 'twdesktop - Settings'

            });
            this.window.loadURL('file://' + __dirname + '/../renderer/settings/index.html');

            this.window.on('close', function () {
                me.window = null;
            });
        }
        return this.window;
    }

    /**
     * @method
     * Show the settings window
     */
    show() {
        this.getWindow().show();
    }

    /**
     * @method
     * Hide the settings window
     */
    hide() {
        this.getWindow().hide();
    }
}

module.exports = SettingsWindow;