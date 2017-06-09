const { ipcRenderer } = require('electron');

/** 
 * @listener
 * Set wiki source file
 */
ipcRenderer.on('wikiSource', function (event, wikiFile, id) {
    let iFrame = document.getElementById('iframe');
    iFrame.src = wikiFile;
    iFrame.sourceId = id;
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
        name: "twdesktop-saver",
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
        let iFrame = document.getElementById('iframe');
        ipcRenderer.send('save:' + iFrame.sourceId, text);
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