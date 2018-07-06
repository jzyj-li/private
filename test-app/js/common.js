/*
*
* 公共方法
* */

(function (mui, $, fn) {
    fn.call(this, mui, $)
})(mui,Zepto, function (mui, $) {


    // tab
    $('.tab-nav .item').on('tap', function () {
        $('.tab-content').removeClass('active');
        $('.tab-content').eq($(this).index()).addClass('active');
        $('.tab-nav .item').removeClass('active');
        $(this).addClass('active');
    });


    /*
    *
    * @des 跳转详情页面
    * @param source 来源
    * @param status 状态
    * */
    function jumpPage(source, status) {
        location.href ='list_detail.html?source=' + source + '&status=' + status;
    }

    window.jumpPage = jumpPage;
   
});