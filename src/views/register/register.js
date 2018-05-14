import {
    getPara,
    goUrl,
    trim
} from 'assets/js/modules/tool'
import Vue from 'vue'
import Axios from 'assets/js/lib/axios/axios-vue2'
Vue.use(Axios)
export default {
    name:"register",
    data() {
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
    created() {
        let url = 'https://api.jianlc.com/wap/platform/v1/captcha/openid?random=1526031796156',
            params = {};
        this.$http.post(url, params)
        .then(response => {
            let resData = response.data;
            if (!response) {
                return false;
            }
            if (resData) {
                // this.$store.state.pageData = resData;
                console.log('nice');
            }
        });
    },
    mounted() {

    },
    components: {
        
    }
}
