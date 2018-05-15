<template>
  <div class="form-container">
    <div class="item"><label for="money">转入金额</label><input type="tel" id="money" placeholder="最少需转入1000" ><em>元</em></div>
    <div class="card-container item">
      <span>支付银行卡</span>
      <div class="card-item clearfix">
        <img src="" alt="">
        <div class="card-info">
          <p>建设银行（尾号3377）</p>
          <p>单笔限额20万／单日限额20万</p>
        </div>
      </div>
    </div>
    <div class="sure-container">确认转入</div>
    <div class="agreement"><img src="../../assets/images/yes.png">我已阅读并同意<span>《xxxx服务协议》</span></div>
  </div>
  
</template>
<script>
export default {
  data(){
    return {
      
    }

  },
  created(){
    

  },
  methods:{

  }
  
}
</script>
<style lang="sass" scoped>
 @import './fundIn.scss'
</style>


