/**
 * Created by RuiXue on 2017/7/17. sdfsdfsf
 * edit on 2017/10/30 通过设备dpr进行适配，覆盖机型更准确。
 * edit on 2018/1/9 Ruixue 增加同盾及通付盾上报数据代码
 * edit on 2018/3/30 Ruixue 新需求，前端不用控制上报页面及source
 */
(function () {
    var width = window.meta && window.meta.uiWidth || 750,//设计稿宽，默认750px,//设计稿宽度
        pw = parseInt(window.screen.width),
        scale = pw / width,
        u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        var version = parseFloat(u.slice(u.indexOf("Android") + 8)),
            dpr = window.devicePixelRatio < 1.4 ? '330' : window.devicePixelRatio <= 2 ? '400' : 'device-dpi';
        if (version > 2.3) {
            document.write('<meta name="viewport" content="width=' + width + ',minimum-scale=' + scale + ',maximum-scale=' + scale + ',target-densitydpi=' + dpr + ',user-scalable=no">');
        } else {
            document.write('<meta name="viewport" content="width=' + width + ',target-densitydpi=device-dpi,user-scalable=no">');
        }
    } else {
        //适配iphone底部1px白边
        scale = Math.floor(scale * 100) / 100
        document.write('<meta name="viewport" content="width=' + width + ',minimum-scale=' + scale + ',maximum-scale=' + scale + ',target-densitydpi=device-dpi,user-scalable=no">');
    }


    /**
     * 通盾参数
     * */
    _fmOpt = {
        arrConfigPages: [//上报风控代码的页面集
            // 'wap/register.html',
            // 'wap/bindcard.html'
        ],
        sources: [//仅这些渠道时，且注册页时上报
            // 'leshitq_icon_03',
            // 'zuimeitq_icon_08',
            // 'weishangguanjia_01'
        ],
        partner: 'jianlc',
        appName: 'jianlc_H5',
        token: 'jianlc' + "-" + new Date().getTime() + "-" + Math.random().toString(16).substr(2),
        fmb: true,
        getinfo: function () {//有效期15天
            return "e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=";
        },
        fpHost: 'https://fp.fraudmetrix.cn',
        staticHost: 'static.fraudmetrix.cn',
        // tcpHost: 'fpflashtest.fraudmetrix.cn',
        // wsHost: 'fptest.fraudmetrix.cn:9090',
        // ts: (new Date().getTime() / 3600000).toFixed(0)


        // fpHost: 'https://fptest.fraudmetrix.cn',
        // staticHost: 'statictest.fraudmetrix.cn',
        // tcpHost: 'fpflashtest.fraudmetrix.cn',
        // wsHost: 'fptest.fraudmetrix.cn:9090',
        ts: (new Date().getTime() / 3600000).toFixed(0)
    };
    /**
     * 风控工具类
     * */
    var ToolsFK = {
        checkPage: function () {
            var arrConfigPagesLength = _fmOpt.arrConfigPages.length;
            if (arrConfigPagesLength) {
                var pagePathName = this.getPagePathName();

                var result = false;
                for (var i = 0; i < _fmOpt.arrConfigPages.length; i++) {
                    var reg = new RegExp(_fmOpt.arrConfigPages[i], 'g')
                    if (new RegExp(_fmOpt.arrConfigPages[0], 'g').test(pagePathName)) { //注册页时、
                        if (reg.test(pagePathName)) {
                            var source = this.getPars('source');
                            for (var ii = 0; ii < _fmOpt.sources.length; ii++) {
                                // var reg2 = new RegExp(_fmOpt.sources[ii], 'g');
                                if (source === _fmOpt.sources[ii]) {
                                    result = true;
                                    break;
                                }
                            }
                        }

                    } else {
                        if (reg.test(pagePathName)) {
                            result = true;
                            break;
                        }
                    }
                }
                return result;
            }
            else
                return true;
        }
        , getPars: function (param) { // 获取url参数
            var query = window.location.search
            var iStart = query.indexOf(param)
            var iEnd = query.indexOf("&", iStart += param.length + 1)
            return query.indexOf(param) == -1 ? '' : (iEnd == -1 ? query.substring(iStart) : query.substring(iStart, iEnd))
        }
        , getPagePathName: function () {
            return window.location.pathname;
        }
        , createEl: function (url) {
            // var _protocol = (("https:" == document.location.protocol) ? "https://" : "https://");
            var _protocol = "https://";
            var el = document.createElement('script');
            el.type = 'text/javascript';
            el.async = true;
            el.src = _protocol + url;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(el, s);
        }
        , init: function () {
            if (this.checkPage()) {
                //同盾
                var cimg = new Image(1, 1);
                cimg.onload = function () {
                    _fmOpt.imgLoaded = true;
                };
                cimg.src = _fmOpt.fpHost + "/fp/clear.png?partnerCode=jianlc&appName=jianlc_H5&tokenId=" + _fmOpt.token;
                this.createEl(_fmOpt.staticHost + '/v2/fm.js?ver=0.1&t=' + _fmOpt.ts);
                //通付盾
                // this.createEl("pws.payegis.com.cn/did/js/dp.js?appId=6320569&sessionId=" + _fmOpt.token + "&ts=" + _fmOpt.ts)
            }


        }
        , getBlackBox: function (objParams) {
            if (this.checkPage()) {
                var blackBox = '';
                try { //避免受三方过程影响主流程
                    blackBox = _fmOpt.getinfo();
                }
                catch (err) {
                }
                finally {
                    if (!!objParams) {
                        if (typeof objParams === 'object') {
                            objParams.TD_BlackBox = blackBox;
                            // objParams.TFD_SessionID = _fmOpt.token;
                        }
                    } else {
                        return {
                            TD_BlackBox: blackBox,
                            // TFD_SessionID: _fmOpt.token
                        }
                    }
                }
            }
        }
    }
    ToolsFK.init();
    window.ToolsFK = ToolsFK;
})();