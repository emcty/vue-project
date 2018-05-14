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
import Confirm from 'components/confirm';
import fastclick from 'fastclick';
Vue.use(axios);
Vue.use(Alert);
Vue.use(Toast);
Vue.use(Confirm);


 export default {

data(){
	return {}
		
	},
	created(){
		fastclick.attach(document.body);
	}
}

</script>


<style lang="scss" >
  .page-container {
    height: 100%;
    min-height: 100%;
  }
</style>


