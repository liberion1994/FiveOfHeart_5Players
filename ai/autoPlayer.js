/**
 * Created by liboyuan on 16/8/28.
 */

var Types = require("../properties/types");
var Property = require("../properties/property");

function AutoPlayer(game) {
    this.game = game;

    this.makeAction = function () {
        var sid = this.game.currentTurn.remainedSid[0];
        switch (this.game.currentTurn.status) {
            case Types.GameStatus.OFFER_MAJOR_AMOUNT:
                return this.offerMajorAmount(sid);
            case Types.GameStatus.CHOOSE_MAJOR_COLOR:
                return this.chooseMajorColor(sid);
            case Types.GameStatus.RESERVE_CARDS:
                return this.reserveCards(sid);
            case Types.GameStatus.CHOOSE_A_COLOR:
                return this.chooseAColor(sid);
            case Types.GameStatus.PLAY_CARDS:
                return this.playCards(sid);
        }
    };

    this.offerMajorAmount = function (sid) {
        var realSum = this.game.cardUtil.getAbsoluteMajorSum(this.game.cards[sid]);
        return {amount: realSum};
    };

    this.chooseMajorColor = function (sid) {
        return {color: '♥'};
    };

    this.reserveCards = function (sid) {
        var cards = this.game.cards[sid];
        var len = cards.length;
        var res = [];
        for (var i = len - Property.ReservedCardSum; i < len; i ++) {
            res.push(cards[i]);
        }
        return {cards: res};
    };

    this.chooseAColor = function (sid) {
        return {color: '♣'};
    };

    this.playCards = function (sid) {
        var cards = this.game.cards[sid];
        var res = [];
        if (sid == this.game.currentTurn.startSid) {
            res.push(cards[0]);
            return {cards: res};
        } else {
            res = this.game.cardUtil.getCardsWithLimitation(cards,
                this.game.cardUtil.getLimitation(this.game.currentTurn.done[0].cards, cards));
            return {cards: res};
        }
    };

}

module.exports = AutoPlayer;