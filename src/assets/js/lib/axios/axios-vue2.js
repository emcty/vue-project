/*
 * @Author: zhaobendong 
 * @Date: 2017-12-07 15:53:32 
 * @Last Modified by: zhaobendong
 * @Last Modified time: 2018-02-02 14:58:55
 * @Describetion: axios网络请求js封装
 */

// 引入 本地的axios文件 文档 https://www.npmjs.com/package/axios
// require('es6-promise').polyfill();
import axios from "axios"
// import GlobalPath from '../main'
import Vue from 'vue'
import Confirm from '../../../../components/confirm'
let Base64 = require('js-base64').Base64;

Vue.use(Confirm)

// console.log(GlobalPath.ajaxurl)
// 请求数据的序列化 qs是nodejs的一个库 文档 https://www.npmjs.com/package/qs
const axiosAPI = axios.create({
    // 设定请求借口的域名地址
    baseURL: '',
    // 网络请求时间，如果超过8秒，请求将被取消
    timeout: 8000,
    // 设置返回数据为json格式
    responseType: "json",
    // 是否允许携带cookie，默认是false，不允许
    withCredentials: false,
    // http状态验证，你可以规定状态码的范围，比如 status >= 200 && status < 300，记住是一个boolean值
    validateStatus: function (status) {
        return true
    },
    // 请求头部
    // headers: {
    //     "Content-Type": "application/x-www-form-urlencodedcharset=utf-8",
    //     "X-Requested-With": "XMLHttpRequest"
    // }
    // 对请求时数据进行序列化处理，如果传输的数据是json格式的，那么需要特殊处理转换成x-www-form-urlencoded该格式
    transformRequest: [function (data, headers) {
        // 判断传入是不是对象，初始化请求数据的格式（POST形式）
        if (Object.prototype.toString.call(data) === '[object Object]') {
            let keys = Object.keys(data)
            // 把对象里面的键值对拼接成userId=234cd8fbcdbe4bd3943e02a44ce10213&token=267BA2AB6760D7634B99EA12976227DF这样的形式
            return keys.map((name) => `${name}=${encodeURIComponent(data[name])}`).join('&')
        }
    }]
})


// 请求拦截，可以设置一些参数等等  文档 https://www.npmjs.com/package/axios
axiosAPI.interceptors.request.use(config => {
    // 请求头部中的Accept的值
    // config.headers.Accept = "application/json"
    // 如果是post请求，那么需要数据序列化
    if(!!config.isAddHeader){//增加header中风控字段和用户状态字段
        let temHeaders= ToolsFK.getBlackBox();
        temHeaders.Authorization= "Basic " + Base64.encode(config.data.userId + ":" + config.data.token)
        config.headers= temHeaders
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

// 响应拦截 对于返回的数据进行处理
axiosAPI.interceptors.response.use(res => {
    const status = res.status
    if (status === 200) {
        return Promise.resolve(res)
    } else {
        return Promise.reject(res)
    }
})

// 请求的方式post，get，请求对象exportAjaxAPI封装（包含了post，get）
const axiosRequestMethod = ["post", "get"]
const exportAjaxAPI = {}
let clickLimit
axiosRequestMethod.forEach(method => {
    // 统一处理所有的请求, config可配置弹窗的显示，默认情况是显示的，不需要额外处理error不为0的情况
    exportAjaxAPI[method] = function (url, data, config={}) {
        typeof config.show =='undefined' && (config.show = true)
        // 返回一个Promise对象
        return new Promise((resolve, reject) => {
            // 创建空的透明的蒙层，防止用户多次点击
            if (!clickLimit) {
                clickLimit = window && document.createElement("div")
                clickLimit.className = "clickLimit"
                document.body.appendChild(clickLimit)
            }else {
                clickLimit.style.display = "block"
            }
            axiosAPI[method](url, data, config).then(response => {
                clickLimit.style.display = "none"
                // 处理后台返回结果
                if (response.data) {
                    // 正常情况。Promise处理，抛出数据
                    if (response.data.control.error == 0) {
                        resolve(response.data)
                    } else {
                        if (config.show) {
                            // 其他情况给与弹层提示
                            Vue.prototype.$confirm({message: response.data.control.message, buttons: [{name: '确定'}]}).then((res) => {
                                // if(res === 1) {
                                //     conos
                                // }
                            })
                        } else {
                            resolve(response.data.control)
                        }
                    }
                }

            }).catch(error => {
                clickLimit.style.display = "none"
                Vue.prototype.$confirm({message: '网络异常', buttons: [{name: '确定'}]}).then((res) => {
                    // if(res === 1) {
                    //     conos
                    // }
                })
                reject(error)
            })
        })
    }
})
// Vue.use({
//     install: function (Vue, Option) {
//         Object.defineProperty(Vue.prototype, "$http", {
//             value: exportAjaxAPI
//         })
//     }
// })
// Vue.prototype.$http = function () {
//     return exportAjaxAPI
// }

// Vue插件编写的流程，使用Vue.use(名字)即可使用，vue会自动的去调用install方法，在vue组件中使用this.$http.get(....).then()等等
export default {
    install: function (Vue, Option) {
        Object.defineProperty(Vue.prototype, "$http", {
            value: exportAjaxAPI
        })
    }
}