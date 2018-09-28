/*
* @des 登录模块
* @author wb
* @date 7/30
* */
(function (mui, utils, fn) {
    fn.call(this, mui, utils)
})( mui, Utils, function (mui, utils) {
    var m_mobile = mui('#mobile')[0],
        m_verifyCode = mui('#verifyCode')[0],
        m_submit = mui('#submit')[0],
        m_form = mui('.form')[0];

    var Login = {
        init:function () {
            this.initEvent()
        },
        initEvent: function () {
            var self = this;
            m_submit.addEventListener('click', function () {
                self.beforeSubmit()
            })
        },
        loginSubmit:function (param) {
        	console.log(param)
            utils.autoLogin(param); 
        },
        beforeSubmit: function () {
            var option = {
                mobile: {
                    type: 'mobile',
                    isNull: '请输入手机号',
         			isReg: '请输入正确的手机号'
                },
                verifyCode: '请输入验证码',
            }, str;
            str = utils.validate(m_form, option);
          
            typeof str === 'string'?mui.toast(str):this.loginSubmit(str);
        }
    }

    Login.init()
})