'use strict';

const { BrowserWindow, ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');

const config = require('./Configuration');

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
    constructor(file, id) {
        if (!fs.existsSync(file)) {
            throw new Error('File >' + file + '< can not be accessed');
        }

        this.id = id;
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
                show: config.getOpenWikiOnStart(),
                width: 1410,
                height: 768,
                title: 'twdesktop - ' + this.label,
                icon: path.normalize(__dirname + '/../icons/icon.svg'),
                autoHideMenuBar: true
            });

            this.window.loadURL('file://' + __dirname + '/../renderer/wikiFrame/wikiFrame.html');

            this._registerSourceSetListener();
            this._registerSaveListener();
            this._registerCloseListener();

            this.setSourceInterval = setInterval(function () {
                me.window.webContents.send('wikiSource', me.file, me.getId());
            }, 500);
        }
        return this.window;
    }

    /**
     * @method
     * Return the label
     */
    getLabel() {
        return this.label;
    }

    /**
     * @method
     * Return the id of the wiki
     * @return {int} The id
     */
    getId() {
        return this.id;
    }

    /**
     * @method
     * Show the window
     */
    show() {
        this.getWindow().show();
    }

    /**
     * @method
     * Hide the window
     */
    hide() {
        this.getWindow().hide();
    }

    /**
     * @method
     * Register save listener for saving the changes
     * 
     * @private
     */
    _registerSaveListener() {
        let me = this;
        ipcMain.on('save:' + this.getId(), function (event, text) {

            fs.writeFile(me.file, text, function (err) {
                if (err !== null) {
                    console.warn('Could not save wiki file');
                    console.warn(err);

                    tiddlyWiki.webContents.send('save:error', err);
                }
            });
        });
    }

    /**
     * @method
     * Register listener on window close event to override shutdown if configured
     * 
     * @private
     */
    _registerCloseListener() {
        var me = this;
        this.window.on('close', function (event) {
            if (config.getHideOnClose() === true && app.onQuit === false) {
                event.preventDefault();
                me.hide();
            } else {
                me.window = null;
            }
        });
    }

    /**
     * @method
     * Register listener to stop set source interval after source is set
     * 
     * @private
     */
    _registerSourceSetListener() {
        let me = this;
        ipcMain.once('wikiSource:set', function () {
            clearInterval(me.setSourceInterval);
        });
    }
}

module.exports = WikiWindow;