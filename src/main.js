
import Vue from 'vue';
import router from './router';
import VueResource from 'vue-resource';
import App from './App.vue';

import 'assets/css/reset.css';

Vue.use(VueResource);

const app = new Vue({
  router,
  render: h => h(App)
})

router.onReady(() => {
  app.$mount("#app");
});








