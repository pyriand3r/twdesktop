'use strict';

const { app } = require('electron');
const fs = require('fs');
const fse = require('fs-extra');
const logger = require('winston');

const CONFIG_PATH = 'twdesktop';
const CONFIG_FILE_NAME = 'config.json';
const CONFIG_DIST_FILE_NAME = 'config.json.dist';
const DEFAULT_WIKI_FILE_NAME = 'empty.html';
const LOG_FILE_NAME = 'twdesktop.log'

/**
 * Manages the configuration of the app. reading and persisting
 * 
 * @class Configuration
 */
class Configuration {

    /**
     * @constructor
     */
    constructor() {
        this.config = null;
    }

    /**
     * @method
     * Getter wikiFiles
     * 
     * @return string[]
     */
    getWikiFiles() {
        if (this.config === null) {
            this._setConfiguration();
        }
        return this.config.wikiFiles;
    }

    /**
     * @method
     * Setter wikiFiles
     * 
     * @param {array} fileList 
     */
    setWikiFiles(fileList) {
        this.config.wikiFiles = fileList;
    }

    /**
     * @method
     * Getter trayIconColor
     * 
     * @return string
     */
    getTrayIconColor() {
        if (this.config === null) {
            this._setConfiguration();
        }
        return this.config.trayIconColor;
    }

    /**
     * @method
     * Setter trayIconColor
     * 
     * @param {string} trayIconColor
     */
    setTrayIconColor(trayIconColor) {
        this.config.trayIconColor = trayIconColor;
    }

    /**
     * @method
     * Getter openWikiOnStart
     * 
     * @return boolean
     */
    getOpenWikiOnStart() {
        if (this.config === null) {
            this._setConfiguration();
        }
        return this.config.openWikiOnStart;
    }

    /**
     * @method
     * Setter openWikiOnStart
     * 
     * @param {boolean} openWikiOnStart 
     */
    setOpenWikiOnStart(openWikiOnStart) {
        this.config.openWikiOnStart = openWikiOnStart;
    }

    /**
     * @method
     * Getter hideOnClose
     * 
     * @return boolean
     */
    getHideOnClose() {
        if (this.config === null) {
            this._setConfiguration();
        }
        return this.config.hideOnClose;
    }


    /**
     * @method
     * Setter hideOnClose
     * 
     * @param {boolean} hideOnClose 
     */
    setHideOnClose(hideOnClose) {
        this.config.hideOnClose = hideOnClose;
    }

    /**
     * @method
     * Setter defaultWiki
     * 
     * @param {string} defaultWiki 
     */
    setDefaultWiki(defaultWiki) {
        this.config.defaultWiki = defaultWiki;
    }

    /**
     * @method
     * Getter defaultWiki
     * 
     * @return {string}
     */
    getDefaultWiki() {
        if (this.config === null) {
            this._setConfiguration();
        }
        return this.config.defaultWiki;
    }

    /**
     * @method
     * Return the path to store config files
     *
     * @private
     * @return {string}
     */
    _getDataPath() {
        return app.getPath('appData') + '/' + CONFIG_PATH;
    }

    /**
     * @method
     * Return the filepath to the configuration file
     *
     * @private
     */
    _setConfiguration() {
        logger.debug('No config set. fetching...');
        this.config = require(this._getDataPath() + '/' + CONFIG_FILE_NAME);
        logger.debug(this.config);
    }

    /**
     * @method
     * initializes the config folder for user configuration
     */
    initializeDataDirectory() {
        let path = app.getPath('appData') + '/' + CONFIG_PATH;

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        if (!fs.existsSync(path + '/' + CONFIG_FILE_NAME)) {
            fse.copySync(
                app.getAppPath() + '/config/' + CONFIG_DIST_FILE_NAME,
                path + '/' + CONFIG_FILE_NAME
            );
        }
        if (!fs.existsSync(path + '/' + DEFAULT_WIKI_FILE_NAME)) {
            fse.copySync(
                app.getAppPath() + '/config/' + DEFAULT_WIKI_FILE_NAME,
                path + '/' + DEFAULT_WIKI_FILE_NAME
            );
        }
        if (!fs.existsSync(path + '/' + LOG_FILE_NAME)) {
            fs.closeSync(fs.openSync(path + '/' + LOG_FILE_NAME, 'w'));
        }
    }
}

module.exports = new Configuration();