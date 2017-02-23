/**
 * Created by wangande on 16-1-13.
 */


~function (w, $) {
    var app = {
        logUpload: function () {
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
        },
        appParsePages: function (nowPage, totalPage) {
            if (totalPage == 0) {
                $(".pages").hide();
                return;
            }
            $(".pages").show();

            var pageHtml = '<div class="page-action {{active}}"' +
                           'pageNum="{{page_num_id}}">'+
                           '{{pageNum}}</div>';

            var prePageNum = nowPage - 1;

            var nextPageNum = nowPage + 1;

            if (nextPageNum > totalPage)
                nextPageNum = 0;

            var startPageNum = 1;
            var endPageNum = 5;

            if (nowPage > 3) {
                startPageNum = nowPage -2;
                endPageNum = nowPage + 2;
            }

            if (endPageNum > totalPage)
                endPageNum = totalPage;

            var $div = $(".page").html("");

            for (var i=startPageNum; i <= endPageNum; i++) {
                var active = "";
                if (i==nowPage)
                    active = 'page-active';
                var tmpHtml = pageHtml.replace(/\{\{active\}\}/gm, active)
                                          .replace(/\{\{page_num_id\}\}/gm, i)
                                          .replace(/\{\{page_num\}\}/gm, i);

                var $tmpl = $(tmpHtml).appendTo($div);

                $tmpl.click(function(){
                    var pageNum = $(this).attr('page_num');
                    app.getAppList(pageNum);
                })
            }

            $("#home-page").attr('page_num', 1);
            $("#pre-page").attr('page_num', prePageNum);
            $("#next-page").attr('page_num', nextPageNum);
            $("#last-page").attr('page_num', totalPage);
        },
        getAppList: function (pageNum) {
            if (parseInt(pageNum)) {
                var selectKey = $(".select-key").val();
                var appStatus = $(".select-key").attr("data-status");
                var hrefUrl = '/admin/sdk/app/verify?page=' + pageNum;
                if (selectKey)
                    hrefUrl = hrefUrl + "&select_key=" + selectKey;
                hrefUrl = hrefUrl + "&app_status=" + appStatus;
                location.href = hrefUrl;
            }
        },
        pageAction: function () {
            var pageNum = $(this).attr("page_num");
	        app.getAppList(pageNum);
        },
        headReturn: function () {
            var pageNUm = $(".select-key").attr("data-page");
            app.getAppList(pageNUm);
        },
        editorSdkBtn: function () {
            $(".display-info").hide();
            $(".editor-info").show();
        },
        editorSdkCancle: function () {
            $(".display-info").show();
            $(".editor-info").hide();
        },
        editorSdkSubmit: function () {
            var data = {};
            var sdkAppId = $("#sdk_app_id").val();
            data["sdk_app_id"] = $("#sdk_app_id").val();
            data["app_logo"] = $("#logo-md5").val();
            data["app_name"] = $("#app_name").val();
            data["app_url"] = $("#app_url").val();
            data["app_summary"] = $("#app_summary").val();

            var platIos = $("#plat-ios")[0].checked;
            var platAndroid = $("#plat-android")[0].checked;

            if (!platAndroid || !platIos){
                alert("必须选一个");
                return;
            }

            var platform = {}
            if (platIos) {
                platform['ios'] = {
                    "apple_id": $("#apple_id").val(),
                    "bundle_id": $("#bundle_id").val(),
                    "app_down": $("#ios_down").val()
                }
            }
            if (platAndroid)
            {
                platform['android'] = {
                    "pack_name": $("#pack_name").val(),
                    "key_store": $("#key_store").val(),
                    "app_down": $("#android_down").val()
                }
            }

            data['platform'] = JSON.stringify(platform);
            return;
            $.ajax({
                url : "/sdk/app/info",
                traditional : true,
                data : data,
                type : "POST",
                dataType : "json",
                success : function (response) {
                    if (response.status == "success") {
                        var url = '/sdk/app/info?sdk_app_id=' + sdkAppId;
                        location.href = url;
                    } else {
                       console.log(response.msg);
                    }
                },
                error : function() {
                    alert("服务器错误，请稍后重试");
                }
            });
        },
        appVerify: function(data, redirectUrl){
            $.ajax({
                url : '/admin/sdk/app/info',
                data : data,
                type : "POST",
                dataType : "json",
                success : function (response) {
                    if (response.status == "success") {
                       location.href = redirectUrl;
                    }else {
                        alert(response.msg);
                        $(".app-verify-modal").hide();
                    }
                },
                error: function(){
                    alert('服务器错误，请稍后重试');
                }
            });
        },
        verifyAgree: function () {
            var modal = $('div#agreeModal');
            modal.find("button#verify-agree-submit").unbind('click').click(function () {
                var data = {};
                data["sdk_app_id"] = $("#sdk_app_id").val();
                data['app_status'] = 1;
                var redirectUrl = "/admin/sdk/app/verify?app_status=1"
                app.appVerify(data, redirectUrl);
            });
            modal.modal('show');
        },
        verifyRefuse: function () {
            var modal = $('div#refuseModal');
            modal.find("button#verify-refuse-submit").unbind('click').click(function () {
                var data = {};
                data["sdk_app_id"] = $("#sdk_app_id").val();
                data['app_status'] = 3;

                var reasonOp = $(".app-reason-list").val();

                var verifyReason = "";
                if (reasonOp == "0")
                    verifyReason = $("#verify-reason").val().trim();
                else
                    verifyReason = reasonOp;

                if (!verifyReason) {
                    alert("原因不能为空");
                    return;
                }
                data['verify_reason'] = verifyReason;

                var redirectUrl = "/admin/sdk/app/verify?app_status=3";
                app.appVerify(data, redirectUrl);
            });
            modal.modal('show');
        },
        verifyCancelBtn: function () {
            var modal = $('div.app-verify-modal');
            modal.modal('hide');
        },
        verifyCancel: function(){
            var modal = $('div#cancelModal');
            modal.find("button#verify-cancel-submit").unbind('click').click(function () {
                var data = {};
                data["sdk_app_id"] = $("#sdk_app_id").val();
                data['app_status'] = 4;

                var reasonOp = $(".app-reason-list-c").val();

                var verifyReason = "";
                if (reasonOp == "0")
                    verifyReason = $("#verify-cancel-reason").val().trim();
                else
                    verifyReason = reasonOp;

                if (!verifyReason) {
                    alert("原因不能为空");
                    return;
                }
                data['verify_reason'] = verifyReason;
                var redirectUrl = "/admin/sdk/app/verify?app_status=3";
                app.appVerify(data, redirectUrl);
            });
            modal.modal('show');
        },
        connectArMod: function () {
            var modal = $('div#arModal');
            modal.find("button#ar-submit-btn").unbind('click').click(function () {
                var data = {};
                var sdkAppId = $("#sdk_app_id").val();
                data["sdk_app_id"] = sdkAppId;
                var connectArMail = $("#connect_ar_mail").val();
                data["connect_ar_mail"] = connectArMail;
                data["connect_ar_password"] = $("#connect_ar_password").val();
                $.ajax({
                    url : '/sdk/app/info',
                    data : data,
                    type : "PUT",
                    dataType : "json",
                    success : function (response) {
                        if (response.status == "success") {
                            $("#connect_ar").text(connectArMail);
                            modal.modal('hide');
                        }else {
                            console.log(response.status);
                            $("#error-msg").text(response.msg);
                        }
                    },
                });
            });
            modal.modal('show');
        },
        appDelete: function (sdkAppId) {
            $.ajax({
                url : '/sdk/app/info?sdk_app_id=' + sdkAppId,
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
        },
        init: function () {
            $(".page-action").on("click", app.pageAction);
            $(".admin-nav-head-btn").on("click", app.headReturn);
            $(".editor-sdk-btn").on("click", app.editorSdkBtn);
            $(".editor-sdk-cancel").on("click", app.editorSdkCancle);
            $('#logo').on("change", app.logUpload);

            $(".editor-sdk-submit").on("click", app.editorSdkSubmit);
            $("button.verify-cancel-btn").on('click', app.verifyCancelBtn);
            $(".verify-set-div-agree").on("click", app.verifyAgree);
            $(".verify-set-div-refuse").on("click", app.verifyRefuse);
            $(".verify-set-div-cancel").on("click", app.verifyCancel);
            $(".connect-ar-mod").on("click", app.connectArMod);

            w.appDelete = app.appDelete;
            w.appParsePages = app.appParsePages;
        }
    };

    app.init();
} (window, jQuery);
