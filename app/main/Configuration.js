'use strict';

const { app } = require('electron');
const fs = require('fs');
const fse = require('fs-extra');

const CONFIG_PATH = '/twdesktop';
const CONFIG_FILE_NAME = 'config.js';
const CONFIG_DIST_FILE_NAME = 'config.js.dist';
const DEFAULT_WIKI_FILE_NAME = 'empty.html';

let initialized = false;
/**
 * @class Configuration
 */
class Configuration {

    /**
     * @method
     * Return the path to store config files
     *
     * @returns {string}
     */
    static getDataPath() {
        return app.getPath('appData') + CONFIG_PATH;
    }

    /**
     * @method
     * Is node_env = development?
     * @returns {boolean}
     */
    static isDevelopment() {
        return process.env.NODE_ENV === 'development';
    }

    /**
     * @method
     * Return the filepath to the configuration file
     *
     * @returns {string}
     */
    static getConfiguration() {
        if (Configuration.isDevelopment()) {
            return require(app.getAppPath() + '/' + CONFIG_FILE_NAME);
        }
        if (initialized === false) {
            this.initializeDataDirectory();
        }

        return require(Configuration.getDataPath() + '/' + CONFIG_FILE_NAME);
    }

    /**
     * @method
     * Return the filepath to the default configuration file
     *
     * @returns {string}
     */
    static getDefaultConfigFilePath() {
        return app.getAppPath() + '/' + CONFIG_DIST_FILE_NAME;
    }

    /**
     * @method
     * initializes the config folder for user configuration
     *
     * @static
     */
    static initializeDataDirectory() {
        initialized = true;

        let path = app.getPath('appData') + CONFIG_PATH;

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        if (!fs.existsSync(path + '/' + CONFIG_FILE_NAME)) {
            fse.copySync(
                app.getAppPath() + '/' + CONFIG_DIST_FILE_NAME,
                path + '/' + CONFIG_FILE_NAME
            );
        }
        if (!fs.existsSync(path + '/' + DEFAULT_WIKI_FILE_NAME)) {
            fse.copySync(
                app.getAppPath() + '/' + DEFAULT_WIKI_FILE_NAME,
                path + '/' + DEFAULT_WIKI_FILE_NAME
            );
        }
    }
}

module.exports = Configuration;