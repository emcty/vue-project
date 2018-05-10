
import Vue from 'vue';
import router from './router';
import App from './App.vue';

import 'assets/css/reset.css';


const app = new Vue({
  router,
  render: h => h(App)
})

router.onReady(() => {
  app.$mount("#app");
});








