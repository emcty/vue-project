<template>
  <div class="page-container">
     <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';
import Alert from 'components/alert';
import Toast from 'components/Toast';


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

<style>
    
</style>

