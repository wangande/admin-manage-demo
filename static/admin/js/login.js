/**
 * Created by wangande on 16-1-13.
 */

~function (w, $) {
    var loginSuccessLink = "../../../admin-manage-demo/admin/app/verify.html";
    var adminLogin = {
        login: function () {
            var mail = $("#mail").val().trim();
            var password = $("#password").val().trim();

            if (!mail || !password) {
                $("div.admin-login-error-msg").text("账户或密码为空！");
                $("div.admin-login-error-msg").show();
                return;
            }

            if (mail == "andrew@github.com" && password=="123456"){
                location.href = loginSuccessLink;
            }else {
                $("div.admin-login-error-msg").text("用户名或密码错误");
                $("div.admin-login-error-msg").show();
            }
            return;
            $.ajax({
                url : "",
                traditional : true,
                data : {
                    "mail": mail,
                    "password" : password,
                },
                type : "POST",
                dataType : "json",
                success : function (response) {
                    if (response.status == "success") {
                        location.href = response.url;
                    } else{
                        $("div.admin-login-error-msg").text(response.msg);
                        $("div.admin-login-error-msg").show();
                    }
                },
                error : function() {
                    alert("服务器错误，请稍后重试");
                }
            });
        },
        keyDownLogin: function () {
            if(window.event) {
                event_e = window.event;
            }
            var intKeyCode = event_e.charCode||event_e.keyCode;
            if( intKeyCode == '13' ) {
                adminLogin.login();
                return;
            }
        },
        init: function () {
            document.onkeydown = adminLogin.keyDownLogin;
            $(".admin-login-submit").on("click", adminLogin.login);
        }
    };

    adminLogin.init();
} (window, jQuery);