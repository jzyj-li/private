/**
 * public js
 */
(function (window, $, layer, fn) {
    fn.call(this, window, $, layer);
})(window, Zepto, layer, function (window, $, layer) {

    var BASE_PATH = 'http://lykj.niceleyi.com',
        CACHE_DATA_NAME = 'LYKE_PARAM',
        sess = window.sessionStorage;

    /**
     * [Unit description] 工具类
     * @constructor
     */
    function Util() {
        this.cacheDataName = CACHE_DATA_NAME; // 缓存数据的名称
        this.getOperatSystem();
    };
    Util.prototype = {
        ajax: function (type, url, param, callback) {
            var self = this;
            layer.open({type: 2});
            $.ajax({
                url: BASE_PATH + url,
                type: type,
                data: param,
                success: function (res) {
                    layer.closeAll()
                    res = JSON.parse(res)
                    if (res.errorCode == 0) {
                        callback && callback(res)
                    } else {
                        self.msg('系统出错')
                    }
                },
                error: function () {
                    layer.closeAll()
                    self.msg('检查网络')
                }
            })
        },
        get: function (url, param, callback) {
            this.ajax('GET', url, param, callback)
        },
        post: function (url, param, callback) {
            this.ajax('POST', url, param, callback)
        },

        getOperatSystem: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
                //这个是安卓操作系统
                this.operatingSystem = 2;
            }
            if (isIOS) {
                //这个是ios操作系统
                this.operatingSystem = 1;
            }
        },

        // 获取url参数
        getUrlParam: function (paramName) {
            paramValue = "", isFound = !1;
            if (location.search.indexOf("?") == 0 && location.search.indexOf("=") > 1) {
                arrSource = unescape(location.search).substring(1, location.search.length).split("&"), i = 0;
                while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
            }
            return paramValue == "" && (paramValue = null), paramValue
        },

        // 提示框
        msg: function (str) {
            layer.open({
                content: str,
                time: 2,
                skin: 'msg'
            })
        },

        // 跳转页面
        herfToPage: function (name, param) {
            location.href = name.indexOf('html')>0?name:(name + '.html')
        },

        // 设置缓存数据
        setCacheData: function (data) {
            var old_data = this.getCacheData(this.cacheDataName);
            data = old_data ? $.extend(old_data, data) : data;

            sess.setItem(this.cacheDataName, JSON.stringify(data));

        },
        getCacheData: function () {
            return JSON.parse(sess.getItem(this.cacheDataName))
        },

        // 验证身份证号
        cardId: function (sId) {
            var aCity = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外"
            };

            var iSum = 0;
            var info = "";
            if (!(/^\d{17}(\d|x)$/i.test(sId) || /^\d{15}$/i.test(sId))) {
                return "你输入的身份证长度或格式错误";
            }
            sId = sId.replace(/x$/i, "a");
            if (aCity[parseInt(sId.substr(0, 2))] == null) return "你的身份证地区非法";
            if (sId.length == 18) {
                sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
            } else if (sId.length == 15) {
                sBirthday = "19" + sId.substr(6, 2) + "-" + Number(sId.substr(8, 2)) + "-" + Number(sId.substr(10, 2));
            }
            var d = new Date(sBirthday.replace(/-/g, "/"));
            if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
            if (sId.length == 18) {
                for (var i = 17; i >= 0; i--) {
                    iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
                }
                if (iSum % 11 != 1) return "你输入的身份证号非法";
            }
            return true;//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女")

        }
    }

    window.Util = new Util();
})
