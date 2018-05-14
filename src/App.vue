<template>
  <div class="page-container">
     <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import Alert from 'components/alert';
import Toast from 'components/Toast';
import axios from 'assets/js/lib/axios/axios-vue2.js';

Vue.use(axios);
Vue.use(Alert);
Vue.use(Toast);


 export default {

  data(){
    return {}
  },
  created(){
    
  }
 }

</script>


<style lang="scss" >
  .page-container {
    height: 100%;
    min-height: 100%;
  }
</style>


