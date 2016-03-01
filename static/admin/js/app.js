/**
 * Created by wangande on 16-1-13.
 */

function getAppList(page_num)
{
	if (parseInt(page_num)) {
		var select_key = $(".select-key").val();
        var app_status = $(".select-key").attr("data-status");
    	var href_url = '/admin/sdk/app/verify?page=' + page_num;
    	if (select_key)
        	href_url = href_url + "&select_key=" + select_key;
        href_url = href_url + "&app_status=" + app_status;
    	location.href = href_url;
	}

}

function appParsePages(now_page, total_page) {
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
            getAppList(page_num);
        })
    }

    $("#home-page").attr('page_num', 1);
    $("#pre-page").attr('page_num', pre_page_num);
    $("#next-page").attr('page_num', next_page_num);
    $("#last-page").attr('page_num', total_page);
}

$(".page-action").on("click", function(){
	var page_num = $(this).attr("page_num");
	getAppList(page_num);
})

$(".admin-nav-head-btn").on("click", function(){
	var page = $(".select-key").attr("data-page");
    getAppList(page);
})

$(".editor-sdk-btn").on("click", function(){
    $(".display-info").hide();
    $(".editor-info").show();
})

$(".editor-sdk-cancel").on("click", function(){
    $(".display-info").show();
    $(".editor-info").hide();
})

$('#logo').change(function() {
    if (!$("#logo").val())
        return;

    var formdata = new FormData();
    var fileObj = document.getElementById("logo").files;
    formdata.append("file", fileObj[0]);
    formdata.append("not_need_narrow", 1);

    $.ajax({
        url: "/sdk/com/upload",
        contentType: false,
        processData: false,
        data: formdata,
        type: "POST",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.status == "success") {
                console.log(data);
                $("#view-logo").attr("src", data.image_src);
                $("#view-logo").show();
                $("#logo-md5").val(data.md5);
            } else {
                var msg = "图片上传错误";
                if (data.msg == "File type is error")
                    msg = "文件类型错误";
                else if (data.msg == "Can upload image smaller than 480*480")
                    msg = "不能小于最小尺寸480*480";

                $("#logo-upload-error").show();
                $("#logo-upload-error").text(msg);
            }
        },
        error: function (data) {
            $("#logo-upload-error").show();
            $("#logo-upload-error").text("图片上传错误");
        },
    });
});

$(".editor-sdk-submit").on("click", function(){

    var data = {};
    var sdk_app_id = $("#sdk_app_id").val();
    data["sdk_app_id"] = $("#sdk_app_id").val();
    data["app_logo"] = $("#logo-md5").val();
    data["app_name"] = $("#app_name").val();
    data["app_url"] = $("#app_url").val();
    data["app_summary"] = $("#app_summary").val();

    var plat_ios = $("#plat-ios")[0].checked;
    var plat_android = $("#plat-android")[0].checked;

    if (!plat_android || !plat_ios){
        alert("必须选一个");
        return;
    }

    var platform = {}
    if (plat_ios) {
        platform['ios'] = {
            "apple_id": $("#apple_id").val(),
            "bundle_id": $("#bundle_id").val(),
            "app_down": $("#ios_down").val()
        }
    }
    if (plat_android)
    {
        platform['android'] = {
            "pack_name": $("#pack_name").val(),
            "key_store": $("#key_store").val(),
            "app_down": $("#android_down").val()
        }
    }

    data['platform'] = JSON.stringify(platform);
    console.log(data);
    //return;
    $.ajax({
        url : "/sdk/app/info",
        traditional : true,
        data : data,
        type : "POST",
        dataType : "json",
        success : function (response) {
            if (response.status == "success") {
                var url = '/sdk/app/info?sdk_app_id=' + sdk_app_id;
                location.href = url;
            } else {
               console.log(response.msg);
            }
        },
        error : function() {
            alert("服务器错误，请稍后重试");
        }
    });
});


