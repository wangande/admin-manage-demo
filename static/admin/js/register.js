/**
 * Created by wangande on 16-1-13.
 */

~function (w, $) {
    var registerSuccessLink = "../../../admin-manage-demo/admin/user/login.html";
    var adminRegister = {
        register: function () {
            var mail = $("#mail").val().trim();
            var password = $("#password").val().trim();
            var password2 = $("#password2").val().trim();

            if (!mail || !password || !password2) {
                $("div.admin-register-error-msg").text("账户或密码为空！");
                $("div.admin-register-error-msg").show();
                return;
            }

            if (password.length < 6) {
                $("div.admin-register-error-msg").text("密码不能小于6位！");
                $("div.admin-register-error-msg").show();
                return;
            }

            if (password != password2) {
                $("div.admin-register-error-msg").text("2次密码不相同！");
                $("div.admin-register-error-msg").show();
                return;
            }
            location.href = registerSuccessLink;
            return;
            $.ajax({
                url : "",
                traditional : true,
                data : {
                    "mail": mail,
                    "password" : password,
                    "password2" : password2,
                },
                type : "POST",
                dataType : "json",
                success : function (response) {
                    if (response.status == "success") {
                        alert("帐号注册成功!");
                        location.href = "";
                    } else{
                        $("div.admin-register-error-msg").text(response.msg);
                        $("div.admin-register-error-msg").show();
                    }
                },
                error : function() {
                    alert("服务器错误，请稍后重试");
                }
            });
        },
        keyDownRegister: function () {
            if(window.event) {
                event_e = window.event;
            }
            var intKeyCode = event_e.charCode||event_e.keyCode;
            if( intKeyCode == '13' ) {
                adminRegister.register();
                return;
            }
        },
        init: function () {
             document.onkeydown = adminRegister.keyDownRegister;
             $(".admin-register-submit").on("click", adminRegister.register);
        }
    };
    adminRegister.init();
} (window, jQuery);
