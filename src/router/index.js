import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
    mode: 'history',
    scrollBehavior() {
        return {
            y: 0
        };
    },
    routes: [{
        path: "/"
    }, 
    {
        path: "/wxIndex",
        component: function(resolve) {
            require.ensure(['views/wxIndex/wxIndex'], () => {
                resolve(require('views/wxIndex/wxIndex'));
            }, 'wxIndex')
        }
    }, 
    {
        path: "/register", 
        component: function(resolve) {
            require.ensure(['views/register/register'], () => {
                resolve(require('views/register/register'));
            }, 'register')
        }
    }, 
    {
      path: "/fundIn", 
      component: function(resolve) {
          require.ensure(['views/fundIn/fundIn'], () => {
              resolve(require('views/fundIn/fundIn'));
          }, 'fundIn')
      }
    },
    ]
});

router.afterEach(function(to) {
  document.title = to.meta.docTitle;
});

export default router;