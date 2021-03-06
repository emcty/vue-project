import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior() {
    return {y: 0};
  },
  routes: [{
      path: "/",
  },
  {
      path: "/wxIndex",
      component: function(resolve) {
          require.ensure(['wxPage/wxIndex/wxIndex'], () => {
              resolve(require('wxPage/wxIndex/wxIndex'));
          }, 'wxIndex')
      },
  }]
});

export default router;
