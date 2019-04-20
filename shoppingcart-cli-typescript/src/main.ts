import Vue from 'vue';
import './plugins/vuetify'
import './plugins/vuetify'
import './plugins/states'
import App from './App.vue';

Vue.config.productionTip = false;

const vue = new Vue({
  render: (h) => h(App),
}).$mount('#app');

// @ts-ignore
window.__VUE__ = vue
// @ts-ignore
window.__VUE_HISTORY__ = vue.$globalHistory
