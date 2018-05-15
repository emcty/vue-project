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
        path: "/register",  //注册登录
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
    {
      path: "/fundOut",  
      component: function(resolve) {
          require.ensure(['views/fundOut/fundOut'], () => {
              resolve(require('views/fundOut/fundOut'));
          }, 'fundOut')
      }
    },
    {
      path: "/fundInDetail",  
      component: function(resolve) {
          require.ensure(['views/fundInDetail/fundInDetail'], () => {
              resolve(require('views/fundInDetail/fundInDetail'));
          }, 'fundInDetail')
      }
    },
    ]
});
export default router;