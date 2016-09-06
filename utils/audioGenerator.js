/**
 * Created by liboyuan on 16/9/4.
 */

var GameStatus = require('../models/game').GameStatus;

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
    switch (content.actionType) {
        case GameStatus.OFFER_MAJOR_AMOUNT:
            return 'in_game/amount' + content.amount;
        case GameStatus.CHOOSE_MAJOR_COLOR:
        case GameStatus.CHOOSE_A_COLOR:
            return content.color;
        case GameStatus.PLAY_CARDS:
            if (content.original)
                return 'in_game/multi_group_fail';
            if (!game) {
                //last round's last play
                return 'in_game/game_over';
            }
            if (game.currentTurn.done.length == 0) {
                //means last play
                if (game.currentTurn.startSid == content.sid)
                    return 'in_game/larger';
                else
                    return 'in_game/smaller';

            } else if (game.currentTurn.done.length == 1) {
                var struc = game.cardUtil.getCardStructure(content.cards);
                var tmp;
                for (var type2 in struc)
                    tmp = struc[type2];
                struc = tmp;
                if (struc.length != 1)
                    return 'in_game/multi_group';
                if (struc[0].type == 'tractor')
                    return 'in_game/tractor';
                switch (struc[0].multi) {
                    case 3:
                        return 'in_game/triple';
                    case 2:
                        return 'in_game/double';
                    case 1:
                        var type = struc[0].content[0].type;
                        if (type != 0)
                            return 'in_game/J';
                        else
                            return 'in_game/' + struc[0].content[0].color;
                }
            } else {
                if (game.currentTurn.maxSid == content.sid)
                    return 'in_game/larger';
                else
                    return 'in_game/smaller';
            }
            break;
        default:
            break;
    }
};