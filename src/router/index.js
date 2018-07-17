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
      path: "/",
      redirect: "/index"
    },
    {
      path: "/index",
      component: function (resolve) {
        require.ensure(['views/index/App'], () => {
          resolve(require('views/index/App'));
        }, 'index')
      },
      meta:{
        docTitle:'首页'
      }
    },
    // {
    //   path: "/register", 
    //   component: function (resolve) {
    //     require.ensure(['views/register/register'], () => {
    //       resolve(require('views/register/register'));
    //     }, 'register')
    //   },
    //   meta:{
    //     docTitle:'注册登录'
    //   }
    // },
    // {
    //   path: "/fundIn",
    //   component: function (resolve) {
    //     require.ensure(['views/fundIn/fundIn'], () => {
    //       resolve(require('views/fundIn/fundIn'));
    //     }, 'fundIn')
    //   },
    //   meta:{
    //     docTitle:'转入'
    //   }
    // },
    // {
    //   path: "/fundOut",
    //   component: function (resolve) {
    //     require.ensure(['views/fundOut/fundOut'], () => {
    //       resolve(require('views/fundOut/fundOut'));
    //     }, 'fundOut')
    //   },
    //   meta:{
    //     docTitle:'转出'
    //   }
    // },
    // {
    //   path: "/fundInDetail",
    //   component: function (resolve) {
    //     require.ensure(['views/fundInDetail/fundInDetail'], () => {
    //       resolve(require('views/fundInDetail/fundInDetail'));
    //     }, 'fundInDetail')
    //   },
    //   meta:{
    //     docTitle:'交易详情'
    //   }
    // },
  ]
});


router.beforeEach((to,from,next)=>{
  document.title = to.meta.docTitle;
  next();
})
export default router;
