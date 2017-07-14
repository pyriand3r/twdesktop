<template>
    <div class='wiki-files'>
        <h3>Wiki files
            <button class="bigger btn btn-primary" @click="showModal()">+</button>
        </h3>
        <br>
        <div class="scroll">
            <table class="table table-striped table-hover">
                <tbody>
                    <tr v-for="file in config.wikiFiles" :key="_pathToName(file)">
                        <td>{{ file }}</td>
                        <td>
                            <button class="btn btn-primary" v-if="notDefault(file)" @click="setDefault(file)">
                                set default
                            </button>
                        </td>
                        <td>
                            <button @click="remove(file)" class="bigger">-</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        <div class="modal modal-sm" :class="{active: modalShow}">
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <button class="btn btn-clear float-right" @click="modalShow = false"></button>
                    <div class="modal-title">Add tiddly wiki file</div>
                </div>
                <div class="modal-body">
                    <input type="file" class="form-input" @change="pickFile($event)">
                </div>
                <div class="modal-footer">
                    <button class="btn" @click="modalShow = false">Close</button>
                    <button class="btn btn-primary" @click="addFile()" :disabled="addDisabled">Add</button>
                </div>
            </div>
        </div>
    
    </div>
</template>

<script>

import { ipcRenderer } from 'electron'

export default {
    props: ['config'],
    data: function () {
        return {
            file: null,
            modalShow: false,
            addDisabled: true
        }
    },
    methods: {
        /**
         * @method
         * Return name calculated from file path
         * 
         * @param {string} item The path of the wiki file
         * 
         * @return {string} The name of the wiki
         */
        _pathToName(item) {
            let name = item.split('/');
            name = name.pop();
            name = name.split('.');
            return name[0];
        },

        /**
         * @method
         * Check if item is not the default item
         * 
         * @param {string} item The path of the wiki file
         * 
         * @return {bool} Is not default?
         */
        notDefault: function (item) {
            let name = this._pathToName(item);
            return name !== this.config.defaultWiki;
        },

        /**
         * @method
         * Set the default wiki file
         * 
         * @param {string} item The path of the wiki file
         */
        setDefault: function (item) {
            this.$parent.config.defaultWiki = this._pathToName(item);
            ipcRenderer.send('config:change', 'defaultWiki', this.$parent.config.defaultWiki);

        },

        /**
         * @method
         * Remove the wiki file from the list
         * 
         * @param {{}} item The wiki item
         */
        remove: function (item) {
            let index = this.$parent.config.wikiFiles.indexOf(item);
            this.$parent.config.wikiFiles.splice(index, 1);
            ipcRenderer.send('config:change', 'wikiFiles', this.$parent.config.wikiFiles);
        },

        /**
         * @method
         * add a new wiki file
         */
        addFile: function () {
            if (this.file !== null) {
                this.$parent.config.wikiFiles.push(this.file.path);
                ipcRenderer.send('config:change', 'wikiFiles', this.$parent.config.wikiFiles);
            }
            this.modalShow = false;
        },

        /**
         * @method
         * Set file object
         */
        pickFile: function (event) {
            event.preventDefault();
            this.file = event.target.files[0];
            this.addDisabled = false;
        },

        /**
         * @method
         * Show file modal and reset file object
         */
        showModal: function () {
            this.file = null;
            this.modalShow = true;
            this.addDisabled = true;
        }
    }
}
</script> 

<style>
.wiki-files {
    width: 50%;
    height: 100%;
    padding: 10px;
    float: left;
}

.scroll {
    overflow: auto;
    height: 300px;
    width: 500px;
}

.bigger {
    width: 26px;
}
</style>