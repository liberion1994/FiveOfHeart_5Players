/**
 * Created by liboyuan on 16/8/18.
 */

$(document).ready(function () {

    socketClient = new SocketClient();
    socketClient.getAllInfo(
        function () { location.href='/tables' },
        function (res) {
            table = new Table(res);
            ui = new UI();
            ui.repaint();
            bootstrapInit();
            socketClient.emitCommand(AgentCommandType.IntoTable, null, function () {});
        });

    $(document)
        .on('focus', 'input', function() {
            keyboardUp = true;
        })
        .on('blur', 'input', function() {
            keyboardUp = false;
        });

    $(window).resize(function () {
        if (!keyboardUp)
            ui.repaint();
    });

    $('#chat-submit').click(function () {
        var div = $('#chat-text');
        var txt = div.val();
        if (txt == '')
            return notify('请告诉我你要说什么呀', 'error');
        socketClient.emitChatMessage(txt);
        div.val('');
    });

    timer = setInterval(function () {
        if (!updated) {
            reSync();
        }
        updated = false;
    }, 3000);
});
