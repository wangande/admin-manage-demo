/**
 * Created by wangande on 16-1-13.
 */

~function (w, $) {
    var msg = {
        getMsgList: function (pageNum) {
           if (parseInt(pageNum)) {
                var selectKey = $(".select-key").val();
                var hrefUrl = '/admin/sdk/msg?page=' + pageNum;
                if (selectKey)
                    hrefUrl = hrefUrl + "&select_key=" + selectKey;
                location.href = hrefUrl;
            } 
        },
        msgParsePages: function (nowPage, totalPage) {
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
                    msg.getMsgList(pageNum);
                })
            }
        
            $("#home-page").attr('page_num', 1);
            $("#pre-page").attr('page_num', prePageNum);
            $("#next-page").attr('page_num', nextPageNum);
            $("#last-page").attr('page_num', totalPage);
        },
        msgSendConfirm: function(){
            var modal = $('div#msgSendModal');
            $("#msg-send-content").text(data.content);
            modal.find("#msg-send-submit-btn").unbind('click').click(function () {
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
        },
        pageAction: function () {
            var pageNum = $(this).attr("page_num");
            msg.getMsgList(pageNum);
        },
        headReturn: function () {
            var pageNum = $(".select-key").attr("data-page");
            msg.getMsgList(pageNum);
        },
        newMsg: function () {
            var modal = $('div#msgModal');
            $("#content").val("");
            $("#src_url").val("");
            $("#src_url").hide();
            $("#is_skip").removeAttr("checked");

            modal.find("#msg-submit-btn").unbind('click').click(function () {
                var data = {};
                var content = $("#content").val();
                data["content"] = content;

                var srcUrl = $("#src_url").val();
                data["src_url"] = srcUrl;

                var isSkip = $("#is_skip")[0].checked ?1:0;
                data['is_skip'] = isSkip

                if (!content){
                    alert('消息内容为空!');
                    return;
                }
                if (isSkip && !srcUrl){
                    alert('选择跳转后，跳转地址不为空！');
                    return;
                }

                modal.modal('hide');
                msg.msgSendConfirm(data);
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
        },
        isSkip: function () {
            var isSkip = $("#is_skip")[0].checked;
            if (isSkip) {
                $("#src_url").show();
            }else {
                $("#src_url").hide();
            }
        },
        init: function () {
            $(".page-action").on("click", msg.pageAction);
            $(".admin-nav-head-btn").on("click", msg.headReturn);
            $(".new-sdk-msg").on("click", msg.newMsg);
            $("#is_skip").on("change", msg.isSkip);
            w.msgParsePages = msg.msgParsePages;
        }
    };
    msg.init();
} (window, jQuery);