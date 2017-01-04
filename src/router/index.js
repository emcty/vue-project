import Vue from 'vue';
import Router from 'vue-router';
import Home from 'views/Home';
import Doc from 'views/Doc';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior() {
    return {y: 0};
  },
  routes: [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/docs',
      component: Doc
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
});

export default router;
