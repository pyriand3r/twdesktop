import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue';
import app from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.component('app', app);

new Vue({
}).$mount('#app');