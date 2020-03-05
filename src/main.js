import Vue from 'vue'
import App from './App.vue'
import Croppa from 'vue-croppa';
import Toasted from 'vue-toasted';

import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css';
import 'vue-croppa/dist/vue-croppa.css';
import './assets/app.css';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');

Vue.use(Croppa);
Vue.use(Toasted);
