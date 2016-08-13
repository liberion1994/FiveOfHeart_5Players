/**
 * Created by liboyuan on 16/8/12.
 */

function submitLogin(usernameDiv, passwordDiv) {
    var username = usernameDiv.val();
    var password = passwordDiv.val();
    $.ajax({
        type: 'POST',
        url: '/users/login',
        data: {username: username, password: password},
        success: function (res) {
            location.href = '/tables';
        },
        error: function () {
            alert('登录失败');
        }
    });
}

$(document).ready(function () {
    $('#submitBtn').click(function () {
        submitLogin($('#username'), $('#password'));
    });
});
