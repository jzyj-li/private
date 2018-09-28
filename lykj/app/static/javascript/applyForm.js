/*
 * @des 个人信息
 * @date 6/16
 * */
(function ($, layer, Util, LArea, fn) {
    fn.call(this, $, layer, Util, LArea)
})(Zepto, layer, Util, LArea, function ($, layer, util, LArea) {
    var $radio = $('.radio'),
        $submit = $('.submit');

    var ApplyForm = {
        param: {
            income: '2', // 月收入（1:5000以下 2:5000以上）
            salaryPayMethod: '2', // 薪资发放形式 （1：现金 2：银行代发）
            socialSecurity: '2', // 社保 （1：未缴纳 2：已缴纳）
            providentFund: '2', // 公积金（1：未缴纳 2：已缴纳）
            houseProperty: '2', // 房产（1：有房 2：无房）
            carProperty: '2', // 车产 （1；有车 2：无车）
            insuranceProperty: '3' // 人寿保险 （1；已投保 2：投保两年 3；未投保）
        },
        init: function () {
           this.initEvent()
        },
        initEvent: function () {

            var param = this.param;
            $radio.on('tap', 'span', function () {
                $(this).addClass('active').siblings().removeClass('active');
                param[$(this).parent().attr('data-type')] = $(this).attr('data-type')
            })

            $submit.on('tap', function () {
                ApplyForm.submit()
            })
        },
        submit: function () {
            var param = $.extend({}, util.getCacheData(), this.param);
            util.get('/customer/saveCustomerThree', param, function (res) {
                
            })
        },
        success:function (res) {
            var data = res.data[0].productResultType;
            if (data == 1) {
                util.hrefToPage(res.data[0].list[0].forwardUrl);
            } else if (data == 2)  { // 贷款列表
                util.hrefToPage('fundRecommend')

            } else if (data == 3) { // 信用卡列表
                util.hrefToPage('applyCredit')
            }
        }
        
    }

    ApplyForm.init()

})
