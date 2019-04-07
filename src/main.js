import Vue from 'vue'
import App from './App.vue'
import Croppa from 'vue-croppa';
import Toasted from 'vue-toasted';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');

Vue.use(Croppa);
Vue.use(Toasted);
