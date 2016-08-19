/**
 * Created by liboyuan on 16/8/18.
 */

var AgentCommandType = {
    IntoTable:  1,
    LeaveTable: 2,
    Prepare:    3,
    UnPrepare:  4,
    InGame:     5,
    Disconnect: 6
};

var ui;
var socketClient;
var table;

$(document).ready(function () {

    socketClient = new SocketClient();
    socketClient.getAllInfo(
        function (msg) { location.href='/tables' },
        function (res) {
            table = res;
            socketClient = new SocketClient();
            ui = new UI();
            //TODO ui.drawEverything
            bootstrapInit();
            initControls();
        });

    $.ajax({
        type: 'GET',
        url: '/tables/current_table/info',
        success: function (res) {
            table = res;
            socketClient = new SocketClient();
            ui = new UI();
            ui.onResize();
            bootstrapInit();
            initControls();
        },
        error: function () {
            location.href='/tables';
        }
    });



    $(window).resize(function () {
        ui.onResize();
    });
});

function bootstrapInit() {
    //init popovers
    $('[data-toggle="popover"]').popover();
}

function initControls() {
    $('#submitBtn').click(function () {
        socketClient.emitCommand(AgentCommandType.Prepare, null, alert);
        // ui.inHandCardsArea.onPlayCards();
    });
}
