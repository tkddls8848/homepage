$(function(){

    $('.dpt_name li').on('click', function(){
        var idx = $(this).index();
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.contact_wrapper>.map>.root_daum_roughmap:nth-child('+(idx+1)+')').css({'zIndex' : '999'}).siblings().css({'zIndex': '1'})
    });

    $('.dpt li').on('click', function(){
        var idx = $(this).index();
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.contact_wrapper>.map>.root_daum_roughmap:nth-child('+(idx+1)+')').css({'zIndex' : 999}).siblings().css({'zIndex': 1})
    });
});