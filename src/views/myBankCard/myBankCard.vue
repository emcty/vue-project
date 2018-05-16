<template>
    <div class="bankCardBox">
    	<p class="titleText">实名认证信息</p>
        <!-- 身份 -->
        <div class="inputBox">
            <ul class="nameBox clearfix">
                <li>
                    真实姓名
                </li>
                <li>
                    *帆
                </li>
            </ul>
            <ul class="idBox clearfix">
                <li>
                    身份证号
                </li>
                <li>
                    110106********1234
                </li>
            </ul>
        </div>
        <!-- 身份 end -->
        <!-- 银行卡 -->
        <p class="titleText mt40">银行卡信息</p>
        <div class="cardInfoBox">
            <div class="bankLogoBox">
                <!-- <img src=""> -->
                <p class="bankLogo"></p>
            </div>
            <p class="bankName">招商银行</p>
            <p class="bankType">储蓄卡</p>
            <p class="bankNum">****  ****  ****  4149</p>
        </div>
        <!-- 银行卡 end -->
        <!-- 小贴士 -->
        <div class="tipsBox">
            <ul class="line-cross">
                <li></li>
                <li class="content">
                    <img src="../../assets/images/houseImg.png" class="houseImg">小贴士
                </li>
                <li></li>
            </ul>
        </div>
        <!-- 小贴士 end -->
        <!-- 文案 -->
        <div class="cardInto">
            <p>同卡进出，保证您的资金安全</p>
            <p>为了保障您的账户资金安全，您在天天房东只能绑定一张银行卡，确保您的资金只能转出到您的付款银行卡中，他人无法盗用您的资金。</p>
            <img src="../../assets/images/buyPutImg.png" class="buyPutImg">
        </div>
        <!-- 文案 end -->
    </div>
</template>
<script>
	import {
	    getPara,
	    goUrl,
	    trim,
	    cookie
	} from 'assets/js/modules/tool'
	export default {
	    name:"myBankCard",
	    data() {
	        return {
	            
	        }
	    },
	    created() {
	        document.title = '我的银行卡';
	    },
	    mounted() {
	    	
	    },
        methods:{
        	
        },
	    components: {
	        
	    }
	}
</script>
<style lang="sass">
    @import '../../assets/css/main.scss';
    @import './myBankCard.scss'
</style>
