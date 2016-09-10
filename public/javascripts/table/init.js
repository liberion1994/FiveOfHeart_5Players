/**
 * Created by liboyuan on 16/8/21.
 */

var AgentCommandType = {
    IntoTable:  0,
    EnterTable: 1,
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
var updated = false;
var keyboardUp = false;
var timer;
var settings;
var playerInited = false;

var speechSession = null;
var speechAppid = '57d3bb98';
var speechSignature = null;

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
    $(".nav li.disabled a").click(function() {return false});
    $(".no-click").popover('destroy');
}

function initCtrl() {

    $('#chat-submit').click(function () {
        var div = $('#chat-text');
        var txt = div.val();
        if (txt == '')
            return notify('请告诉我你要说什么呀', 'error');
        socketClient.emitChatMessage(txt);
        div.val('');
        $('#chat-modal').modal('hide');
    });

    $('#chat-text').keyup(function(event){
        if(event.keyCode == 13){
            $("#chat-submit").click();
        }
    });

    $('#chat').click(function () {
        $('#chat-modal')
            .on('shown.bs.modal', function () {
                $('#chat-text').focus();
            }).modal();
    });

    $('.send-built-in').click(function () {
        var type = $(this).html();
        socketClient.emitBuiltInMessage(type);
    });


    $(document).click(function () {
        if (playerInited)
            return;
        playAudio('');
        playerInited = true;
    }).keypress(function(event){
        if(event.shiftKey && event.which == 13){
            $("#chat").click();
        }
    });
}

function reSync() {
    console.log('resync');
    socketClient.getAllInfo(
        function () { location.href='/tables' },
        function (res) {
            table = new Table(res);
            ui = new UI();
            ui.repaint();
            bootstrapInit();
        });
}

function notify(text, type) {
    switch (type) {
        case 'error':
            $.notify({
                message: text
            }, {
                element: '#bottom-area',
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

function initSpeech() {
    speechSession = new IFlyTtsSession({
        'url': 'http://webapi.openspeech.cn/',
        'reconnection': true,
        'reconnectionDelay': 30000
    });
}