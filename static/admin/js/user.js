/**
 * Created by wangande on 16-1-13.
 */

function getUserList(page_num)
{
	if (parseInt(page_num)) {
		var select_key = $(".select-key").val();
    	var href_url = '/admin/sdk/user/list?page=' + page_num;
    	if (select_key)
        	href_url = href_url + "&select_key=" + select_key;
    	location.href = href_url;
	}

}

function userParsePages(now_page, total_page) {
    if (total_page == 0) {
        $(".pages").hide();
        return;
    }
    $(".pages").show();

    var pageHtml = '<div class="page-action {{active}}"' +
                   'page_num="{{page_num_id}}">'+
                   '{{page_num}}</div>';

    var pre_page_num = now_page - 1;

    var next_page_num = now_page + 1;

    if (next_page_num > total_page)
        next_page_num = 0;

    var start_page_num = 1;
    var end_page_num = 5;

    if (now_page > 3) {
        start_page_num = now_page -2;
        end_page_num = now_page + 2;
    }

    if (end_page_num > total_page)
        end_page_num = total_page;

    var $div = $(".page").html("");

    for (var i=start_page_num; i <= end_page_num; i++) {
        var active = "";
        if (i==now_page)
            active = 'page-active';
        var tmp_html = pageHtml.replace(/\{\{active\}\}/gm, active)
                                  .replace(/\{\{page_num_id\}\}/gm, i)
                                  .replace(/\{\{page_num\}\}/gm, i);

        var $tmpl = $(tmp_html).appendTo($div);

        $tmpl.click(function(){
            var page_num = $(this).attr('page_num');
            getUserList(page_num);
        })
    }

    $("#home-page").attr('page_num', 1);
    $("#pre-page").attr('page_num', pre_page_num);
    $("#next-page").attr('page_num', next_page_num);
    $("#last-page").attr('page_num', total_page);
}

$(".page-action").on("click", function(){
	var page_num = $(this).attr("page_num");
	getUserList(page_num);
})

$(".admin-nav-head-btn").on("click", function(){
	var page = $(".select-key").attr("data-page");
    getUserList(page);
})



$(".sdk-user-app-logo").on("click", function(){
    var sdk_app_id = $(this).attr("data-sdk-app-id");
    $(".sdk-user-app-logo").removeClass("div-border-red");
    $(this).addClass("div-border-red");

    $(".sdk-user-app-all-info").hide();
    var sdk_app_id_str = "#" + sdk_app_id;
    $(sdk_app_id_str).show();
})