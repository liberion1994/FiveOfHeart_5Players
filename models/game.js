/**
 * Created by liboyuan on 16/8/13.
 */

var CardUtil = require('./cardUtil');

var GameStatus = {
    OFFER_MAJOR_ACCOUNT : 1,
    CHOOSE_MAJOR_COLOR  : 2,
    BURY_CARDS          : 3,
    CHOOSE_A_COLOR      : 4,
    PLAY_CARDS          : 5
};


function Game(masterSid, majorNumber, agents) {

    this.masterSid = masterSid;
    this.majorNumber = majorNumber;

    this.status = GameStatus.OFFER_MAJOR_ACCOUNT;
    this.currentSid = this.masterSid == null ? 0 : this.masterSid;


    this.histories = [];

    this.cardUtil = new CardUtil.CardUtil(this.majorNumber);

    this.publicInfo = function () {

    };

    this.onAction = function (sid, action, content) {
        if (sid != this.currentSid)
            return false;
        if (action != this.status)
            return false;
        switch (this.status) {
            case '报真主数':
                return this.checkSubMajorSum(sid, content);
                break;
            case '叫主':
                return this.setMajorColor(sid, content);
                break;
            case '埋底':
                return this.reserveCards(sid, content);
                break;
            case '叫A':
                return this.setAColor(sid, content);
                break;
            case '出牌':
                return this.playCards(sid, content);
                break;
            default:
                break;
        }
    }
}

exports.GameStatus = GameStatus;
exports.Game = Game;