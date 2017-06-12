<template>
    <div class='wiki-files'>
        <h3>Wiki files
        <b-btn size="sm" :variant="'success'" v-b-modal.addWikiModal>+</b-btn>
        </h3>
        <b-table striped hover :items="config.wikiFiles" :fields="fields">
            <template slot="file" scope="item">
                {{ item.item }}
            </template>
            <template slot="default" scope="item">
                <b-btn 
                    v-if="item.index != config.defaultWiki"
                    size="sm" 
                    v-bind:variant="'secondary'" 
                    @click="setDefault(item)">
                        set default
                </b-btn>
            </template>
            <template slot="remove" scope="item">
                <b-btn size="sm" v-bind:variant="'danger'" @click="remove(item)">-</b-btn>
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
             * Set the default wiki file
             */
            setDefault: function (item) {
                this.$parent.config.defaultWiki = item.index;
                ipcRenderer.send('config:change', 'defaultWiki', this.$parent.config.defaultWiki);

            },
            /**
             * Remove the wiki file from the list
             */
            remove: function (item) {
                this.$parent.config.wikiFiles.splice(item.index, 1);
                ipcRenderer.send('config:change', 'wikiFiles', this.$parent.config.wikiFiles);
            },
            /**
             * add a new wiki file
             */
            addFile: function () {
                if (this.file !== null) {
                    this.$parent.config.wikiFiles.push(this.file.path);                
                    ipcRenderer.send('config:change', 'wikiFiles', this.$parent.config.wikiFiles);                
                }
            },
            /**
             * Clear the file input
             */
            clearFile: function () {
                this.file = null;
            }
        }   
    }
</script> 