import Vue from 'vue';
import Router from 'vue-router';
import Home from 'views/Home';
import Doc from 'views/Doc';
import NotFound from 'views/NotFound';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior() {
    return {y: 0};
  },
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/docs',
      component: Doc
    },
    {
      path: '*',
      component: NotFound
    }
  ]
});

export default router;
