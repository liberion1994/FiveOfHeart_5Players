/**
 * Created by liboyuan on 16/9/4.
 */

var GameStatus = require('../properties/types').GameStatus;

exports.getEnterAudio = function () {
    return 'in_game/enter';
};

exports.getLeaveAudio = function () {
    return 'in_game/leave';
};

exports.getPrepareAudio = function () {
    return 'in_game/prepare';
};

exports.getUnPrepareAudio = function () {
    return 'in_game/unprepare';
};

exports.getInGameAudio = function (content, game) {
    var dir = 'in_game/';
    switch (content.actionType) {
        case GameStatus.OFFER_MAJOR_AMOUNT:
            return dir + 'amount' + content.amount;
        case GameStatus.CHOOSE_MAJOR_COLOR:
        case GameStatus.CHOOSE_A_COLOR:
            return content.color;
        case GameStatus.PLAY_CARDS:
            if (content.original)
                return dir + 'multi_group_fail';
            if (!game) {
                //last round's last play
                return dir + 'game_over';
            }
            if (game.currentTurn.done.length == 0) {
                //means last play
                if (game.currentTurn.startSid == content.sid)
                    return dir + 'larger';
                else
                    return dir + 'smaller';

            } else if (game.currentTurn.done.length == 1) {
                var struc = game.cardUtil.getCardStructure(content.cards);
                var tmp;
                for (var type2 in struc)
                    tmp = struc[type2];
                struc = tmp;
                if (struc.length != 1)
                    return dir + 'multi_group';
                if (struc[0].type == 'tractor')
                    return dir + 'tractor';
                switch (struc[0].multi) {
                    case 3:
                        return dir + 'triple';
                    case 2:
                        return dir + 'double';
                    case 1:
                        var type = struc[0].content[0].type;
                        if (type != 0)
                            return dir + 'J';
                        else
                            return dir + struc[0].content[0].color;
                }
            } else {
                if (game.currentTurn.maxSid == content.sid)
                    return dir + 'larger';
                else
                    return dir + 'smaller';
            }
            break;
        default:
            break;
    }
};