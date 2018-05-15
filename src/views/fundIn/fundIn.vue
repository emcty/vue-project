<template>
  <div class="form-container">
    <div class="item">
      <label for="money">转入金额</label>
      <input type="tel" id="money" v-model="amount" :placeholder='"最少需转入"+bankObj.minAmount'><em>元</em>
    </div>
    <div class="card-container item">
      <span>支付银行卡</span>
      <div class="card-item clearfix">
        <img src="" alt="">
        <div class="card-info">
          <p>{{bankObj.bankSimpleName}}（尾号{{bankObj.bankCard}}）</p>
          <p>单笔限额{{bankObj.singleLimit}}万／单日限额{{bankObj.dayLimit}}万</p>
        </div>
      </div>
    </div>
    <div :class="{'sure-container':true,'active':active}">确认转入</div>
    <div class="agreement">
      <span :class="{'radio':true,'disactive':!activeRadio}" @click="handleAgreement"></span>
      我已阅读并同意<span>《xxxx服务协议》</span>
    </div>
  </div>
  
</template>
<script>
import api from 'src/apiConfig';

/**
 * bankObj
 * @type {Object}
 * {bankSimpleName,bankCard,singleLimit,dayLimit,minAmount}
 */

export default {
  data(){
    return {
      bankObj: {
      },
      amount: '',
      activeRadio: true,
    }

  },
  computed:{
    active(){
      if(Number.parseInt(this.amount)>=1000){
        return true;
      }
      return false;
    }

  },
  created(){
   this.$http.post(api.recharge)
    .then((ret)=>{
      this.bankObj = ret.data;
    });
    

  },
  methods:{
    handleAgreement(){
      this.activeRadio = !this.activeRadio;
    }

  }
  
}
</script>
<style lang="sass" scoped>
 @import './fundIn.scss'
</style>


