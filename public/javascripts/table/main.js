/**
 * Created by liboyuan on 16/8/18.
 */

$(document).ready(function () {

    socketClient = new SocketClient();
    socketClient.getAllInfo(
        function (msg) { location.href='/tables' },
        function (res) {
            table = new Table(res);
            ui = new UI();
            ui.repaint();
            bootstrapInit();
            socketClient.emitCommand(AgentCommandType.IntoTable, null, function () {});
        });



    $(window).resize(function () {
        ui.repaint();
    });
});
