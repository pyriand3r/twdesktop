const path = require('path')
const assert = require('assert')
const sinon = require('sinon')
const Configuration = require('./../../../app/main/Configuration')

let WikiWindow;

before(function () {
    sinon.stub(Configuration, 'getConfig').callsFake(function () {
        return {
            wikiFiles: [
                "/home/gabriel/Sync/wikis/work.html",
                "/home/gabriel/Sync/wikis/Dev.html"
            ],
            darkTrayIcon: false,
            openDefaultOnStart: false,
            hideOnClose: true,
            openLinksExternal: false,
            defaultWiki: 0
        }
    })
    WikiWindow = require('./../../../app/main/WikiWindow')
})

describe('WikiWindow', function () {

    describe('constructor', function () {

        it('should fail if path to file is wrong', function () {
            assert.throws(function () {
                let wiki = new WikiWindow('/non/existing/path.html', 'id')
            })
        })

        it('should set id, filepath and label', function () {
            let wiki = new WikiWindow(path.resolve(__dirname + '/../../../app/config/empty.html'), 'id')
            assert.equal(wiki.label, 'empty')
            assert.equal(wiki.id, 'id')
            assert.equal(wiki.file, path.resolve(__dirname + '/../../../app/config/empty.html'))
        })
    })
})