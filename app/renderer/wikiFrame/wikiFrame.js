const { ipcRenderer } = require('electron');

/** 
 * @listener
 * Set wiki source file
 */
ipcRenderer.on('wikiSource', function (event, wikiFile) {
    console.log('set wikiSource', wikiFile);
    let iFrame = document.getElementById('iframe');
    iFrame.src = wikiFile;
    ipcRenderer.send('wikiSource:set');
});

/**
 * @listener
 * Inform if an error occurs on save
 */
ipcRenderer.on('save:error', function (event, err) {
    window.alert('Could not save wiki changes. Please see log application log for more information.');
})


/**
 * The saver object needs to add to tiddlyWiki to be able to autosave the wiki on changes
 */
let saverObj = {
    info: {
        name: "tiddly-electron-desktop-saver",
        priority: 5000,
        capabilities: ["save", "autosave"]
    },
    /**
     * @method
     * Save function executed by tiddlywiki
     * 
     * @param {string} text The tiddly wiki file content to save
     */
    save: function (text) {
        ipcRenderer.send('save', text);
        return true;
    }
};

/**
 * Add the saver to tiddlywiki to be able to autosave the wiki
 * saveHandler is available after entering password if wiki is encrypted, so it retries
 * every second until available
 */
let addSaver = function () {
    let iframe = document.getElementById('iframe').contentWindow;
    if (iframe.$tw && iframe.$tw.saverHandler && iframe.$tw.saverHandler.savers) {
        iframe.$tw.saverHandler.savers.push(saverObj);
    } else {
        setTimeout(addSaver, 1000);
    }
}
addSaver();