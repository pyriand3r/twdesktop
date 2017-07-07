<template>
    <div class="settings">
        <h3>Behaviour</h3>
        <b-form-checkbox v-model="config.openDefaultOnStart" @change="openDefaultChange">
            Open default wiki on start
        </b-form-checkbox><br/>
        <b-form-checkbox v-model="config.hideOnClose" @change="hideOnCloseChange">
            Hide wikis on close (instead of really closing them)
        </b-form-checkbox><br/>
        <b-form-checkbox v-model="config.openLinksExternal" @change="openLinksChange">
            Open links in the systems default browser
        </b-form-checkbox>
        <h3>Appearance</h3>
        <b-form-checkbox v-model="config.darkTrayIcon" @change="darkTrayIconChange">
            Dark tray icon
        </b-form-checkbox>
    </div>
</template>

<style>
    .settings {
        max-width: 50%;
        height: 100%;
        padding: 10px 0;
        float: right;
    }
</style>

<script>
    import { ipcRenderer } from 'electron'

    export default {
        props: [ 'config' ],
        methods: {
            openDefaultChange: function (value) {
                ipcRenderer.send('config:change', 'openDefaultOnStart', this.$parent.config.openDefaultOnStart);
            },
            hideOnCloseChange: function (value) {
                ipcRenderer.send('config:change', 'hideOnClose', this.$parent.config.hideOnClose);
            },
            openLinksChange: function (value) {
                ipcRenderer.send('config:change', 'openLinksExternal', this.$parent.config.openLinksExternal);
            },
            darkTrayIconChange: function (value) {
                ipcRenderer.send('config:change', 'darkTrayIcon', this.$parent.config.darkTrayIcon);
            }
        }
    }
</script>