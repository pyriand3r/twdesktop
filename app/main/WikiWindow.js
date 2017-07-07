'use strict';

const { BrowserWindow, ipcMain, app, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const config = require('./Configuration').getConfig();

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
        if (!fs.existsSync(path.normalize(file))) {
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
                show: false,
                width: 1410,
                height: 768,
                title: 'twdesktop - ' + this.label,
                icon: path.normalize(__dirname + '/../icons/icon_48.png'),
                autoHideMenuBar: true
            });

            this.window.loadURL('file://' + __dirname + '/../renderer/wikiFrame/wikiFrame.html');

            this._registerSourceSetListener();
            this._registerSaveListener();
            this._registerCloseListener();

            if (config.openLinksExternal === true) {
                this._registerOpenUrlListener();
            }

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
        if (this.window !== null) {
            this.getWindow().hide();

            if (config.hideOnClose === false || app.onQuit === true) {
                this.window.destroy();
                this.window = null;
            }
        }
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
                    winston.log('warning', 'Could not save wiki file', { data: err });
                    // todo: refactor to returnValue
                    this.window.webContents.send('save:error', err);
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
            event.preventDefault();
            me.hide();
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

    /**
     * @method
     * Register listener to open links in systems default browser 
     * 
     * @private
     */
    _registerOpenUrlListener() {
        let me = this;
        this.window.webContents.on('will-navigate', me._handleRedirect.bind(me));
        this.window.webContents.on('new-window', me._handleRedirect.bind(me));
    }

    /**
     * @method
     * Opens clicked link in the systems default browser, if the url is different to
     * url opened in electron browser window
     * 
     * @param {Event} event The event
     * @param {string} url The url that was clicked
     * @private
     */
    _handleRedirect(event, url) {
        if (url != this.window.webContents.getURL()) {
            event.preventDefault()
            shell.openExternal(url)
        }

    }
}

module.exports = WikiWindow;