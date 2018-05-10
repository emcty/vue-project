// 去空格
let trim = (value) => {
    return value.replace(/\s+/gm, '')
}
//cookie的读写 
let cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        let expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            let date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        let path = options.path ? '; path=' + options.path : '; path=/';
        let domain = options.domain ? '; domain=' + options.domain : '';
        let secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        let cookieValue = null;
        if (document.cookie && document.cookie != '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].replace(/\s/g, "");
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
//算术运算-加法
let Math_add = function (arg1, arg2) {
    let r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        let cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
};
//算术运算-减法
let Math_sub = function (arg1, arg2) {
    let r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
};
//算术运算-乘法
let Math_mul = function (arg1, arg2) {
    let m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
//算术运算-除法
let Math_div = function (arg1, arg2) {
    let t1 = 0,
        t2 = 0,
        r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
    }
    // with(Math) {
    //  r1 = Number(arg1.toString().replace(".", ""));
    //  r2 = Number(arg2.toString().replace(".", ""));
    //  return (r1 / r2) * pow(10, t2 - t1);
    // }

};
//页面跳转
let goUrl = function (aUrl) {
    window.location.href = aUrl;
};
//获取url中的某个参数
let getPara = function (param) {
    let query = window.location.search;
    if (query.length == 0) {
        return "";
    } else {
        let iLen = param.length;
        let iStart = query.indexOf(param);
        //判断是否有那个需要查询值的传递参数
        if (iStart == -1) {
            return ""; //没有就返回一个空值
        }
        iStart += iLen + 1;
        let iEnd = query.indexOf("&", iStart); //判断是不是带有多个参数   &为多个参数的连接符号
        if (iEnd == -1) {
            return query.substring(iStart);
        }
        return query.substring(iStart, iEnd);
    }
};
/*获取系统时间
 *参数类型
 *time:返回时间戳
 *默认返回：yyyy-mm-dd:年月日
 */
let getSysTime = function (type) {
    let date = new Date();
    let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    switch (type) {
        case "time":
            return date.getTime();
            break;
        default:
            return y + "-" + m + "-" + d;
    }
};
//本地存储-获取/增加/修改
//value值为字符串或者json对象
let storage = function (name, value) {
    let cstorage = window.localStorage;
    if (!arguments.length) {
        return cstorage; //没有参数时返回所有localStorage
    }
    if (typeof value === "undefined") {
        //取本地存储
        let curValue = cstorage.getItem(name);
        let transValue = isJson(curValue);
        return curValue = transValue ? transValue : curValue;
    } else {
        //添加、修改本地存储
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        cstorage.removeItem(name);
        cstorage.setItem(name, value);
    }
};
//删除本地存储
let delStorage = function (name) {
    let cstorage = window.localStorage;
    if (arguments[0] === -1) {
        cstorage.clear();
    } else {
        cstorage.removeItem(name)
    }
};
//判断字符串是否是json格式
let isJson = function (str) {
    try {
        if (window.JSON)
            JSON.parse(str);
    } catch (e) {
        return false;
    }
    return JSON.parse(str);
};
//AJAX请求时的加载动画
let loading = function (aHandle) {
    if (aHandle) {
        $("#loading" + aHandle).hide().remove();
        return aHandle;
    }
    let handle = getSysTime("time");
    let layer = '<div id=loading' + handle + ' class="ajax-spinner">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div></div>';
    $("body").append(layer);
    return handle;
};
//页面按钮位置
let btn_pos = function (options) {
    let defaults = { //按钮的初始默认形态
            pos_way: 'fixed',
            lr_way: 'left',
            tb_way: 'bottom',
            lr_value: 0,
            tb_value: 0,
            type: 1,
            btn_name: ''
        },
        opt = $.extend({}, defaults, options),
        _this = $(opt.btn_name),
        _type = opt.type,
        pos = opt.pos_way,
        lr = opt.lr_way,
        tb = opt.tb_way,
        str = navigator.userAgent.split('_')[0],
        type = str.substring(str.length - 1); //获取使用手机为iphone4

    _this.css('position', pos); //调用按钮的定位形式

    /*针对固定定位并且是iphone4做兼容position:fixed*/
    if (_type == 1 && type == 4) {
        $(window).scroll(function () {
            _this.css({
                position: 'absolute',
                top: window.innerHeight + window.scrollY - _this.height()
            });
        });
    }

    /*判断左右定位*/
    if (lr == 'left') {
        _this.css('left', opt.lr_value)
    } else {
        _this.css('right', opt.lr_value)
    }

    /*判断上下定位*/
    if (tb == 'top') {
        _this.css('top', opt.tb_value)
    } else {
        _this.css('bottom', opt.tb_value)
    }
};
/* rem布局设置函数 */
let remFn = function (num) {
    let htmlObj = document.getElementsByTagName("html")[0]
    // $("html").css("font-size", $(document).width() / num);
    htmlObj.style.fontSize = document.body.clientWidth / num + "px";
};
/*//数字千分位
//isFixed是否保留两位小数,0不需要小数(送的体验金)
//10000 ，---10,000.00   
$.formatThousand = function(num, isFixed) {
        if (isNaN(num)) {
            return '';
        }
        let val = num.toString();
        let valEnd = (/\./).test(val);
        if (isFixed == undefined) {
            if (valEnd) {
                val = val.split('.')[1].length < 2 ? val + "0" : val;
            } else {
                val = val + ".00";
            }
        }
        let reg = /(\d+)(\d{3})/;
        while (reg.test(val)) {
            val = val.replace(reg, '$1' + ',' + '$2');
        }
        return val;
    }*/
//num:金额   
//isFixed:小数的位数,默认为2位小数
let formatThousand = function (num, isFixed) {
    if (isFixed === undefined) {
        isFixed = 2;
    }
    if (isNaN(num)) {
        return '';
    }
    let val = num.toString(),
        valEnd = (/\./).test(val),
        str = '',
        reg = /(\d+)(\d{3})/;
    if (isFixed && isFixed != 0) {
        if (valEnd) {
            if (val.split('.')[1].length < isFixed) {
                for (let i = 0; i < isFixed - val.split('.')[1].length; i++) {
                    str += '0';
                }
                val = val + str;
            } else if (val.split('.')[1].length == isFixed) {
                val = val;
            }

        } else {
            for (let i = 0; i < isFixed; i++) {
                str += '0';
            }
            val = val + "." + str;
        }

        while (reg.test(val.split('.')[0])) {
            val = val.replace(reg, '$1' + ',' + '$2');
        }
    } else {
        if (valEnd) {
            while (reg.test(val.split('.')[0])) {
                val = val.split('.')[0].replace(reg, '$1' + ',' + '$2');
            }
        } else {
            while (reg.test(val)) {
                val = val.replace(reg, '$1' + ',' + '$2');
            }
        }

    }
    return val;
}

/*时间戳转换日期格式*/
/*接口返回的是毫秒*/
let format = function (times) {
    let now = new Date(times);
    let year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    return year + "-" + month + "-" + date;
}

// 跳转应用宝
let goAppMarket = function () {
    goUrl("http://a.app.qq.com/o/simple.jsp?pkgname=com.laijin.simplefinance");
}


let toGoOrigin = function () {
    document.body.ontouchend = () => {
        setTimeout(function () {
            cookie('scrollTop', window.scrollY || window.pageYOffset || document.body.scrollTop)
        }, 900)
    }

    let scrollWindow = function () {
        let scrollTop = 0
        let cookieTop = cookie('scrollTop');
        if (!!cookieTop) {
            scrollTop = cookieTop
        }
        setTimeout(function () {
            window.scrollBy(0, scrollTop)
        }, 500)

    }
    window.addEventListener('load', scrollWindow, false)
    // window.addEventListener('beforeunload', addOnBeforeUnload, false)
};

/**
 * [Reg 常用正则]
 * mobile 手机号
 */
const Reg = {
    mobile: /^1[3-9]\d{9}$/
};

export {
    trim,
    cookie,
    Math_add,
    Math_sub,
    Math_mul,
    Math_div,
    goUrl,
    getPara,
    getSysTime,
    storage,
    delStorage,
    isJson,
    remFn,
    formatThousand,
    format,
    goAppMarket,
    Reg,
    toGoOrigin
}