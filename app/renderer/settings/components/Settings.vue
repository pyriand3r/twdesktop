<template>
    <form class="settings">
        <h3>Behaviour</h3>
        <div class="form-group">
            <label class="form-switch">
                <input type="checkbox" v-model="config.openDefaultOnStart" @change="openDefaultChange">
                <i class="form-icon"></i> Open default wiki on start
            </label>
            <label class="form-switch">
                <input type="checkbox" v-model="config.hideOnClose" @change="hideOnCloseChange">
                <i class="form-icon"></i>Hide wikis on close (instead of really closing them)
            </label>
            <label class="form-switch">
                <input type="checkbox" v-model="config.openLinksExternal" @change="openLinksChange">
                <i class="form-icon"></i>Open links in the systems default browser
            </label>
        </div>
        <h3>Appearance</h3>
        <div class="form-group">
            <label class="form-switch">
                <input type="checkbox" v-model="config.darkTrayIcon" @change="darkTrayIconChange">
                <i class="form-icon"></i>Dark tray icon
            </label>
        </div>
    </form>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
    props: ['config'],
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

<style>
.settings {
    max-width: 50%;
    height: 100%;
    padding: 10px;
    left: 520px;
    position: fixed;
}
</style>