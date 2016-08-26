/**
 * Created by liboyuan on 16/8/26.
 */
$(function () {
    $('#logout-btn').click(function () {
        $.ajax({
            type: 'POST',
            url: '/users/logout',
            success: function (res) {
                if (res == 'success')
                    location.href = '/';
                else
                    alert('登出失败');
            },
            error: function () {
                alert('登出失败');
            }
        });
    });
});