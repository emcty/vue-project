<template>
  <div class="page-container">
     <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import Alert from 'components/alert';
import Toast from 'components/Toast';
import Comfirm from 'components/confirm'
import FastClick from 'fastclick'
import Axios from 'assets/js/lib/axios/axios-vue2'
Vue.use(Axios)	
Vue.use(Alert);
Vue.use(Toast);
Vue.use(Comfirm);

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

export default {
  data(){
    return {}
  },
  created(){
    
  }
}

</script>

<style>
    
</style>

