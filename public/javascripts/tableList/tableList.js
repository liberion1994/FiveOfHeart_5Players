/**
 * Created by liboyuan on 16/8/17.
 */

$(document).ready(function () {

    var divs = $('.table');
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
                    var inner = '座位' + i + ':';
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
                            alert('未知错误');
                        }
                    });
                });
            },
            error: function (msg) {
                alert('未知错误');
            }
        });
        $('#table-option').modal();
    });

    var width = divs.css('width');
    divs.css('height', width)
        .css('line-height', width);

    $(window).resize(function () {
        var width = divs.css('width');
        divs.css('height', width)
            .css('line-height', width);
    });

});