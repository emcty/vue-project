<template>
    <section class="add-card-wrap">
        <!-- 上部分 Start -->
        <div class="user-info-box">
            <p class="defend-hint">
                <span>公安部监管信息安全</span>
            </p>
            <!-- 持卡人 Start -->
            <ul class="info-list">
                <li class="box">
                    <div class="line-til box box-align-center">
                        <p>持卡人</p>
                        <div @click="showCardholderExplain" class="question-icon"></div>
                    </div>
                    <div class="box-flex box box-align-center line-con">
                        <input v-model="identityUsername" ref="nameInput" type="text" placeholder="请输入持卡人姓名" maxlength="20">
                    </div>
                </li>
                <li class="box">
                    <div class="line-til box box-align-center">
                        <p>身份证号</p>
                    </div>
                    <div class="box-flex box box-align-center line-con">
                        <input @input="format('idCardNo', 'id')" v-model="idCardNo" type="tel" placeholder="请输入身份证号码" maxlength="20">
                    </div>
                </li>
            </ul>
            <!-- 持卡人 End -->

            <!-- 查看支持的银行卡 Start -->
            <div class="bank-info-til box">
                <div class="box-flex">请输入银行卡信息</div>
                <div @click="isShowSuppportList = true, $root.reportBurialPoint('AvailableBankPopup_Main', '“支持的银行卡”弹窗')" class="box-flex look-bank-list">查看支持的银行卡</div>
            </div>
            <!-- 查看支持的银行卡 End -->

            <!-- 银行卡号 Start -->
            <ul class="info-list">
                <li :style="{'border-bottom': isFirstStepOk ? '1px solid #e5e5e5' : 'none'}" class="box">
                    <div class="line-til box box-align-center">
                        <p>卡号</p>
                    </div>
                    <div class="box-flex box box-align-center line-con">
                        <div class="card-num box-flex">
                            <input @input="format('bankCardNo', 'bank'), checkBankCardNochange()" @focus="isBankCodeInputFocus = true" @blur="isBankCodeInputFocus = false" v-model="bankCardNo" type="tel" placeholder="请输入银行卡号码" maxlength="25">
                        </div>
                        <div @click="bankCardNo = ''" v-show="isBankCodeInputFocus && this.bankCardNo.length > 0" class="clear-card-num"></div>
                    </div>
                </li>
            </ul>
            <!-- 银行卡号 End -->
        </div>
        <!-- 下部分 Start -->
        <div class="bank-info-box">
            <!-- 银行卡信息 Start -->
            <ul v-show="isFirstStepOk" class="info-list">
                <li class="box">
                    <div class="line-til box box-align-center">
                        <p>银行卡</p>
                    </div>
                    <div @click="isShowSelectList = true, $root.reportBurialPoint('ChoiseBankPopup_Main', '“银行卡“弹窗')" class="box-flex box box-align-center line-con bank-detail">
                        <div v-if="bankCardInfo" class="box-flex">
                            <div class="box box-align-center box-pack-end">
                                <img class="bank-icon" :src="bankCardInfo.bankIcon">
                                <p class="bank-name">{{ bankCardInfo.bankName }}</p>
                            </div>
                            <p class="bank-limit">单笔限额{{ bankCardInfo.singleTradeLimit }}/单日限额{{ bankCardInfo.dailyTradeLimit }}</p>
                        </div>
                        <p v-else class="box-flex select-bank-card-hint">请选择银行卡</p>
                        <div class="arrow-icon"></div>
                    </div>
                </li>
                <li class="box">
                    <div class="line-til box box-align-center">
                        <p>银行预留手机号</p>
                        <div @click="showPhoneNumberExplain" class="question-icon"></div>
                    </div>
                    <div class="box-flex box box-align-center line-con">
                        <input @input="format('phoneNo', 'phone'), checkPhoneNochange()" v-model="phoneNo" type="tel" placeholder="请输入手机号" maxlength="13">
                    </div>
                </li>
                <li class="box">
                    <div class="line-til box box-align-center">
                        <p>短信验证码</p>
                    </div>
                    <div class="box-flex box box-align-center line-con">
                         <input v-model="smsNo" ref="smsInput" class="sms-code box-flex" type="tel" placeholder="请输入验证码" maxlength="6">
                         <div :class="{'gray': isCountDown || !isPhoneNoOk, 'active-btn': !isCountDown}" @click="getSmsNo" class="get-sms-code">{{ smsNoText }}</div>
                    </div>
                </li>
            </ul>
            <!-- 银行卡信息 End -->
        </div>
        <!-- 下部分 End -->

        <!-- 确认按钮 Start -->
        <div class="comfirm-box">
            <p class="comfirm-hint">注: 以上信息仅用于银行验证</p>
            <div :class="{'gray': !isAllInputOk || !isSelected}" @click="confirmCard" class="comfirm-btn">确认添加</div>
        </div>
        <!-- 确认按钮 End -->

        <!-- 协议提示 Start -->
