import Vue from 'vue'
import App from './App.vue'
import Croppa from 'vue-croppa';
import VModal from 'vue-js-modal'

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');

Vue.use(Croppa);
Vue.use(VModal, {
    dynamic: true
});
