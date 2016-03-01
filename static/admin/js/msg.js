/**
 * Created by wangande on 16-1-13.
 */

function getMsgList(page_num)
{
	if (parseInt(page_num)) {
		var select_key = $(".select-key").val();
    	var href_url = '/admin/sdk/msg?page=' + page_num;
    	if (select_key)
        	href_url = href_url + "&select_key=" + select_key;
    	location.href = href_url;
	}
}

function msgParsePages(now_page, total_page) {
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
            getMsgList(page_num);
        })
    }

    $("#home-page").attr('page_num', 1);
    $("#pre-page").attr('page_num', pre_page_num);
    $("#next-page").attr('page_num', next_page_num);
    $("#last-page").attr('page_num', total_page);
}

$(".page-action").on("click", function(){
	var page_num = $(this).attr("page_num");
	getMsgList(page_num);
})

$(".admin-nav-head-btn").on("click", function(){
	var page = $(".select-key").attr("data-page");
    getMsgList(page);
})


$(".new-sdk-msg").on("click", function(){
    var modal = $('div#msgModal');
    $("#content").val("");
    $("#src_url").val("");
    $("#src_url").hide();
    $("#is_skip").removeAttr("checked");

    modal.find("#msg-submit-btn").unbind('click').click(function () {
        var data = {};
        var content = $("#content").val();
        data["content"] = content;

        var src_url = $("#src_url").val();
        data["src_url"] = src_url;

        var is_skip = $("#is_skip")[0].checked ?1:0;
        data['is_skip'] = is_skip

        if (!content){
            alert('消息内容为空!');
            return;
        }
        if (is_skip && !src_url){
            alert('选择跳转后，跳转地址不为空！');
            return;
        }

        modal.modal('hide');
        msgSendConfirm(data);
        //$.ajax({
        //    url : '/admin/sdk/msg',
        //    data : data,
        //    type : "POST",
        //    dataType : "json",
        //    success : function (response) {
        //        if (response.status == "success") {
        //            alert(response.msg);
        //            modal.modal('hide');
        //            location.href = '/admin/sdk/msg';
        //        }else {
        //            console.log(response.status);
        //            $("#error-msg").text(response.msg);
        //        }
        //    },
        //});
    });
    modal.modal('show');
});

$("#is_skip").on("change", function(){
    var is_skip = $("#is_skip")[0].checked;
    if (is_skip) {
        $("#src_url").show();
    }else {
        $("#src_url").hide();
    }
})


function msgSendConfirm(data){
    var modal = $('div#msgSendModal');
    $("#msg-send-content").text(data.content);

    modal.find("#msg-send-submit-btn").unbind('click').click(function () {
        //console.log("xxxxxxxxxxx");
        //return;
        $.ajax({
            url : '/admin/sdk/msg',
            data : data,
            type : "POST",
            dataType : "json",
            success : function (response) {
                if (response.status == "success") {
                    alert(response.msg);
                    modal.modal('hide');
                    location.href = '/admin/sdk/msg';
                }else {
                    console.log(response.status);
                    $("#error-msg").text(response.msg);
                }
            },
        });
    });
    modal.modal('show');
}