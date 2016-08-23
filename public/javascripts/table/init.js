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