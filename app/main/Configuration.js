'use strict';

const { app, ipcMain } = require('electron');
const fs = require('fs');
const fse = require('fs-extra');
const logger = require('winston');
const path = require('path');

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
     * Return the configuration
     * Lazy
     */
    getConfig() {
        if (this.config === null) {
            this._getConfiguration();
        }
        return this.config;
    }

    /**
     * @method
     * Sets the key in config to the value and persists it to disk
     * @param {string} key The config key to set
     * @param {string|int|bool|array} value The value to set
     */
    setConfigKey(key, value) {
        let config = this.getConfig();
        if (!config.hasOwnProperty(key)) {
            throw new Error('Key ' + key + ' is not present in current configuration.');
        }

        config[key] = value;
        this._persistConfig(config);

        if (key === 'wikiFiles') {
            app.wikiManager.update();
        }
        app.trayIcon.update();
    }

    /**
     * @method
     * Return the path to store config files
     *
     * @private
     * @return {string}
     */
    _getDataPath() {
        return path.normalize(app.getPath('appData') + '/' + CONFIG_PATH);
    }

    /**
     * @method
     * Return the filepath to the configuration file
     *
     * @private
     */
    _getConfiguration() {
        logger.debug('No config set. fetching...');
        this.config = require(path.normalize(this._getDataPath() + '/' + CONFIG_FILE_NAME));
    }

    /**
     * @method
     * initializes the config folder for user configuration
     */
    initializeDataDirectory() {
        let configPath = path.normalize(app.getPath('appData') + '/' + CONFIG_PATH);

        if (!fs.existsSync(configPath)) {
            fs.mkdirSync(configPath);
        }
        if (!fs.existsSync(path.normalize(configPath + '/' + CONFIG_FILE_NAME))) {
            fse.copySync(
                path.normalize(app.getAppPath() + '/config/' + CONFIG_DIST_FILE_NAME),
                path.normalize(configPath + '/' + CONFIG_FILE_NAME)
            );
        }
        if (!fs.existsSync(path.normalize(configPath + '/' + DEFAULT_WIKI_FILE_NAME))) {
            fse.copySync(
                path.normalize(app.getAppPath() + '/config/' + DEFAULT_WIKI_FILE_NAME),
                path.normalize(configPath + '/' + DEFAULT_WIKI_FILE_NAME)
            );
        }
        if (!fs.existsSync(path.normalize(configPath + '/' + LOG_FILE_NAME))) {
            fs.closeSync(fs.openSync(path.normalize(configPath + '/' + LOG_FILE_NAME, 'w')));
        }
    }

    /**
     * @method
     * Persist the given config to disk
     * 
     * @param {{}} config
     * @return {null|Error} 
     */
    _persistConfig(config) {
        let stringified = JSON.stringify(config, null, '\t');
        fs.writeFile(path.normalize(this._getDataPath() + '/' + CONFIG_FILE_NAME), stringified, 'utf8', function (err) {
            if (err) {
                return err;
            }
        });
    }
}

let Config = new Configuration();

module.exports = Config;