<!--         <p class="agreement-text box">
            <Radio v-model="isSelected"></Radio>本人已充分阅读并同意<span @click="goUrl('../FundationProtocol/index.html?protocol=FundTransactionServiceAgreement'), $root.reportBurialPoint('AccountCard_Main_FundServiceCon', '“基金交易服务协议”点击', '../FundationProtocol/index.html?protocol=FundTransactionServiceAgreement')">《基金交易服务协议》</span><span @click="goUrl('../FundationProtocol/index.html?protocol=InvestorRights'), $root.reportBurialPoint('AccountCard_Main_InvestorNoiceCon', '“投资者权益须知”点击', '../FundationProtocol/index.html?protocol=InvestorRights')">《投资者权益须知》</span>，特申请开立基金交易账户
        </p> -->
        <!-- 协议提示 End -->

        <!-- 支持的银行卡弹层 Start -->
        <div class="support-bank fixed" v-show="isShowSuppportList" v-cloak>
            <div class="support-bank-dialog absolute">
                <h3>支持的银行卡<span class="close-btn" @click="isShowSuppportList = false"></span></h3>
                <div class="support-bank-cont" id="supportBank">
                    <ul>
                        <li v-for="item in bankCardList" class="support-bank-item">
                            <dl class="box box-align-center">
                                <dt :class="{'bank-icon-bg':!item.bankIcon}">
                                    <img v-if="item.bankIcon" class="bank-icon" :src="item.bankIcon">
                                </dt>
                                <dd class="box-flex">
                                    <p class="bank-name">{{item.bankName}}</p>
                                    <p class="bank-limit">单笔限额{{ item.singleTradeLimit }}/单日限额{{ item.dailyTradeLimit }}</p>
                                </dd>
                            </dl>
                        </li>
                    </ul>
                </div>
                <p class="more-bank cl9 text-ct relative">更多银行即将加入</p>
            </div>
        </div>
        <!-- 支持的银行卡弹层 End -->

        <!-- 选择银行卡弹层 Start -->
        <div v-show="isShowSelectList" class="select-bank-float">
            <div class="select-bank-box" :class="{'select-bank-animate': isShowSelectList}">
                <div class="font24 cl6 box box-pack-justify select-bank-title relative box-align-center">选择银行卡所属银行<span class="font36 cancel-select-bank block no-input-focus" @click="isShowSelectList = false, $root.reportBurialPoint('ChoiseBankPopup_Main_Close', '“取消“点击')">取消</span></div>
                <div class="select-bank-iscroll" id="selectBank">
                    <ul>
                        <li class="bank-list-item" v-for="item in bankCardList">
                            <dl @click="selectBankCard(item)" class="bank-item box box-align-center relative">
                                <dt :class="{'bank-icon-bg':!item.bankIcon}">
                                    <img v-if="item.bankIcon" class="bank-icon block" :src="item.bankIcon">
                                </dt>
                                <dd class="box-flex">
                                    <p class="bank-name font26 cl3">{{item.bankName}}</p>
                                    <p class="bank-limit cl9">单笔限额{{ item.singleTradeLimit }}/单日限额{{ item.dailyTradeLimit }}</p>
                                </dd>
                            </dl>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 选择银行卡弹层 End -->
    </section>
