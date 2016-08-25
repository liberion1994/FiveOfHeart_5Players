/**
 * Created by liboyuan on 16/8/21.
 */
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

var AgentStatus = {
    HALL        : 1,
    UNPREPARED  : 2,
    PREPARED    : 3,
    IN_GAME     : 4
};

var GameStatus = {
    OFFER_MAJOR_AMOUNT  : 1,
    CHOOSE_MAJOR_COLOR  : 2,
    RESERVE_CARDS       : 3,
    CHOOSE_A_COLOR      : 4,
    PLAY_CARDS          : 5
};


var ui;
var socketClient;
var table;

function agentStatusToText(status) {
    switch (status) {
        case AgentStatus.UNPREPARED:
            return '<i class="icon-check-empty"></i>';
        case AgentStatus.PREPARED:
            return '<i class="icon-check"></i>';
        case AgentStatus.IN_GAME:
            return '<i class="icon-headphones"></i>';
    }
}


function bootstrapInit() {
    //init popovers
    $('[data-toggle="popover"]').popover();
    $(".nav li.disabled a").click(function() {
        return false;
    });
}

function reInit() {
    socketClient.getAllInfo(
        function () { location.href='/tables' },
        function (res) {
            table = new Table(res);
            ui = new UI();
            ui.repaint();
            ui.logSystemEvent('已重新同步');
            bootstrapInit();
        });
}

function notify(text, type) {
    switch (type) {
        case 'error':
            $.notify({
                message: text
            }, {
                element: '#operation-area',
                delay: 500,
                timer: 500,
                placement : {
                    from: 'bottom',
                    align: 'center'
                },
                animate: {
                    enter: 'animated fadeInUp',
                    exit: 'animated fadeOutDown'
                },
                allow_dismiss: false,
                type: 'danger'
            });
            break;
        case 'alert':
            $.notify({
                message: text
            }, {
                element: '#table-area',
                delay: 1000,
                timer: 1000,
                newest_on_top: true,
                placement : {
                    from: 'top',
                    align: 'center'
                },
                animate: {
                    enter: 'animated fadeIn',
                    exit: 'animated fadeOut'
                },
                allow_dismiss: false,
                type: 'info'
            });
            break;
        default:
            break;
    }
}

function wrappedAlert(msg) {
    notify(msg, 'error');
}