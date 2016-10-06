/**
 * Created by liboyuan on 16/8/26.
 */
$(function () {
    $('#logout-btn').click(function () {
        $.ajax({
            type: 'POST',
            url: '/users/logout',
            dataType: 'json',
            success: function (res) {
                if (res.success == true)
                    location.href = '/';
                else
                    alert('登出失败');
            },
            error: function (msg) {
                alert('登出失败:' + msg.responseText);
            }
        });
    });
});