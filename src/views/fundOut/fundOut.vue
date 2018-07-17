<template>

<div>
  <div class="loading" v-show="loading">
    <img src="./images/loading.gif">
  </div>
  <div class="form-container" v-show="!loading">
    <div class="card-container item">
      <span>转出到银行卡</span>
      <div class="card-text">
        {{bankObj.bankSimpleName}}（尾号{{bankObj.bankCard}}）
      </div>
    </div>
    <div class="item"><span>可转出金额</span><em class="card-text">{{bankObj.balanceAmount}}元</em></div>
    <div class="item">
      <label for="money">转出金额</label>
      <div class="fund-out">
        <input type="number" id="money"  v-model="amount" :placeholder="'今日可转出'+bankObj.todayAmount"><em>元</em>
      </div>
    </div>
    <div class="error" >
      <p v-show="error.overTimesFlag">每日最多转出4次,请明日再试</p>
      <p v-show="error.overMaxAmountFlag">每日最多转出20万元</p>
      <p v-show="error.overAmountFlag">今日最多还可转出{{bankObj.todayAmount}}元</p>
      <p v-show="error.lessMinAmountFlag">最少转出金额1.00元</p>
    </div>
    <div :class="{'sure-container':true,'active':active}" @click="confirmFundOut" data-report='{"enName":"out_ok","cnName":"转出-确认转出"}'>确认转出</div>
    <div class="tips-container">
      <div>
        <img src="./images/small-house.png" alt="">小贴士
      </div>
      <ul>
        <li>1、每次最少转出{{bankObj.minAmount}}元</li>
        <li>2、每日最多转出{{bankObj.dayTimes}}次，每日最多转出{{bankObj.dayMaxAmount}}万元</li>
        <li>3、转出免服务费</li>
      </ul>
    </div>
    <trade-password  ref="tradeContainer" :findPasswordUrl="tradeInfoObj.findPasswordUrl" :show="tradeInfoObj.showPasswordDailog"
    @submitCb="tradeInfoObjSubmitCb($event,passwordVal)" @hide="hideTradeInfoDailog">
    </trade-password>
  </div>
</div>

</template>
<script>

import tradePassword from "../fundIn/components/tradePassword.vue";
import { storage } from '@js/modules/tool';
import '@js/modules/DataReport';


export default {
  data() {
    return {
      loading: true,
      bankObj: {
        bankSimpleName: "建设银行",
        bankCard: "3345",
        balanceAmount: "30",
        todayAmount: "20",
        minAmount: "3",
        dayTimes: 4,
        dayMaxAmount: "30",
        unmatchedAmt: ""
      },
      error: {
        overTimesFlag: false,
        overMaxAmountFlag: false,
        overAmountFlag: false,
        lessMinAmountFlag: false
      },
      amount: "",
      tradeInfoObj: {
        findPasswordUrl: "../setPassword/index.html?pageType=ForgetPassword&fromUrl=fundOut",
        showPasswordDailog: false
      }
    };
  },
  computed: {
    active() {
      if(!this.amount){
        return false;
      }

      let hasErrorFlag = false;

      for(let k in this.error){
        if(this.error[k]){
          hasErrorFlag = true;
          return false;
        }
      }

      if(!hasErrorFlag){
        return true;
      }
      return false;
    }
  },
  created() {
    this.$http.post("wap/api/pay/withdraw/").then(ret => {
      let data = ret.data;
      this.loading = false;
      this.bankObj = data.withdrawMessage;

      if (data.code == 1) {
        this.error.overTimesFlag = true;

      } else if (data.code == 2) {
        this.error.overMaxAmountFlag = true;

      } else if (data.code == 3) {
        this.$watch("amount", value => {
          if(value.length > 9){
            this.amount = value.slice(0,9);
          }
          if(Number.isNaN(Number(value))){
            this.error.lessMinAmountFlag = true;
            this.error.overAmountFlag = false;
          }else{
            if (Number.parseFloat(value) < 1) {
              this.error.lessMinAmountFlag = true;
            }else{
              this.error.lessMinAmountFlag = false;
            }
            if (
              Number.parseFloat(this.amount) >
              Number.parseFloat(this.bankObj.todayAmount)
            ) {
              this.error.overAmountFlag = true;
              return;
            }else{
              this.error.overAmountFlag = false;
            }
            if(value.indexOf(".")){
              let afterDotLength= value.split(".")[1].length;
              if(afterDotLength >2){
                this.amount = value.slice(0,value.indexOf(".") + 3);
              }
            }

          }
        });
      }
    });
  },
  methods: {

    confirmFundOut() {
      if (!this.active) return;

      if (parseFloat(this.amount) > parseFloat(this.bankObj.unmatchedAmt)){
        this.$confirm({
          title:'提示',
          message: '本次转出需要转让已匹配租约，会导致您的每日租金收入降低，是否确认转出？',
          buttons: [{name: '我再想想'},{name:'确认转出'}],
          textAlign:'left',
        }).then((res) =>{
          if(res.index == 1){
            this.tradeInfoObj.showPasswordDailog = true;
          }
        });
      }else{
        this.tradeInfoObj.showPasswordDailog = true;
      }
    },
    hideTradeInfoDailog() {
      this.$refs.tradeContainer.showError = false;
      this.tradeInfoObj.showPasswordDailog = false;
    },
    async tradeInfoObjSubmitCb(password) {
      let res = await this.$http
        .post("wap/api/pay/withdraw/order/confirm", {
          commonLoading: true,
          amount: this.amount,
          checkCode: password
        });

      let data = res.data;
      let code = data.code;

      storage("userFundOutInfo",{
        "amount": this.amount
      });

      if (code == 1) {
        this.hideTradeInfoDailog();
        location.href = `../fundOutDetail/index.html`;
      } else {
        // 交易密码错误;
        this.$refs.tradeContainer.showError = true;
        this.$refs.tradeContainer.codeValue = '';
      }

    },
  },
  components: {
    tradePassword
  }
};
</script>
<style lang="sass">
 @import './fundOut.scss'
</style>




