'use strict';

const path = require('path');

const Configuration = require('./Configuration.js');
const WikiWindow = require('./WikiWindow');

/**
 * 
 * @class WikiManager
 */
class WikiManager {

    /**
     * @constructor
     */
    constructor() {
        this.wikis = {};
        this.default = null;

        this.update();
    }

    /**
     * @method
     * Show/Hide default wiki
     */
    toggleDefault() {
        this.toggleWikiByName(this.default);
    }

    /**
     * @method
     * Show/Hide wiki by name
     * 
     * @param {String} name 
     */
    toggleWikiByName(name) {
        if (this.wikis[name] === undefined) {
            throw new Error('Wiki ' + name + ' can not be found.');
        }

        if (this.wikis[name].getWindow().isVisible() === true) {
            this.wikis[name].hide();
        } else {
            this.wikis[name].show();
        }
    }

    /**
     * @method
     * Update the list of wiki instances
     */
    update(config) {
        if (config === undefined) {
            config = Configuration.getConfig();
        }
        this._removeOld(config);
        this._checkNew(config);
        this.default = config.defaultWiki;
    }

    /**
     * @method
     * Remove old wiki instances not present in actual config
     * 
     * @param {*} config 
     */
    _removeOld(config) {
        for (let wiki in this.wikis) {
            if (this.wikis.hasOwnProperty(wiki)) {
                let keep = false;
                for (let file in config.wikiFiles) {
                    if (this.wikis[wiki].file === file) {
                        keep = true;
                        continue;
                    }
                }

                if (keep === false) {
                    delete this.wikis[wiki];
                }
            }
        }
    }

    /**
     * @method
     * Check for new wikis on config not yet present as instance
     * 
     * @param {*} config 
     */
    _checkNew(config) {
        for (let i = 0; i < config.wikiFiles.length; i++) {
            let create = true;

            for (let wiki in this.wikis) {
                if (this.wikis[wiki].file === config.wikiFiles[i]) {
                    create = false;
                    continue;
                }
            }

            if (create === true) {
                this._add(config.wikiFiles[i]);
            }
        }
    }

    /**
     * @method
     * 
     * 
     * @param {String} file The path of the wiki file 
     */
    _add(file) {
        let name = path.basename(file, '.html');

        if (typeof this.wikis[name] === WikiWindow) {
            throw new Error('Wiki with name ' + name * ' already exist');
        }

        this.wikis[name] = new WikiWindow(file, name);
    }

    /**
     * @method
     * Return the context menu entries for all wikis
     * 
     * @return {[]}
     */
    getTrayEntries() {
        let me = this;
        let wikis = [];

        for (let name in this.wikis) {
            if (this.wikis.hasOwnProperty(name)) {
                let wikiWindow = this.wikis[name];

                wikis.push({
                    label: wikiWindow.getLabel(),
                    click: function () {
                        me.toggleWikiByName(name);
                    }
                });
            }
        }
        return wikis;
    }
}

module.exports = WikiManager;