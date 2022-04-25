import Vue from 'vue'
import Component from 'vue-class-component'
import App from './App.vue'

Vue.config.productionTip = false

import uView from "uview-ui";
Vue.use(uView);

// Register the router hooks with their names
Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate'])

new App().$mount()
