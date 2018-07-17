<template>
  <div>
    <div class="loading" v-show="loading">
      <img src="./images/loading.gif">
    </div>
    <div class="form-container" v-show="!loading">
      <div class="item">
        <label for="money">转入金额</label>
        <div class="amount-wrapper">
          <input type="number" id="money" v-model="amount"  @input="handleInput($event.target.value)" :placeholder='"最少需转入"+bankObj.minAmount'><em>元</em>
        </div>
      </div>
      <div class="card-container item">
        <span>支付银行卡</span>
        <div class="card-item clearfix">
          <img :src="bankObj.bankIcon" alt="" width="64" height="64">
          <div class="card-info">
            <p>{{bankObj.bankSimpleName}}（尾号{{bankObj.bankCard}}）</p>
            <p>单笔限额{{bankObj.singleLimit}}／单日限额{{bankObj.dayLimit}}</p>
          </div>
        </div>
      </div>
      <div class="item" v-show="couponInfo.couponId && amount">
        <label>激活租约体验券</label>
        <div class="my-voucher" @click="chooseVoucher">
          <img src="./images/icon.png"><span>{{couponInfo.voucherAmount}}元</span><img src="./images/nav-li-arrow.png">
        </div>
      </div>
      <div class="error">
        <p v-show="error.lessMinAmountFlag">请最少转入{{bankObj.minAmount}}元</p>
        <p v-show="error.overSingleAmountFlag">您的银行卡单笔最高可支付{{bankObj.singleLimitAmount}}元</p>
      </div>
      <div :class="{'sure-container':true,'active':active}" @click="comfirmFundIn" data-report='{"enName":"into_ok","cnName":"转入-确认转入"}'>确认转入</div>
      <div class="agreement">
        <span :class="{'radio':true,'disactive':!checkRadioFlag}" @click="handleAgreement"></span>
        我已阅读并同意
        <span>
          <a href="../fundAgreement/index.html">
          《代扣代支付授权委托协议》
          </a>
        </span>
      </div>
      <trade-password  ref="tradePasswordContainer" :findPasswordUrl="tradeInfoObj.findPasswordUrl" :show="tradeInfoObj.showPasswordDailog"
      @submitCb="tradeInfoObjSubmitCb($event,passwordVal)" @hide="hideTradeInfoDailog">
       
      </trade-password>

      <trade-phone-message  ref="tradeMessageContainer"  :show="tradeInfoObj.showMessageDailog" :phone="bankObj.phone"
      @getMessageCodeFn="getMessageCodeFn" :startRun.sync="tradeInfoObj.startRun" :errorMessage="tradeInfoObj.errorMessage"
      @submitCb="tradeMessageSubmitCb($event,messageVal)" @hide="hideTradeInfoDailog">
      </trade-phone-message>
    </div>

  </div>
</template>
<script>
import tradePassword from "./components/tradePassword.vue";
import tradePhoneMessage from "./components/tradePhoneMessage.vue";
import { storage } from '@js/modules/tool';
import { JSEncrypt } from '@js/lib/rsa/jsencrypt.min.js';

// 快捷支付需要
let orderId = "";

