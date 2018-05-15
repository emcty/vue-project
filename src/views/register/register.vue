<template>
    <div class="registerBox">
    	<!-- 输入框 -->
        <ul class="form">
        	<li>
        		<input class="width500" id="phoneNumber" type="tel" maxlength="13" placeholder="请输入11位中国大陆手机号" v-model="dataParams.phoneNum">
                <img class="btn-clear absolute clear" transition="fade" alt="close" src="../../assets/images/clear.png" v-show="dataParams.phoneNum" @click="clearPhoneNumFn"/>
        	</li>
        	<li v-show="isCheckPhoneNum && !isCheckImgCode" transition="fade">
        		<input class="width350" type="text" maxlength="4" placeholder="请输入图片验证码" v-model="dataParams.imgCode">
                <img class="img-checkCode absolute" :src="imgCodeUrl" @click="getImgCodeFn">
        	</li>
        	<li v-show="isCheckImgCode" transition="fade">
        		<input class="width350" type="tel" maxlength="6" placeholder="请输入短信验证码" v-model="dataParams.shortMsgCode">
                <button class="btn-getCheckCode absolute" :class="{disable:shortMsgCodeObj.disable}" v-text="shortMsgCodeObj.text" @click="getShortMsgCodeFn">30s</button>
        	</li>
        </ul>
        <!-- 输入框 end -->
		<!-- 错误提示 -->
        <div class="error-wrap">
        	<span v-show="errorTxt">
        		<img src="../../assets/images/errorImg.png" class="errorImg">
        		<span v-text="errorTxt"></span>
        	</span>
        </div>
        <!-- 错误提示 end -->
        <!-- 按钮 -->
        <button class="btns-register btn-login" :class="{active:isCheckPhoneNum && isCheckImgCode && dataParams.shortMsgCode.length>=6 && radioActive}" @click="loginRegisterFn">注册/登录</button>
        <!-- 按钮 end -->
        <!-- 协议 -->
        <div class="agreement" :class="{'active':radioActive}">
        	<span class="radio relative" @click="toggleSelect">我已阅读并同意</span>
        	<span class="agree">《xxx服务协议》</span>
        </div>
        <!-- 协议 end -->
        <!-- 页脚 -->
       	<article class="footer">
       		<ul class="line-cross">
       			<li></li>
       			<li class="content">做房东，谁说一定要买房</li>
       			<li></li>
       		</ul>
       	</article>
       	<!-- 页脚 end -->
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
	    name:"register",
	    data() {
	        return {
	            dataParams: {//用户数据
	                userId: '',
	                token: '',
	                phoneNum: '',//手机号
	                imgCode: '',//图片验证码
	                shortMsgCode: ''//短信验证码
	            }
	            , shortMsgCodeObj: {//短信验证对象
	                disable: false,
	                timer: null,//倒计时timer
	                text: '',//按钮文案
	                seconds: 30//倒计时时长
	            }
	            , sourceObj: {
	                fromSource: getPara('fromSource'),
	                wxopenId: getPara('openId'),//微信openId 此处因往期版本命名原因，保留原有命名。
	                openId: getPara('openId'),//调用图片验证码后，返回的openId供发短信接口验证秀
	                source: cookie('source') || getPara('source') || 'wap_luodiye'
	            }
	            , API: {
	                getImgCode: '',//获取图形验证码
	                getShortMsgCode: '',//发送短信验证码
	                regOrLoginWap: '',//wap注册登录
	                regOrLoginWx: ''//微信注册登录
	            }
	            , imgCodeUrl: ''	//图片验证码url
	            , radioActive: true //radio选中状态，同意按钮
	            , isCheckPhoneNum: false//手机号校验状态
	            , isCheckImgCode: false//图片验证码校验状态
	            , errorTxt: ''//校验错误提示文案
	            , seconds: 0//倒计时时钟
	            , ERROR_OK: 0 //API接口返回验证 0正常
	            , isShowCapacity: false//禁止本页面弹窗
	        }
	    },
	    created() {
	        
	    },
	    mounted() {
	    	this._initFn();//程序入口
	    },
	    watch: {
            'dataParams.phoneNum': function (newV, oldV) {
                this.checkPhoneNumFn(newV, oldV);
            }
            , 'dataParams.imgCode': function (newV, oldV) {
                this.checkImgCodeFn(newV, oldV)
            }
            , 'dataParams.shortMsgCode': function (newV, oldV) {
                if (newV.length < oldV.length || oldV == '' && newV.length == 1) {//修改密码隐藏错误提示
                    this.errorTxt = '';
                }
            }
        },
        methods:{
        	/**
             * init 启动
             * */
            _initFn: function () {

                /*以下为业务相关*/
                this.seconds = this.shortMsgCodeObj.seconds;//初始化倒计时时钟
                // this.getImgCodeFn();//获取图片验证码
                // this.burialPoint();
            }
            /**
             * 同意单选radio的状态切换
             * @return void
             * */
            , toggleSelect: function () {
                this.radioActive = !this.radioActive;
            }
            /**
             * 清空手机号
             * @return void
             * */
            , clearPhoneNumFn: function () {
                this.dataParams.phoneNum = '';
            }
            /**
             * 获取图片验证码
             * @return void
             * */
            , getImgCodeFn: function () {
                // var url = this.API.getImgCode;
                // this.$http.post(url, {})
                // .then(function (res) {
                //     res = res.json();
                //     if (res.data) {
                //         if (res.control.error == this.ERROR_OK) {
                //             this.sourceObj.openId = res.data.openid;
                //             //对验证码图片赋url
                //             this.imgCodeUrl = GlobalPath.ajaxurl + '/wap/platform/v1/captcha/code?openid=' + this.sourceObj.openId;
                //         }
                //     }
                // });

                let url = this.API.getImgCode,
	                params = {};
	            this.$http.post(url, params)
	            .then(response => {
	                let resData = response.data;
	                if (!response) {
	                    return false;
	                }
	                if (resData) {
	                    this.sourceObj.openId = res.data.openid;
                        //对验证码图片赋url
                        this.imgCodeUrl = GlobalPath.ajaxurl + '/wap/platform/v1/captcha/code?openid=' + this.sourceObj.openId;
	                }
	            });
            }
            /**
             * 校验手机号
             * @return void
             * */
            , checkPhoneNumFn: function (newV, oldV) {
                //控制手机号修改时错误提示
                if (newV.length < oldV.length) {
                    this.errorTxt = ''
                    this.isCheckPhoneNum = false;
                    //重置所有流程状态
                    this.resetAll();
                } else if (newV !== oldV) {
                    //处理分隔符
                    
                    clearTimeout(timer);
                    var timer = setTimeout(function(){
                        var reg = /^1[3-9]\d{9}$/,
                            temPhoneNum = this.dataParams.phoneNum;
                        // temPhoneNum = temPhoneNum.replace(/\s+/g, '');
                        var temPhoneTrim = temPhoneNum.replace(/\s+/g, '').substr(0, 11);
                        var mLength = temPhoneTrim.length;
                        if (mLength > 3 && mLength < 8) {
                            temPhoneNum = temPhoneTrim.replace(/^(...)/g, "$1 ");
                        } else if (mLength >= 8) {
                            temPhoneNum = temPhoneTrim.replace(/^(...)(....)/g, "$1 $2 ");
                        } else {
                            return false;
                        }
                        this.dataParams.phoneNum = temPhoneNum;
                        this.dataParams.phoneNumTrim = temPhoneTrim;

                        if (reg.test(temPhoneTrim)) {//校验
                            //重新获取图片验证码
                            this.getImgCodeFn();
                            this.isCheckPhoneNum = true;
                            //设置焦点到图片验证码
                            this.$els.imgCode.focus()
                        } else {

                            if (this.dataParams.phoneNum.length >= 13) {
                                this.isCheckPhoneNum = false;
                                this.errorTxt = '手机号错误！'
                            }
                        }
                    }.bind(this),10);
                }
            }
            /**
             * 校验图形验证码
             * */
            , checkImgCodeFn: function (newV, oldV) {
                //控制手机号修改时错误提示
                if (newV.length < oldV.length) {
                    this.errorTxt = ''
                    this.isCheckImgCode = false;
                } else if (newV !== oldV) {
                    if (this.dataParams.imgCode.length >= 4) {
                        var regtel = /^[A-Za-z0-9]+$/;
                        if (regtel.test(this.dataParams.imgCode)) {//校验
                            //发送短信验证码 并开始倒计时
                            this.sendMsgCodeFn();
                        } else {
                            this.errorTxt = '验证码错误！'
                            this.isCheckImgCode = false;
                        }
                    }
                }
            }
            /**
             * 获取短信验证码(再次获取)
             * */
            , getShortMsgCodeFn: function () {
                if (this.seconds == this.shortMsgCodeObj.seconds) {//防止重复点击
                    this.shortMsgCodeObj.text = this.shortMsgCodeObj.seconds + 'S'
                    this.seconds = this.shortMsgCodeObj.seconds;
                    this.sendMsgCodeFn();
                }
            }
            /**
             * 发送短信验证码，开始倒计时
             * */
            , sendMsgCodeFn: function () {
                let _this = this;
                let url = this.API.getShortMsgCode,
                    dataParams = {
                        phoneNumber: this.dataParams.phoneNum.replace(/\s+/g, ''),
                        openid: this.sourceObj.openId,
                        wapValidateCode: this.dataParams.imgCode,
                        type: 1,
                        channel: 2
                    };
                 this.$http.post(url, dataParams)
                 .then(function (res) {
                    // res = res.json();
                     let resData = response.data;
                    if (resData) {

                        if (res.control.error == this.ERROR_OK) {//校验成功
                            this.errorTxt = '验证码已发送至手机'

                            $.cookie("wapValidateCode", this.dataParams.imgCode);
                            $.cookie("openId", this.openId);

                            this.isCheckImgCode = true;
                            this.$els.shortMsgCode.focus();

                            clearInterval(_this.shortMsgCodeObj.timer)//重置时钟及秒数用于用户再各种情况下清空或修改手机号，流程重置

                            this.shortMsgCodeObj.text = _this.seconds + 'S';
                            this.shortMsgCodeObj.timer = setInterval(function () {
                                if (_this.seconds == 0) {
                                    _this.shortMsgCodeObj.text = '重新发送';
                                    _this.seconds = _this.shortMsgCodeObj.seconds;
                                    clearInterval(_this.shortMsgCodeObj.timer)
                                    return false;
                                }
                                _this.shortMsgCodeObj.text = _this.seconds-- + 'S'
                            }, 1000)
                        } else if (res.control.error === -2409) {//验证码过期
                            this.errorTxt = res.control.message;
                            this.isCheckImgCode = false;
                            this.imgCode = ''
                            this.getImgCodeFn();
                        } else if (res.control.error < -2001 & res.control.error > -2999) { //校验失败
                            // this.isCheckImgCode = false;
                            _this.shortMsgCodeObj.text = '重新发送';
                            this.errorTxt = res.control.message || '验证码错误！';
                        }
                    }
                });
            }
            , resetAll: function () {
                //隐藏图形和短信验证码，并重置其状态为false
                this.$nextTick(function () {
                    clearInterval(this.shortMsgCodeObj.timer);
                    this.dataParams.imgCode = this.dataParams.shortMsgCode = '';
                    this.isCheckPhoneNum = this.isCheckImgCode = false;
                })
            }
            /**
             * 注册/登录
             * */
            , loginRegisterFn: function () {
                if (this.isCheckPhoneNum && this.isCheckImgCode && this.dataParams.shortMsgCode.length >= 6 && this.radioActive) {

                    var url = this.API.regOrLoginWap,
                        dataPars = {
                            phoneNumber: this.dataParams.phoneNum.replace(/\s+/g, ''),
                            authCode: this.dataParams.shortMsgCode,
                            source: this.sourceObj.source
                        };
                    if (this.sourceObj.fromSource == 'wechatService') {//微信服务号
                        url = this.API.regOrLoginWx;
                        dataPars.openId = this.sourceObj.wxopenId;
                    }

                    this.$http.post(url, dataPars).then(function (res) {
                        res = res.json();
                        if (res.data) {
                            if (res.control.error == this.ERROR_OK) {
                                $.cookie('userId', res.data.userId);
                                $.cookie('token', res.data.tokenInfo.token);
                                this.goBackUrl();
                            } else {
                                this.errorTxt = res.control.message
                            }
                        }
                    })
                    // fddd.talkData('注册/登录点击','register_click');
                    this.pushDataFn('btn_register_click');
                }
            }
            /**
             * goBackUrl 返回登录前页面
             * @return void
             * */
            , goBackUrl: function () {
                var fromUrl = $.cookie('formUrl') || $.trim($.getPara('formUrl')) || $.trim($.getPara('fromUrl'));
                if (!fromUrl || fromUrl == 'index') {
                    this.goUrl(GlobalPath.wapHtml);
                } else
                    this.goUrl(GlobalPath.wapHtml + '/wap/' + fromUrl + '.html');
                // window.history.go(-1);
                $.cookie('formUrl','');
            }
            , goUrl: function (url) {
                window.location.replace(url)
            }
            // , /**
            //  * pushDataFn 埋点方法
            //  * */
            // pushDataFn: function (val) {
            //     this.burialPoint({name: val});
            //     TDAPP.onEvent(val);
            // }
            // /**
            //  * burialPoint 封装数据埋点
            //  * @param obj {Object} 埋点数据对象。
            //  * @return void
            //  * */
            // , burialPoint: function (obj) {
            //     if (!this.pushData) {
            //         require(["push"], function () {
            //             this.pushData = new UserData();
            //         }.bind(this));
            //     } else {
            //         this.pushData.clickEvents(obj.url || window.location.href, obj.name || '');
            //     }
            // }
        },
	    components: {
	        
	    }
	}
</script>
<style lang="sass">
    @import './register.scss'
</style>
