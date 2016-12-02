import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior() {
    return {y: 0};
  },
  routes: [
    {
      path: '/home',
      component(resolve) {
        require.ensure([], (require) => {
          resolve(require('views/Home'));
        });
      }
    },
    {
      path: '/docs',
      component(resolve) {
        require.ensure([], (require) => {
          resolve(require('views/Doc'));
        });
      }
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
});

export default router;