export default {
  data() {
    return {
      bankObj: {
        // bankIcon: "/wap/api/pay/jianshe.png",
        // bankSimpleName: "CCB",
        // bankCard: "2344",
        // singleLimit: "10万",
        // singleLimitAmount: "100000",
        // dayLimit: "10万",
        // minAmount: "1000",
        // type: 1 交易密码
        // type: 2 短信验证码
        // phone: 1343444444,
        // publicKey:aetetetete 用于解密
      },
      checkRadioFlag: true,
      amountPassFlag: false,
      loading: true,
      amount: "",
      couponInfo: {
        voucherAmount: "", //体验券金额
        couponId: "", //体验券ID
      },
      error: {
        lessMinAmountFlag: false,
        overSingleAmountFlag: false
      },
      tradeInfoObj: {
        /** 非快捷支付交易密码 */
        findPasswordUrl:
          "../setPassword/index.html?pageType=ForgetPassword&fromUrl=fundIn",
        showPasswordDailog: false,
        /** 快捷支付短信验证码 */
        showMessageDailog: false,
        startRun: false,
        errorMessage: ""
      }
    };
  },
  computed: {
    active() {
      if (this.amount) {
        if (
          !this.error.lessMinAmountFlag &&
          !this.error.overSingleAmountFlag &&
          this.checkRadioFlag
        ) {
          return true;
        }
      }
      return false;
    },
  },
  watch:{
    amount(newVal,oldVal){
      if(this.active && !this.couponInfo.voucherAmount){
        this.getCouponVoucher();
      }
    },
  },
  beforeCreate(){
    window.onpageshow=(e)=>{
      if(!e.persisted){
        this.amount = "";
        storage("couponInfo",null);
      }
    }
  },
  destroyed(){

  },
  async created() {

    let couponInfo = storage("couponInfo");

    if(couponInfo != "null"){
      this.amount = couponInfo.amount;
      this.couponInfo.voucherAmount = couponInfo.voucherAmount;
      this.couponInfo.couponId = couponInfo.couponId;
    }
    try {
      let data = await this.$http.post("wap/api/pay/recharge/");

      this.loading = false;
      this.bankObj = data.data;
    } catch (err) {}
  },
  mounted() {
  },
  methods: {
    handleAgreement() {
      this.checkRadioFlag = !this.checkRadioFlag;
    },
    handleInput(value) {
      this.couponInfo = "";
      // 最小最大金额限制，最长9位，保留小数点后两位，不允许特殊字符输入
      this.amount = this.amount.replace(/\-|\s|[^\d.]/g, "");

      if (value.length > 9) {
        this.amount = value.slice(0, 9);
      }
      if (Number.parseFloat(value) < this.bankObj.minAmount) {
        this.error.lessMinAmountFlag = true;
      } else {
        this.error.lessMinAmountFlag = false;
      }

      if (
        Number.parseFloat(value) >
        Number.parseFloat(this.bankObj.singleLimitAmount)
      ) {
        this.error.overSingleAmountFlag = true;
      } else {
        this.error.overSingleAmountFlag = false;
      }
      if (value.indexOf(".") > 0) {
        let afterDotLength = value.split(".")[1].length;

        if (afterDotLength > 2) {
          this.amount = value.slice(0, value.indexOf(".") + 3);
        }
      }
    },
    async getCouponVoucher(){
      try{
        let res = await this.$http.post("/wap/api/couponSelect", {
          amount: this.amount
        });

        this.couponInfo = res.data;

      }catch(error){
        this.couponInfo.couponId = "";
   
      }
    },
    comfirmFundIn() {
      if (!this.active) return;
      if (this.bankObj.type == 1) {
        this.tradeInfoObj.showPasswordDailog = true;
      } else {
        this.tradeInfoObj.showMessageDailog = true;
        this.tradeInfoObj.startRun = true;
      }
    },
    async getMessageCodeFn(sendType) {
      // 默认sendType 1 重发短验sendType 2
      let res = await this.$http.post("/wap/api/pay/recharge/order/sendSMS", {
        amount: this.amount,
        orderId,
        sendType
      });

      orderId = res.data.orderId;
      if(res.data.code == 0){
        this.tradeInfoObj.errorMessage = res.data.errorMessage;
        this.$refs.tradeMessageContainer.showError = true;
      }
    },

    hideTradeInfoDailog() {
      let type = this.bankObj.type;
      // type为1交易密码,其他快捷支付
      if (type == 1) {
        this.$refs.tradePasswordContainer.showError = false;
        this.tradeInfoObj.showPasswordDailog = false;
      } else {
        this.$refs.tradeMessageContainer.showError = false;
        this.tradeInfoObj.showMessageDailog = false;
        this.tradeInfoObj.startRun = false;
      }
    },

    async tradeInfoObjSubmitCb(passwordVal) {
      let res = await this.$http.post("wap/api/pay/recharge/order/confirm", {
        commonLoading: true,
        amount: this.amount,
        checkCode: this.encrypt(passwordVal),
        couponId: this.couponInfo.couponId
      });
      let data = res.data;

      storage("userFundInInfo",{
        "amount": this.amount,
        "orderId": data.orderId,
        "tradeCode": data.tradeCode
      });

      //code 1交易成功，0密码输入错误，2交易失败
      if (data.code == 0) {
        this.$refs.tradePasswordContainer.showError = true;
        this.$refs.tradePasswordContainer.codeValue = "";
      } else if (data.code == 1) {
        this.hideTradeInfoDailog();
        location.href = `../fundInDetail/index.html`;
      } else {
        location.href = `../fundInFail/index.html`;
      }
    },
    async tradeMessageSubmitCb(messageVal) {
      let res = await this.$http.post(
        "wap/api/pay/recharge/order/quickConfirm",
        {
          commonLoading: true,
          orderId,
          checkCode: messageVal,
          couponId: this.couponInfo.couponId
        }
      );
      let data = res.data;

      storage("userFundInInfo",{
        "amount": data.amount,
        "orderId": data.orderId,
        "tradeCode": data.tradeCode
      });

      if (data.code == 0) {
        this.tradeInfoObj.errorMessage = data.errorMessage;
        this.$refs.tradeMessageContainer.showError = true;
        this.$refs.tradeMessageContainer.codeValue = "";
      } else if (data.code == 1) {
        this.hideTradeInfoDailog();
        location.href = `../fundInDetail/index.html`;
      } else {
        location.href = `../fundInFail/index.html`;
      }
    },
    encrypt(code) {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.bankObj.publicKey);
      return encrypt.encrypt(code);    
    },
    //体验券
    chooseVoucher(){

      storage("couponInfo", {
        amount: this.amount,
        voucherAmount: this.couponInfo.voucherAmount,
        couponId: this.couponInfo.couponId
      });
      
      this.$router.push({ 
        name: "activeVoucher",
        query: {
          couponId: this.couponInfo.couponId,
          amount: this.amount
        }
      });
 
      
    }
  },
  components: {
    tradePassword,
    tradePhoneMessage
  }
};
</script>
<style lang="sass">
 @import './fundIn.scss'
</style>


