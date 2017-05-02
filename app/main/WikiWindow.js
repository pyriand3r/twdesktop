'use strict';

const { BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const config = require('../../config');

/**
 * @class WikiWindow
 * 
 * A renderer window for accessing a wiki file and managing it
 */
class WikiWindow {

    /**
     * @constructor
     * @param {string} path The file path of the wiki file
     */
    constructor(file) {
        if (!fs.existsSync(file)) {
            throw new Error('File >' + path + '< can not be accessed');
        }

        this.file = file;
        this.label = path.basename(file, '.html')
        this.window = null;
    }

    /**
     * @method
     * Return the window holding the wiki
     * 
     * @return BrowserWindow
     */
    getWindow() {
        let me = this;
        if (this.window === null) {
            this.window = new BrowserWindow({
                show: config.openWikiOnStart,
                width: 1410,
                height: 768,
                title: 'twdesktop - ' + this.label,
                icon: path.normalize(__dirname + '/../icons/tiddlycat_light.png'),
                autoHideMenuBar: true
            });

            this.window.once('show', function () {
                me.window.webContents.send('wikiSource', me.file);
            });

            this.window.loadURL('file://' + __dirname + '/../renderer/wikiFrame/wikiFrame.html');

            this._registerSaveListener();
            this._registerCloseListener();
        }
        return this.window;

    }

    /**
     * @method
     * Register save listener for saving the changes
     * 
     * @private
     */
    _registerSaveListener() {
        ipcMain.on('save', function (event, text) {

            fs.writeFile(config.wikiFile, text, function (err) {
                if (err !== null) {
                    console.warn('Could not save wiki file');
                    console.warn(err);

                    tiddlyWiki.webContents.send('save:error', err);
                }
            });
        });
    }

    _registerCloseListener() {
        var me = this;
        this.window.on('close', function () {
            me.window = null;
        });
    }

    /**
     * @method
     * Show the window
     */
    show() {
        let window = this.getWindow();
        setTimeout(function () {
            window.show();
         }, 250)

    }

    /**
     * @method
     * Hide the window
     */
    hide() {
        this.getWindow().hide();
    }
}

module.exports = WikiWindow;