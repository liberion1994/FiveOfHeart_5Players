/**
 * Created by liboyuan on 16/8/13.
 */

var CardUtil = require('./cardUtil');
var Property = require("../properties/property");

var GameStatus = {
    OFFER_MAJOR_AMOUNT  : 1,
    CHOOSE_MAJOR_COLOR  : 2,
    RESERVE_CARDS       : 3,
    CHOOSE_A_COLOR      : 4,
    PLAY_CARDS          : 5
};


function Game(masterSid, majorNumber) {

    this.masterSid = masterSid;
    this.majorNumber = majorNumber;
    this.subMasterSid = null;

    this.aColor = null;

    this.cardUtil = new CardUtil.CardUtil(this.majorNumber);

    this.cards = new Array(Property.GamePlayers);
    this.points = new Array(Property.GamePlayers);

    this.reservedCards = [];

    this.currentTurn = null;
    this.histories = [];

    /**
     * 发牌
     * @param cards
     */
    this.dealCards = function (cards) {
        var tmp = new Array(Property.GamePlayers);
        for (var n = 0; n < Property.GamePlayers; n ++) {
            tmp[n] = [];
        }
        for (var i = 0; i < Property.CardsPerPlayer; i ++) {
            for (var j = 0; j < Property.GamePlayers; j ++) {
                tmp[j].push(cards.pop());
            }
        }
        for (var m = 0; m < Property.GamePlayers; m ++) {
            this.cards[m] = this.cardUtil.getSortedCards(tmp[m]);
        }
        for (var k = 0; k < Property.ReservedCardSum; k ++) {
            this.reservedCards.push(cards.pop());
        }
    };

    this.init = function () {
        this.dealCards(this.cardUtil.getShuffledCards());
        var startSid = this.masterSid == null ? 0 : this.masterSid;
        this.currentTurn = {
            status: GameStatus.OFFER_MAJOR_AMOUNT,
            startSid: startSid,
            remainedSid: [],
            done: [],
            maxCards: null
        };
        for (var i = 0; i < Property.GamePlayers; i ++) {
            this.points[i] = 0;
            this.currentTurn.remainedSid.push((startSid + i) % Property.GamePlayers);
        }
    };

    /**
     * 每次action完成后调用
     * 完成的内容:
     * 记录到log
     * 押入本轮信息
     * 发送action到客户端
     * 切换状态
     * 发送状态信息到客户端
     * @param type
     * @param content
     */
    this.commitAction = function (type, content) {
        //TODO complete this function
        var currentSid = this.currentTurn.remainedSid.shift();
        this.currentTurn.
        this.nextStatus();
    };

    this.nextStatus = function () {
        //TODO complete this function
    };

    this.onAction = function (sid, action, content, err, callback) {
        if (sid != this.currentTurn.remainedSid[0])
            return err('Not your turn');
        if (action != this.currentTurn.status)
            return err('Wrong command');
        switch (this.currentTurn.status) {
            case GameStatus.OFFER_MAJOR_AMOUNT:
                this.offerMajorAmount(sid, content, err, function () {});
                break;
            case GameStatus.CHOOSE_MAJOR_COLOR:
                this.offerMajorAmount(sid, content, err, function () {});
                break;
            case GameStatus.RESERVE_CARDS:
                this.reserveCards(sid, content, err, function () {});
                break;
            case GameStatus.CHOOSE_A_COLOR:
                this.chooseAColor(sid, content, err, function () {});
                break;
            case GameStatus.PLAY_CARDS:
                return this.playCards(sid, content, err, function () {});
                break;
            default:
                break;
        }
        callback();
    };

    /**
     * 报真主数
     * @param sid
     * @param content example: 6
     * @param err
     * @param callback
     */
    this.offerMajorAmount = function (sid, content, err, callback) {
        if (content == null)
            return err('No content received');
        var realSum = this.cardUtil.getAbsoluteMajorSum(this.cards[sid]);
        var offeredSum = content.sum;
        if (offeredSum == null)
            return err('No content received');
        if (offeredSum > realSum)
            return err('The amount should not above the real amount');
        this.commitAction(GameStatus.OFFER_MAJOR_AMOUNT, {amount: offeredSum});
        callback();
    };

    /**
     * 选择主花色
     * @param sid
     * @param content example: '♣'
     * @param err
     * @param callback
     * @returns {*}
     */
    this.chooseMajorColor = function (sid, content, err, callback) {
        if (content == null)
            return err('No content received');
        var color = content.color;
        if (!this.cardUtil.isNormalColor(color))
            return err('Illegal color');
        this.majorColor = color;
        this.cardUtil.majorColor = color;
        this.commitAction(GameStatus.CHOOSE_MAJOR_COLOR, {color: color});
        //TODO remember to resort cards
        callback();
    };

    /**
     * 埋底牌
     * @param sid
     * @param content example: [{ number: 9, color: '♣' }]
     * @param err
     * @param callback
     * @returns {*}
     */
    this.reserveCards = function (sid, content, err, callback) {
        if (content == null)
            return err('No content received');
        var cards = content.cards;
        if (cards == null)
            return err('No content received');
        if (cards.length != Property.ReservedCardSum)
            return err('Wrong cards amount');
        if (!this.cardUtil.popCards(this.cards[sid], cards))
            return err('Cards not match');
        this.reservedCards = cards;
        this.commitAction(GameStatus.RESERVE_CARDS, {cards: cards});
        callback();
    };

    /**
     * 选择A的花色
     * @param sid
     * @param content example: '♣'
     * @param err
     * @param callback
     * @returns {*}
     */
    this.chooseAColor = function (sid, content, err, callback) {
        if (content == null)
            return err('No content received');
        var color = content.color;
        if (!this.cardUtil.isNormalColor(color))
            return err('Illegal color');
        this.aColor = color;
        this.commitAction(GameStatus.CHOOSE_A_COLOR, {color: color});
        callback();
    };

    /**
     * 判断出牌是否合理,分成第一个出和跟牌两种情况
     * @param cards
     * @returns {*}
     */
    this.checkAvailable = function (cards) {
        var currentSid = this.currentTurn.remainedSid[0];

        if (this.currentTurn.startSid == currentSid) {
            var remained = [];
            for (var i = 1; i < Property.GamePlayers; i ++) {
                remained.push(this.cards[(currentSid + i) % Property.GamePlayers]);
            }
            return this.cardUtil.checkFirstPlayLegal(cards, remained);
        }
        else {
            if (this.cardUtil.checkNotFirstPlayLegal(
                    this.currentTurn.done[0].cards, cards, this.cards[currentSid]))
                return null;
            return cards;
        }
    };

    /**
     * 判断是否成为副庄家
     * @param sid
     * @param cards
     * @returns {boolean}
     */
    this.becomeSubMaster = function (sid, cards) {
        if (sid == this.masterSid)
            return false;
        if (this.subMasterSid != null)
            return false;
        var len = cards.length;
        for (var i = 0; i < len; i ++) {
            if (cards[i].color == this.aColor && cards[i].number == 14) {
                this.subMasterSid = sid;
                return true;
            }
        }
        return false;
    };

    /**
     * 出牌
     * @param sid
     * @param content example: [{ number: 9, color: '♣' }]
     * @param err
     * @param callback
     * @returns {*}
     */
    this.playCards = function (sid, content, err, callback) {
        if (content == null)
            return err('No content received');
        var cards = this.cardUtil.extractCards(this.cards[sid], content.cards);
        if (cards == null)
            return err('Cards not match');
        var res = this.checkAvailable(cards);
        if (res == null)
            return err('Illegal operation');
        var partRejected = (res == cards);
        if (!this.popCards(this.cards[sid], res))
            return err('Cards not match');
        this.becomeSubMaster(sid, res);
        this.commitAction(GameStatus.PLAY_CARDS, {cards: res, partRejected: partRejected});
        callback();
    };

    /**
     * init when constructed
     */
    this.init();
}

exports.GameStatus = GameStatus;
exports.Game = Game;