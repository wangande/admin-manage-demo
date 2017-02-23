/**
 * Created by wangande on 16-1-13.
 */

~function (w, $) {
    var user = {
        getUserList: function (pageNum) {
            if (parseInt(pageNum)) {
                var selectKey = $(".select-key").val();
                var hrefUrl = '/admin/sdk/user/list?page=' + pageNum;
                if (selectKey) {
                    hrefUrl = hrefUrl + "&select_key=" + selectKey;
                }
                location.href = hrefUrl;
            }
        },
        userParsePages: function (nowPage, totalPage) {
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
                    user.getUserList(pageNum);
                })
            }

            $("#home-page").attr('page_num', 1);
            $("#pre-page").attr('page_num', prePageNum);
            $("#next-page").attr('page_num', nextPageNum);
            $("#last-page").attr('page_num', totalPage);
        },
        pageAction: function () {
            var pageNum = $(this).attr("page_num");
            user.getUserList(pageNum);
        },
        headReturn: function () {
            var pageNum = $(".select-key").attr("data-page");
            user.getUserList(pageNum);
        },
        userAppLogo: function () {
            var sdkAppId = $(this).attr("data-sdk-app-id");
            $(this).addClass("div-border-red");
            $(".sdk-user-app-logo").removeClass("div-border-red");

            $(".sdk-user-app-all-info").hide();
            var sdkAppIdStr = "#" + sdkAppId;
            $(sdkAppIdStr).show();
        },
        init: function () {
            $(".admin-nav-head-btn").on("click", user.userAppLogo);
            // $(".admin-nav-head-btn").on("click", user.headReturn);
            $(".page-action").on("click", user.pageAction);
            w.userParsePages = user.userParsePages;
        }
    };
    user.init();
} (window, jQuery);