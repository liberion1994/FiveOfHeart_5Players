/**
 * Created by liboyuan on 16/8/12.
 */


function notify(text, type) {
    $.notify({
        message: text
    }, {
        element: 'body',
        delay: 1000,
        timer: 1000,
        placement : {
            from: 'bottom',
            align: 'center'
        },
        animate: {
            enter: 'animated fadeInUp',
            exit: 'animated fadeOutDown'
        },
        allow_dismiss: false,
        type: type || 'danger'
    });
}

function submitLogin(usernameDiv, passwordDiv) {
    var username = usernameDiv.val();
    var password = passwordDiv.val();
    $.ajax({
        type: 'POST',
        url: '/users/login',
        data: {username: username, password: password},
        dataType: 'json',
        success: function () {
            location.href = '/tables';
        },
        error: function (msg) {
            notify(msg.responseText);
        }
    });
}

function submitRegister(usernameDiv, passwordDiv, repeatPasswordDiv) {
    var username = usernameDiv.val();
    var password = passwordDiv.val();
    var repeatPassword = repeatPasswordDiv.val();
    if (repeatPassword != password)
        return notify('两次输入的密码不一致');
    $.ajax({
        type: 'POST',
        url: '/users/register',
        data: {username: username, password: password},
        dataType: 'json',
        success: function () {
            notify('注册成功,请登录', 'success');
            $('#username').val(username);
            $('#password').val(password);
            $("#register").removeClass('in active');
            $("#registerNav").removeClass('active');
            $("#login").addClass('in active');
            $("#loginNav").addClass('active');
        },
        error: function (msg) {
            notify(msg.responseText);
        }
    });
}

$(document).ready(function () {
    $('#submitBtn').click(function () {
        submitLogin($('#username'), $('#password'));
    });
    $('#submitBtnR').click(function () {
        submitRegister($('#usernameR'), $('#passwordR'), $('#repeatPasswordR'));
    });

    $('#login').keyup(function(event){
        if(event.keyCode ==13){
            $("#submitBtn").click();
        }
    });

    $('#register').keyup(function(event){
        if(event.keyCode ==13){
            $("#submitBtnR").click();
        }
    });
});
