<template>
<div>
  <div class="loading" v-show="loading">
    <img src="./images/loading.gif">
  </div>
  <div class="detail-container" v-show="!loading">
    <div class="detail-info clearfix">
      <img  class="detail-process" src="./images/process.png" alt="">
      <div class="detail-text">
        <section>
          <p>申请转入{{amount}}元</p>
          <p>天天房东为您垫付手续费1.00元</p>
        </section>
        <section>
          <p>等待系统匹配租约</p>
          <p>预计2-3日内匹配完成</p>
        </section>
        <section>
          <p>获得租金收入</p>
          <p>租约匹配成功当日收租</p>
        </section>
      </div>
    </div>
    <div class="sure-container" @click="backHomePage" data-report='{"enName":"IntoDetail_success","cnName":"转入-转入完成"}'>完成</div>
    <div class="new-gift-banner" v-show="dataInfo.rechargeCashPic">
      <img :src="dataInfo.rechargeCashPic" alt="">
    </div>
  </div>
</div>
</template>
<script>

import { storage } from '@js/modules/tool';
import '@js/modules/DataReport';


export default {
  data() {
    return {
      loading: true,
      dataInfo:{
        // rechargeCashPic:""
      },
      amount: ""
    };
  },
  async created() {
    let res = await this.$http.post("wap/api/pay/recharge/success");
    let data = res.data;

    this.loading = false;
    this.amount = storage("userFundInInfo").amount;
    this.dataInfo.rechargeCashPic = data.rechargeCashPic;
  },
  methods: {
    backHomePage(){
      window.location.href = "/";
    }
  }
};
</script>
<style lang="sass">
 @import './fundInDetail.scss'
</style>


