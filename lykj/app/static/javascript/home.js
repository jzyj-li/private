/*
 * @des 主页面
 * @date 6/16
 * @author wb
 * */

(function ($, layer, Util,fn) {
    fn.call(this, $, layer, Util)
})(Zepto, layer, Util, function ($, layer, util) {

    var $form = $('.form'),
        $select = $form.find('select'),
        $amount = $('#amount'),
        $code = $('#code'),
        $submit = $('#submit'),
        $tel = $('#tel'),
        $verCode = $('#verCode'),
        $radio = $('.radio'),
        param = {
            channel: util.getUrlParam('channel') || 1,
            loanAmountType: 0,
            phone: '',
            verifyCode: '',
            creditCard: '1',
            operatingSystem: util.operatingSystem
        },
        $checkbox = $('.checkbox');

    var Home = {
        init: function () {
            $code.attr('key', 'true');
            this.initEvent();
            console.log(param)
        },
        initEvent: function () {
            $select.change(function () {
                $(this).prev().html($(this).find('option').not(function () {
                    return !this.selected
                }).text());
                param.loanAmountType = $(this).val()
            })

            // 获取验证码
            $code.tap(function () {
                $code.attr('key') && Home.getCode();
            })

            // 提交表单
            $submit.tap(function () {
               Home.validate() &&  Home.submit()
            })

            // 信用卡
            $radio.on('tap', 'span', function () {
                $(this).addClass('active').siblings().removeClass('active');
                param.creditCard = $(this).attr('data-type')
            })
            
            $checkbox.on('tap', function () {
                $(this).hasClass('active')?$(this).removeClass('active'):$(this).addClass('active');

            })
        },
        submit: function () {
            util.get('/customer/saveCustomerOne', param, function (res) {

                delete param.verifyCode
                util.msg(res.message);
                util.setCacheData(param);

                util.herfToPage(res.data?res.data:'informAuth')
                //util.herfToPage('informAuth')
            })
        },

        // 验证表单
        validate: function () {
            if (!(param.phone = $tel.val())) {
                this.error('请输入手机号')
                return;
            }
            if (!/^\d{11}$/.test($tel.val())) {
                this.error('手机号输入有误，请重新输入')
                return;
            }
            if (!(param.verifyCode = $verCode.val())) {
                this.error('请输入手机号验证码')
                return;
            }
            return true;
        },

        // 倒计时
        countDown: function () {
            var time = 61;

            $code.attr('key', 'false');
            var count = setInterval(function () {
                time--;
                $code.html(time + 's');

                if (time <= 0) {
                    clearInterval(count);
                    $code.attr('key', 'true')
                }
            }, 1000)
        },

        // 获取验证码
        getCode: function () {
            if (!$tel.val()) {
                this.error('请输入手机号');
                return
            }
            if (!/^\d{11}$/.test($tel.val())) {
                this.error('请输入正确手机号');
                return
            }
            util.post('/customer/sign/getVerifyCode', {phone: $tel.val()}, function (res) {
                Home.error(res.message);
                Home.countDown()
            })
        },
        error: function (mes) {
            util.msg(mes)
        }
    }

    Home.init()


})
