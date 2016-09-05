/**
 * Created by liboyuan on 16/9/4.
 */

var GameStatus = require('../models/game').GameStatus;

exports.getEnterAudio = function (sid) {
    return 't0enter_' + sid;
};

exports.getLeaveAudio = function (sid) {
    return 't0leave_' + sid;
};

exports.getPrepareAudio = function (sid) {
    return 't0prepare_' + sid;
};

exports.getUnPrepareAudio = function (sid) {
    return 't0unprepare_' + sid;
};

exports.getInGameAudio = function (content, game) {
    switch (content.actionType) {
        case GameStatus.OFFER_MAJOR_AMOUNT:
            return 't1g1_' + content.amount;
        case GameStatus.CHOOSE_MAJOR_COLOR:
        case GameStatus.CHOOSE_A_COLOR:
            return content.color;
        case GameStatus.PLAY_CARDS:
            if (content.original)
                return 'multi_group_fail';
            if (game.currentTurn.done.length == 1) {
                var struc = game.cardUtil.getCardStructure(content.cards);
                var tmp;
                for (var type2 in struc)
                    tmp = struc[type2];
                struc = tmp;
                if (struc.length != 1)
                    return 'multi_group';
                if (struc[0].type == 'tractor')
                    return 'tractor';
                switch (struc[0].multi) {
                    case 3:
                        return 'triple';
                    case 2:
                        return 'double';
                    case 1:
                        var type = struc[0].content[0].type;
                        if (type != 0)
                            return 'J';
                        else
                            return struc[0].content[0].color;
                }
            } else {
                if (game.currentTurn.maxSid == content.sid)
                    return 'larger';
                else
                    return 'smaller';
            }
            break;
        default:
            break;
    }
};