$("button.verify-cancel-btn").on('click',function () {
     var modal = $('div.app-verify-modal');
     modal.modal('hide');
 })


function appVerify(data, redirect_url){

    $.ajax({
        url : '/admin/sdk/app/info',
        data : data,
        type : "POST",
        dataType : "json",
        success : function (response) {
            if (response.status == "success") {
               location.href = redirect_url;
            }else {
                alert(response.msg);
                $(".app-verify-modal").hide();
            }
        },
        error: function(){
            alert('服务器错误，请稍后重试');
        }
    });
}

$(".verify-set-div-agree").on("click", function(){
    var modal = $('div#agreeModal');

    modal.find("button#verify-agree-submit").unbind('click').click(function () {
        var data = {};
        data["sdk_app_id"] = $("#sdk_app_id").val();
        data['app_status'] = 1;
        var redirect_url = "/admin/sdk/app/verify?app_status=1"
        appVerify(data, redirect_url);
    });
    modal.modal('show');
});


$(".verify-set-div-refuse").on("click", function(){
    var modal = $('div#refuseModal');

    modal.find("button#verify-refuse-submit").unbind('click').click(function () {
        var data = {};
        data["sdk_app_id"] = $("#sdk_app_id").val();
        data['app_status'] = 3;

        var reason_op = $(".app-reason-list").val();

        var verify_reason = "";
        if (reason_op == "0")
            verify_reason = $("#verify-reason").val().trim();
        else
            verify_reason = reason_op;

        if (!verify_reason) {
            alert("原因不能为空");
            return;
        }
        data['verify_reason'] = verify_reason;

        var redirect_url = "/admin/sdk/app/verify?app_status=3";
        appVerify(data, redirect_url);
    });
    modal.modal('show');
});

$(".verify-set-div-cancel").on("click", function(){
    var modal = $('div#cancelModal');

    modal.find("button#verify-cancel-submit").unbind('click').click(function () {
        var data = {};
        data["sdk_app_id"] = $("#sdk_app_id").val();
        data['app_status'] = 4;


        var reason_op = $(".app-reason-list-c").val();

        var verify_reason = "";
        if (reason_op == "0")
            verify_reason = $("#verify-cancel-reason").val().trim();
        else
            verify_reason = reason_op;

        if (!verify_reason) {
            alert("原因不能为空");
            return;
        }
        data['verify_reason'] = verify_reason;

        var redirect_url = "/admin/sdk/app/verify?app_status=3";
        appVerify(data, redirect_url);
    });
    modal.modal('show');
});


$(".connect-ar-mod").on("click", function(){
    var modal = $('div#arModal');

    modal.find("button#ar-submit-btn").unbind('click').click(function () {
        var data = {};
        var sdk_app_id = $("#sdk_app_id").val();
        data["sdk_app_id"] = sdk_app_id;
        var connect_ar_mail = $("#connect_ar_mail").val();
        data["connect_ar_mail"] = connect_ar_mail;
        data["connect_ar_password"] = $("#connect_ar_password").val();
        $.ajax({
            url : '/sdk/app/info',
            data : data,
            type : "PUT",
            dataType : "json",
            success : function (response) {
                if (response.status == "success") {
                    $("#connect_ar").text(connect_ar_mail);
                    modal.modal('hide');
                }else {
                    console.log(response.status);
                    $("#error-msg").text(response.msg);
                }
            },
        });
    });
    modal.modal('show');
});

function appDelete(sdk_app_id){
    $.ajax({
            url : '/sdk/app/info?sdk_app_id=' + sdk_app_id,
            data : {},
            type : "DELETE",
            dataType : "json",
            success : function (response) {
                if (response.status == "success") {
                    location.href = "/sdk/app/manage";
                }else {
                    alert("删除错误");
                }
            },
            error: function(){
                alert("服务器错误");
            }
        });
}

