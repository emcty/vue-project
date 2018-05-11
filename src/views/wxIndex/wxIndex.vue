<template>
  <div class="wx-index-page com-page">
      <div class="wx-user-info">
            <div class="wx-user-photo">
                <img  :src="data.userInfo.headImgUrl" alt="">
            </div>
            <div class="wx-user-nick-name">{{data.userInfo.nickName}}</div>
            <div class="wx-user-number">工号：{{data.userInfo.userNo}}</div>
      </div>
     
      <div class="wx-menu-con">
      
        <router-link :to="{path: '/wxMakeCard'}" class="wx-mc-item make-smart-card">
            <i class="mci-icon"></i>
            <span class="mci-text">快速办卡</span>
            <i class="icon-arrow-r"></i>
        </router-link>
         
         <router-link :to="{path: 'wxOrderDetail'}" class="wx-mc-item search-process">
            <i class="mci-icon"></i>
            <span class="mci-text">进度查询</span>
            <i class="icon-arrow-r"></i>
         </router-link>
         <router-link :to="{path: 'wxContactUs'}"  class="wx-mc-item server-contect">
            <i class="mci-icon"></i>
            <span class="mci-text">专属客服</span>
            <i class="icon-arrow-r"></i>
         </router-link>
      </div>
  </div>
</template>
<script>
    import {
        getPara,
        goUrl,
        trim
    } from 'assets/js/modules/tool'
    export default {
        data: function() {
            return {
                data:{
                    userInfo:{
                        headImgUrl:'',
                        userNo: '',
                        nickName:'',
                    }
                }
            }
        },
        created: function(){
            // this.$alert("aaaa");
            // this.$toast('123');
            this.$confirm({
                title:'更新提示',
                message: '亲爱的简宝，使用更新版本简理财抢红包，更迅速呦！', 
                buttons: [{name: '取消'},{name:'立即更新'}],
                textAlign:'left'
            }).then((res) =>{
                if(res.index == 1){
                    jlcApp.updateApp();
                }
            });
        },
      
        components: {
            // smartLogo
        }
    }

</script>
<style scoped lang="sass">
@import 'wxIndex.scss'

</style>
