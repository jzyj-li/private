/*
 * @des 个人信息
 * @date 6/16
 * */
(function ($, layer, Util, LArea, fn) {
    fn.call(this, $, layer, Util, LArea)
})(Zepto, layer, Util, LArea, function ($, layer, util, LArea) {

    var $name = $('#name'),
        $cardId = $('#cardId'),
        $area = $('#area'),
        $cityCode = $('#cityCode'),
        $submit = $('.submit'),
        $checkbox = $('.checkbox');

    var InfoAuth = {
        param: {
            name: '',
            cardId: '',
            province: '',
            city: ''
        },
        init: function () {
            this.getCity()
            this.initEvent()
        },
        initEvent: function () {
            var self = this;
            $submit.on('tap', function () {
                self.beforeSubmit() && self.submit()
            })
            $checkbox.on('tap', function () {
                $(this).hasClass('active')?$(this).removeClass('active'):$(this).addClass('active');

            })
        },
        beforeSubmit: function () {
            var param = this.param
            if (!(param.name = $name.val())) {
                util.msg('输入姓名');
                return
            }
            if (!$cardId.val()) {
                util.msg('请输入身份证')
                return
            }
            if (util.cardId(param.cardId = $cardId.val()) != true) {
                util.msg('身份证不合法')
                return;
            }
            //console.log(util.cardId(param.cardId = $cardId.val()))
            return true;
        },

        submit: function () {
            var param = $.extend({}, util.getCacheData(), this.param)
            util.get('/customer/saveCustomerTwo', param, function (res) {
                util.herfToPage(res.data.length?res.data:'applyForm')
            })
        },
        getCity: function () {
            util.get('/customer/cityList', {}, function (res) {
                InfoAuth.initCity(res.data)
            })
        },
        initCity: function (data) {
            var area = new LArea();
            area.init({
                'trigger': '#city',
                'keys': {
                    id: 'id',
                    name: 'name'
                },
                'type': 1,
                'data': data,
                btn: function (pro, city, provinceCode, cityCode) {
                    $area.html(pro + ' ' + city)
                    InfoAuth.param.province = provinceCode;
                    InfoAuth.param.city = cityCode
                }
            })
        }
    }

    InfoAuth.init()

})
