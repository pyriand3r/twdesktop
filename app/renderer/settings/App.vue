<template>
    <div class="container">
        <wiki-files
            :config="config">
        </wiki-files>
        <settings
            :config="config">
        </settings>
    </div>
</template>

<script>
    import WikiFiles from './components/WikiFiles.vue';
    import Settings from './components/Settings.vue';
    import { ipcRenderer } from 'electron'

    export default {
        components: {
            WikiFiles,
            Settings
        },
        data: function () {
            return {
                config: ipcRenderer.sendSync('config:get')
            }
        }

    }
</script>