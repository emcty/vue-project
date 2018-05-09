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
      meta: {
          docTitle: "趣享卡",
      }
  },
  {
      path: "/wxIndex",
      component: function(resolve) {
          require.ensure(['wxPage/wxIndex/wxIndex'], () => {
              resolve(require('wxPage/wxIndex/wxIndex'));
          }, 'wxIndex')
      },
      meta: {
          docTitle: "趣享卡",

      }
  }]
});

export default router;