</template>

<script>
    import {
        getPara,
        goUrl,
        trim,
    } from 'assets/js/modules/tool'
    import {iScroll} from "assets/js/lib/iscroll/iscroll.js"
    // import Radio from "@components/UI/Radio.vue"

    export default {
        name: "bindBankCard",
        data() {
            return {
                // publicData: this.$store.state.publicData,
                isShowSuppportList: false, // 是否显示支持的银行弹层
                identityUsername: "", // 持卡人姓名
                idCardNo: "", // 身份证号码
                bankCardNo: "", // 银行卡号码
                prevBankCardNo: "", // 记录上一次的银行卡号码，来检测银行卡号码修改
                isBankCodeInputFocus: false, // 银行卡号码是否获取了焦点，控制清空按钮
                bankCardInfo: null, // 银行卡信息
                prevBankCardInfo: null, // 记录上一次的银行卡信息，来检测银行卡号码修改
                bankCardList: [], // 筛选银行卡列表
                phoneNo: "", // 银行预留手机号
                prevPhoneNo: "", // 记录上一次的手机号码，来检测手机号码修改
                smsNo: "", // 短信验证码
                smsToken: "", // 短信验证码token
                smsNoText: "获取验证码", // 获取验证码按钮文案
                isCountDown: false, // 是否在进行倒计时
                isShowSelectList: false, // 是否显示银行列表
                isSelected: true, // 是否选择了协议
                isGetting: false // 是否在获取数据
            };
        },
        computed: {
            /**
             * [isFirstStepOk 是否第一步OK]
             * @return {Boolean} [检测的结果]
             */
            isFirstStepOk() {
                return this.identityUsername && this.idCardNo && this.bankCardNo.length >= 18
            },
            /**
             * [isPhoneNoOk 手机号码是否输入OK]
             * @return {Boolean} [description]
             */
            isPhoneNoOk() {
                return this.phoneNo.length === 13
            },
            /**
             * [isAllInputOk 是否所有的input都输入完毕]
             * @return {Boolean} [检测的结果]
             */
            isAllInputOk() {
                return this.isFirstStepOk && this.bankCardInfo !== null && this.isPhoneNoOk && this.smsNo.length === 6
            }
        },
        created() {
            // this.getBankCardList()
            // this.$root.reportBurialPoint()
        },
        mounted(){
            this.$refs.nameInput.focus(); // 身份证输入框自动获取焦点
            // this.setIscroll()
        },
        methods: {
            getBankCardList() {
                // const url = "/html/app/fundation/BindCard/bankList.json"
                const url = "/fund/bankList"

                this.$http.post(url, this.publicData).then(res => {
                    this.bankCardList = res.data
                })
            },
            /**
             * [setIscroll 设置iscroll]
             * @return void
             */
            setIscroll() {
                ["selectBank", "supportBank"].forEach(item => {
                    new iScroll(item, {
                        checkDOMChanges: true,
                        bounce: false
                    })
                })
            },
            /**
             * [selectBankCard 选择银行卡归属]
             * @param  {[Object]} bankCardInfo [用户选择的银行卡的信息]
             * @return void
             */
            selectBankCard(bankCardInfo) {
                this.bankCardInfo = this.prevBankCardInfo = bankCardInfo
                this.isShowSelectList = false
                this.prevBankCardNo = this.removeSpace(this.bankCardNo)
            },
            getSmsNo() {
                if(this.isGetting || !this.isPhoneNoOk || !this.checkInput()){
                    return
                }
                this.isGetting = true
                const url = "/fund/openAccount/smsGet"
                this.httpSmsData = Object.assign({
                    bankCardNumber: this.removeSpace(this.bankCardNo),
                    bankCode: this.bankCardInfo.bankCode,
                    bankName: this.bankCardInfo.bankName,
                    identityNum: this.removeSpace(this.idCardNo),
                    identityUsername: this.identityUsername,
                    phone: this.prevPhoneNo = this.removeSpace(this.phoneNo)
                }, this.publicData)

                // 获取验证码
                this.$http.post(url, this.httpSmsData, {
                    show: false
                }).then(res => {
                    if(res.control.error === 0) {
                        this.countDown() // 进行倒计时
                        this.smsNo = "" // 每次获取验证码，都清空，以避免用户自己清空
                        this.$refs.smsInput.focus() // 自动获取焦点

                        this.smsToken = res.data.smsToken
                        this.errorText = ""
                    } else {
                        this.$toast({
                            msg: this.errorText = res.control.message
                        })
                    }
                    this.isGetting = false
                })

                // this.$root.reportBurialPoint("AccountCard_Main_MesNum", "“验证码”获取")
            },
            /**
             * [countDown 倒计时函数]
             * @return void
             */
            countDown() {
                clearInterval(this.timer)
                let countNum = 29;
                this.smsNoText = countNum + "s"
                this.isCountDown = true;
                this.timer = setInterval(() => {
                    this.smsNoText = --countNum + "s"
                    if(countNum <= 0) {
                        this.clearCountDown("重新发送")
                    }
                }, 1000)
                // this.getFirstSmsCode === undefined ? this.$root.reportBurialPoint("AccountCard_Main_GetMesNum", "“获取验证码”点击") : this.$root.reportBurialPoint("AccountCard_Main_RepetitionMesNum", "“重发验证码”点击")
            },
            /**
             * [clearCountDown 清除倒计时函数]
             * @param  {[String]} text [短信验证码文案]
             * @return void
             */
            clearCountDown(text) {
                this.smsNoText = text
                this.isCountDown = false
                clearInterval(this.timer)
            },
            /**
             * [checkPhoneNochange 检测输入的手机号是否变化]
             * @return void
             */
            checkPhoneNochange() {
                if(!this.isCountDown) {
                    return
                }

                const phoneNo = this.removeSpace(this.phoneNo)

                phoneNo.length >= 11 && this.prevPhoneNo && this.prevPhoneNo !== phoneNo && this.clearCountDown("获取验证码")
            },
            /**
             * [checkBankCardNochange 检测输入的手机号是否变化]
             * @return void
             */
            checkBankCardNochange() {
                const bankCardNo = this.removeSpace(this.bankCardNo)

                if(bankCardNo.length >= 14 && this.prevBankCardNo && this.prevBankCardNo !== bankCardNo) {
                    this.bankCardInfo = null
                    console.log(this.prevBankCardInfo)
                } else {
                    this.prevBankCardInfo && (this.bankCardInfo = this.prevBankCardInfo)
                }
            },
            /**
             * [confirmCard 确认使用此银行卡]
             * @return void
             */
            confirmCard() {
                if(!this.isAllInputOk || !this.checkInput(true) || this.isGetting){
                    return
                }

                if(!this.isSelected) {
                    this.$toast({
                        msg: "需同意相关协议"
                    })
                    return
                }

                if(this.smsToken === "") {
                    this.$toast({
                        msg: this.errorText
                    })
                    return
                }

                this.isGetting = true
                const url = "/fund/openAccount",
                    data = Object.assign({
                        bankCardNum: this.removeSpace(this.bankCardNo),
                        bankCode: this.bankCardInfo.bankCode,
                        bankName: this.bankCardInfo.bankName,
                        identityNum: this.removeSpace(this.idCardNo),
                        identityUsername: this.identityUsername,
                        phone: this.removeSpace(this.phoneNo),
                        smsCode: this.smsNo,
                        smsToken: this.smsToken
                    }, this.publicData)

                this.$http.post(url, data, {
                    show: false
                }).then(res => {
                    if(res.control.error == 0){
                        this.$toast({
                            type: "icon",
                            msg: "银行卡添加成功"
                        })

                        setTimeout(() => {
                            if(getPara("pageFrom") === "MyAccount") {
                                // goUrl(`../Index/index.html?userId=${storage("thirdUserId")}#/MyAccount`)
                                // this.$root.reportBurialPoint("AccountCard_Main_Enter", "“确认添加”点击")
                            } else {
                                goUrl("../SetPassword/index.html")
                                // this.$root.reportBurialPoint("AccountCard_Main_Enter", "“确认添加”点击")
                            }
                        }, 500)
                    } else {
                        this.$toast({
                            msg: res.control.message
                        })
                    }

                    this.isGetting = false
                })

                // this.$root.reportBurialPoint("AccountCardData_Main_MesNum", "“验证码”输入提交")
            },
            checkInput(smsCode) {
                if(!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(this.removeSpace(this.idCardNo))) {
                    this.$toast({
                        msg: "身份证格式不正确"
                    })
                    return
                }

                if(!/^1\d{10}$/.test(this.removeSpace(this.phoneNo))) {
                    this.$toast({
                        msg: "手机号格式不正确"
                    })
                    return
                }

                if(/\D/g.test(this.removeSpace(this.bankCardNo))) {
                    this.$toast({
                        msg: "银行卡格式不正确"
                    })
                    return
                }

                if(smsCode && !/^\d{6}$/g.test(this.removeSpace(this.smsNo))) {
                    this.$toast({
                        msg: "短信验证码格式不正确"
                    })
                    return
                }

                return true
            },
            /**
             * [removeSpace 去掉空格]
             * @param  {[String]} val [需要处理的值]
             * @return {[String]} [去掉后的结果]
             */
            removeSpace(val) {
                return val.replace(/\s/g, "")
            },
            /**
             * [format 添加空格]
             * @param  {[String]} key [需要处理的key值]
             * @param  {[String]} type [处理的不同的类型]
             * @return {[String]}      [处理好的结果]
             */
            format(key, type) {
                var str = "",
                    flag = false,
                    val = this[key].replace(/[^X\d]/g, "")

                if(val === "") {
                    return this[key] = ""
                }

                // 处理空格添加
                for (var i=0, len=val.length; i < len; i++) {
                    if (type == "phone") {
                        flag = (i == 2 || i == 6)
                    } else if (type == "id") {
                        flag = (i == 5 || i == 13)
                    } else if (type == "bank") {
                        flag = (i == 3 || i == 7 || i == 11 || i == 15)
                    }
                    if (flag) {
                        str = str + val.charAt(i) + " "
                    } else {
                        str = str + val.charAt(i)
                    }
                }

                this[key] = str.replace(/(\d|\s)(\s)$/, ($0, $1) => {
                    return $1
                })
            },
            showCardholderExplain() {
                this.$confirm({
                    title: "持卡人说明",
                    message: "为了您的账户资金安全，只能绑定您本人真实有效的银行卡。<br>为响应监管机构要求，平台暂不支持未满18周岁的用户绑卡。",
                    textAlign: "left",
                    buttons: [{
                        name: "我知道了"
                    }]
                })
                // this.$root.reportBurialPoint("AccountCard_BankcardIntroPopup_Main", "“持卡人说明“弹窗")
            },
            showPhoneNumberExplain() {
                this.$confirm({
                    title: "手机号说明",
                    message: "银行预留手机号是您在办理该银行卡时填写的手机号。没有预留号码，忘记号码或者已经停用，可联系银行客服更新处理。",
                    textAlign: "left",
                    buttons: [{
                        name: "我知道了"
                    }]
                })
                // this.$root.reportBurialPoint("AccountCard_PhoneNumIntroPopup_Main", "“持卡人说明“弹窗")
            },
            goUrl
        },
        // components: {
        //     Radio,
        //     YIF
        // }
    }
</script>
<style lang="sass">
    @import '../../assets/css/main.scss';
    @import './bindBankCard.scss';
</style>
