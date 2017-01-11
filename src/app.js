
import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
import router from './router';
import {sync} from 'vuex-router-sync';
import App from 'views/App';

sync(store, router);

const app = new Vue({
  router,
  store,
  ...App
});

export {app, router, store};
