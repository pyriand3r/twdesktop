<template>
    <div class='wiki-files justify-content-centermy-1 row'>
        <h3>Wiki files
        <b-btn size="sm" :variant="'success'" v-b-modal.addWikiModal class="bigger">+</b-btn>
        </h3><br/>
        <b-table striped bordered hover :items="config.wikiFiles" :fields="fields">
            <template slot="file" scope="item">
                {{ item.item }}
            </template>
            <template slot="default" scope="item">
                <b-btn 
                    v-if="notDefault(item.item)"
                    size="sm" 
                    v-bind:variant="'secondary'" 
                    @click="setDefault(item.item)">
                        set default
                </b-btn>
            </template>
            <template slot="remove" scope="item">
                <b-btn size="sm" v-bind:variant="'danger'" @click="remove(item)" class="bigger">-</b-btn>
            </template>
        </b-table>

        <b-modal id="addWikiModal" title="Choose a tiddly wiki file" @ok="addFile" @shown="clearFile">
        
            <form @submit.stop.prevent="submit">
                <b-form-file v-model="file"></b-form-file>
                <br> Selected file: {{file && file.name}}
            </form>
    
        </b-modal>
    </div>
</template>

<style>
    .wiki-files {
        width: 50%;
        height: 100%;
        padding: 10px 0;
        float: left;
    }

    .bigger {
        width: 58px;
    }
</style>

<script>

    import { ipcRenderer } from 'electron'

    export default {
        props: [ 'config' ],
        data: function () {
            return {
                file: null,
                fields: {
                    file: {
                        label: 'File',
                        sortable: false
                    },
                    default: {
                        label: 'Default',
                        sortable: false
                    },
                    remove: {
                        label: 'Remove'
                    }
                }
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
                this.$parent.config.wikiFiles.splice(item.index, 1);
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
            },
            /**
             * @method
             * Clear the file input
             */
            clearFile: function () {
                this.file = null;
            }
        }   
    }
</script> 