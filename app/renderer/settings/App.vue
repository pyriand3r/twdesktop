<template>
    <div class="container">
        <wiki-files
            :config="config">
        </wiki-files>
    </div>
</template>

<script>
    import WikiFiles from './components/WikiFiles.vue';
    import { ipcRenderer } from 'electron'

    export default {
        components: {
            WikiFiles
        },
        data: function () {
            return {
                config: ipcRenderer.sendSync('config:get')
            }
        }

    }
</script>