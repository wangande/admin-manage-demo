/**
 * Created by wangande on 16-1-13.
 */


function userLogin(){
    var mail = $("#mail").val().trim();
    var password = $("#password").val().trim();

    if (!mail || !password) {
        $("div.admin-login-error-msg").text("账户或密码为空！");
        $("div.admin-login-error-msg").show();
        return;
    }

    if (mail == "944515332@qq.com" && password=="123456"){
        location.href = "../../../admin-manage/admin/app/app_verify.html";
    }else {
        $("div.admin-login-error-msg").text("用户名或密码错误");
        $("div.admin-login-error-msg").show();
    }
    return;
    $.ajax({
        url : "/admin/sdk/user/login",
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

}

document.onkeydown = function(event_e){
    if(window.event) {
        event_e = window.event;
    }

    var int_keycode = event_e.charCode||event_e.keyCode;
    if( int_keycode == '13' ) {
        userLogin();
        return;
    }
}



$(".user-login-submit").on("click", function(){
    userLogin();
});