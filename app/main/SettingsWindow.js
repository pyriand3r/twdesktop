'use strict';

const { BrowserWindow } = require('electron')
const path = require('path')

/**
 * 
 */
class SettingsWindow {

    constructor() {
        this.window = null
    }

    /**
     * @method
     * Return the settings window
     *@return {BrowserWindow}
     */
    getWindow() {
        if (this.window === null) {
            this.window = new BrowserWindow({
                show: false,
                width: 1000,
                height: 500,
                autoHideMenuBar: true,
                title: 'twdesktop - Settings'

            });
            this.window.loadURL('file://' + __dirname + '/../renderer/settings/index.html');
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