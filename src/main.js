
import Vue from 'vue';
import router from './router';
import App from './App.vue';


console.log(App);

const app = new Vue({
  router,
  render: h => h(App)
})

router.onReady(() => {
  app.$mount("#app");
});








