/**
 * Created by liboyuan on 16/8/18.
 */

$(document).ready(function () {

    socketClient = new SocketClient();
    socketClient.loadSettings(
        function () { location.href='/tables' },
        function (res0) {
            settings = res0;
            socketClient.getAllInfo(
                function () { location.href='/tables' },
                function (res) {
                    table = new Table(res);
                    ui = new UI();
                    ui.repaint();
                    bootstrapInit();
                    socketClient.emitCommand(AgentCommandType.IntoTable, null, function () {});
                }
            );
        }
    );

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

    timer = setInterval(function () {
        if (!updated) {
            reSync();
        }
        updated = false;
    }, 3000);

    initCtrl();
});
