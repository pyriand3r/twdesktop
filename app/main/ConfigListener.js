const { ipcMain } = require('electron')
const Configuration = require('./Configuration')
const logger = require('winston')

module.exports = function () {
    /**
     * @listener
     * Return the configuration
     */
    ipcMain.on('config:get', function (event) {
        event.returnValue = Configuration.getConfig();
    });

    /**
     * @listener
     * Persist a configuration change made in the GUI
     */
    ipcMain.on('config:change', function (event, key, value) {
        logger.log('debug', 'changing config', { key: key, value: value });
        Configuration.setConfigKey(key, value);
    });
}()

