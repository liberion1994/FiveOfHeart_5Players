/**
 * Created by liboyuan on 16/8/28.
 */

var Game = require("../models/game");

function AutoPlayer(game) {
    this.game = game;

    this.makeAction = function () {
        var sid = this.game.currentTurn.remainedSid[0];
        switch (this.game.currentTurn.status) {
            case Game.GameStatus.OFFER_MAJOR_AMOUNT:
                return this.offerMajorAmount(sid);
        }
    };

    this.offerMajorAmount = function (sid) {
        var realSum = this.game.cardUtil.getAbsoluteMajorSum(this.game.cards[sid]);
        return {amount: realSum};
    };

}

module.exports = AutoPlayer;