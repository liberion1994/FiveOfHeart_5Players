/**
 * Created by liboyuan on 16/8/17.
 */

var AgentStatus = {
    HALL        : 1,
    UNPREPARED  : 2,
    PREPARED    : 3,
    IN_GAME     : 4
};

var seatsName = [
    '甲', '乙', '丙', '丁', '戊'
];

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

$(document).ready(function () {

    var divs = $('.myTable');
    divs.click(function () {
        var tid = $(this).attr('table-id');
        $.ajax({
            type: 'GET',
            url: '/tables/' + tid + '/seats',
            success: function (seats) {
                var header = $('#table-modal-header').empty();
                var body = $('#table-modal-body').empty();
                $('<h3>').html('加入第' + tid + '桌').appendTo(header);
                var len = seats.length;
                for (var i = 0; i < len; i ++) {
                    var inner = '座位' + seatsName[i] + ':';
                    if (seats[i].user == null) {
                        $('<p>').html(inner + '<a class="enterBtn" table-id=' + tid + ' seat-id=' + i + '>加入</a>').appendTo(body);
                    } else {
                        $('<p>').html(inner + seats[i].user).appendTo(body);
                    }
                }
                $('.enterBtn').click(function () {
                    var tid = $(this).attr('table-id');
                    var sid = $(this).attr('seat-id');
                    $.ajax({
                        type: 'POST',
                        url: '/tables/' + tid,
                        data: {sid: sid},
                        success: function (msg) {
                            if (msg == 'success') {
                                location.href = '/tables/' + tid;
                            } else {
                                alert(msg);
                            }
                        },
                        error: function () {
                            alert('发生错误,似乎是登录会话过期,请刷新试试');
                        }
                    });
                });
            },
            error: function () {
                alert('发生错误,似乎是登录会话过期,请刷新试试');
            }
        });
        $('#table-option').modal();
    });

    var width = divs.css('width');
    divs.css('height', width)
        .css('line-height', width)
        .css('border-radius', parseInt(width) / 2);

    $(window).resize(function () {
        var width = divs.css('width');
        divs.css('height', width)
            .css('line-height', width)
            .css('border-radius', parseInt(width) / 2);
    });

});