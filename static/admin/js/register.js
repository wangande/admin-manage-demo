/**
 * Created by wangande on 16-1-13.
 */

$(".user-register-submit").on("click", function(){
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

    $.ajax({
        url : "/admin/sdk/user/register",
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
                location.href = "/admin/sdk/user/login";
            } else{
                $("div.admin-register-error-msg").text(response.msg);
                $("div.admin-register-error-msg").show();
            }
        },
        error : function() {
            alert("服务器错误，请稍后重试");
        }
    });
});
