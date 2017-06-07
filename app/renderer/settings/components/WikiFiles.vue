<template>
    <div>
        <b-button :variant="primary" href="" v-on:click="clicked">
          click me
        </b-button>  
    </div>
</template>

<style>
    
</style>

<script>

    export default {
        components: {
            clicked: function () {
                console.log('clicked');
            }

        }   
    }
       
</script>