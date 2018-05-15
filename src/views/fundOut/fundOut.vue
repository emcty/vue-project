<template>
  <div class="form-container">
    <div class="card-container item">
      <span>转出到银行卡</span>
      <div class="card-text">
        建设银行（尾号3377）
      </div>
    </div>
    <div class="item"><span>可转出金额</span><em class="card-text">10,122.00元</em></div>
    <div class="item">
      <label for="money">转出金额</label>
      <input type="tel" id="money" placeholder="今日否可转出10,122.00"><em>元</em>
    </div>
    <div class="sure-container">确认转出</div>
    <div class="agreement"><img src="../../assets/images/yes.png">我已阅读并同意<span>《xxxx服务协议》</span></div>
    <div class="tips-container">
      <div>
        <img src="../../assets/images/small-house.png" alt="">小贴士
      </div>
      <ul>
        <li>1、每次最少转出1元</li>
        <li>2、每日最多转出4次，每日最多转出20万元</li>
        <li>3、转出免服务费</li>
      </ul>
    </div>
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
 @import './fundOut.scss'
</style>


