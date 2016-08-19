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
    this.majorColor = null;

    this.aColor = null;

    this.cardUtil = new CardUtil.CardUtil(this.majorNumber);

    this.cards = new Array(Property.GamePlayers);
    this.points = new Array(Property.GamePlayers);
    this.caught5Heart = new Array(Property.GamePlayers);

    this.reservedCards = [];

    this.currentTurn = null;

    this.result = null;

    this.gameInfo = function (sid) {
        return {
            currentTurn: this.currentTurn,

            masterSid: this.masterSid,
            majorNumber: this.majorNumber,
            majorColor: this.majorColor,
            subMasterSid: this.subMasterSid,
            aColor: this.aColor,
            result: this.result,

            points: this.points,
            caught5Heart: this.caught5Heart,

            cards: this.cards[sid],
            reservedCards: (sid == this.masterSid && this.status >= GameStatus.CHOOSE_A_COLOR) ? this.reservedCards : null
        }
    };

    /**
     * 结算
     */
    this.sumUp = function () {

        var slavePoints = 0;
        //刚好的话是不升级的
        var slaveUpper = -1;
        for (var i = 0; i < Property.GamePlayers; i ++) {
            var tmpLen = this.caught5Heart[i].length;
            if (i != this.masterSid && i != this.subMasterSid) {
                slavePoints += this.points[i];
                for (var j = 0; j < tmpLen; j ++) {
                    var from = this.caught5Heart[i][j];
                    if (from == this.masterSid || from == this.subMasterSid)
                        slaveUpper ++;
                }
            } else {
                for (var j2 = 0; j2 < tmpLen; j2 ++) {
                    var from2 = this.caught5Heart[i][j2];
                    if (!(from2 == this.masterSid || from2 == this.subMasterSid)) {
                        slaveUpper --;
                    }
                }
            }
        }
        if (slavePoints >= Property.LevelUpPoints) {
            slaveUpper += parseInt(
                (slavePoints - Property.LevelUpPoints) / Property.UpperPointsPerLevel);
        } else {
            if (slavePoints == 0) {
                slaveUpper -= 2;
            } else if (slavePoints < Property.UpperPointsPerLevel){
                slaveUpper --;
            }
        }
        var winners = 'Slave';
        if (slaveUpper < 0) {
            winners = 'Master';
            slaveUpper = -slaveUpper;
        }
        this.result = {
            reservedCards: this.reservedCards,
            winners: winners,
            levelUp: slaveUpper
        };
    };

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
            maxSid: null
        };
        for (var i = 0; i < Property.GamePlayers; i ++) {
            this.points[i] = 0;
            this.caught5Heart[i] = [];
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
     * @param content
     */
    this.commitAction = function (content) {
        //TODO complete this function
        content.sid = this.currentTurn.remainedSid.shift();
        content.actionType = this.currentTurn.status;
        this.currentTurn.done.push(content);
        console.log(content);
        this.nextStatus();
    };

    this.nextStatus = function () {
        //TODO complete this function
        if (this.currentTurn.remainedSid.length != 0)
            return;
        switch (this.currentTurn.status) {
            case GameStatus.OFFER_MAJOR_AMOUNT:
                this.waitingForChooseMajorColor();
                break;
            case GameStatus.CHOOSE_MAJOR_COLOR:
                this.waitingForReserveCards();
                break;
            case GameStatus.RESERVE_CARDS:
                this.waitingForChooseAColor();
                break;
            case GameStatus.CHOOSE_A_COLOR:
                this.waitingForPlayCards();
                break;
            case GameStatus.PLAY_CARDS:
                this.waitingForPlayCardsNextRound();
                break;
            default:
                break;
        }
    };

    this.waitingForChooseMajorColor = function () {
        var maxMajorSum = -1;
        var sid = -1;
        for (var i = 0; i < Property.GamePlayers; i ++){
            if (this.currentTurn.done[i].amount > maxMajorSum) {
                maxMajorSum = this.currentTurn.done[i].amount;
                sid = this.currentTurn.done[i].sid;
            }
        }
        this.currentTurn = {
            status: GameStatus.CHOOSE_MAJOR_COLOR,
            startSid: sid,
            remainedSid: [],
            done: [],
            maxSid: null
        };
        this.currentTurn.remainedSid.push(sid);
        if (this.masterSid == null)
            this.masterSid = sid;
    };

    this.waitingForReserveCards = function () {
        this.currentTurn = {
            status: GameStatus.RESERVE_CARDS,
            startSid: this.masterSid,
            remainedSid: [],
            done: [],
            maxSid: null
        };
        this.currentTurn.remainedSid.push(this.masterSid);
    };

    this.waitingForChooseAColor = function () {
        this.currentTurn = {
            status: GameStatus.CHOOSE_A_COLOR,
            startSid: this.masterSid,
            remainedSid: [],
            done: [],
            maxSid: null
        };
        this.currentTurn.remainedSid.push(this.masterSid);
    };

    this.waitingForPlayCards = function () {
        var sid = this.masterSid;
        this.currentTurn = {
            status: GameStatus.PLAY_CARDS,
            startSid: sid,
            remainedSid: [],
            done: [],
            maxSid: null
        };
        for (var i = 0; i < Property.GamePlayers; i ++)
            this.currentTurn.remainedSid.push((sid + i) % Property.GamePlayers);
    };

    this.waitingForPlayCardsNextRound = function () {

        //计算本轮得分以及抓到的红五情况
        var sid = this.currentTurn.maxSid;
        var score = 0;
        for (var j = 0; j < Property.GamePlayers; j ++) {
            score += this.cardUtil.getPoints(this.currentTurn.done[j].cards);
            var h5 = this.cardUtil.containsFiveOfHearts(this.currentTurn.done[j].cards);
            if (h5 > 0) {
                for (var k = 0; k < h5; k ++)
                    this.caught5Heart[sid].push(j);
            }
        }

        //判断是否最后一轮
        if (this.cards[0].length == 0) {
            //牌型是根据第一个出牌的决定
            if (sid != this.masterSid && sid != this.subMasterSid) {
                this.points[sid] += score * this.cardUtil.getMultiple(
                        this.currentTurn.done[0].cards);
            }
            //last round ended
            this.sumUp();
        } else {
            this.points[sid] += score;
            this.currentTurn = {
                status: GameStatus.PLAY_CARDS,
                startSid: sid,
                remainedSid: [],
                done: [],
                maxSid: null
            };
            for (var i = 0; i < Property.GamePlayers; i++)
                this.currentTurn.remainedSid.push((sid + i) % Property.GamePlayers);
        }
    };

    this.onAction = function (sid, action, content, err, callback) {
        if (sid != this.currentTurn.remainedSid[0])
            return err('Not your turn');
        if (action != this.currentTurn.status)
            return err('Wrong command');
        switch (this.currentTurn.status) {
            case GameStatus.OFFER_MAJOR_AMOUNT:
                this.offerMajorAmount(sid, content, err, function () { callback() });
                break;
            case GameStatus.CHOOSE_MAJOR_COLOR:
                this.chooseMajorColor(sid, content, err, function () { callback() });
                break;
            case GameStatus.RESERVE_CARDS:
                this.reserveCards(sid, content, err, function () { callback() });
                break;
            case GameStatus.CHOOSE_A_COLOR:
                this.chooseAColor(sid, content, err, function () { callback() });
                break;
            case GameStatus.PLAY_CARDS:
                return this.playCards(sid, content, err, function () { callback() });
                break;
            default:
                break;
        }
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
        var action = {amount: offeredSum};
        this.commitAction(action);
        callback(action);
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
        for (var j = 0; j < Property.ReservedCardSum; j ++)
            this.cards[sid].push(this.reservedCards[j]);
        for (var i = 0; i < Property.GamePlayers; i ++)
            this.cards[i] = this.cardUtil.getSortedCards(this.cards[i]);
        var action = {color: color};
        this.commitAction(action);
        callback(action);
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
        var cards = this.cardUtil.extractCards(this.cards[sid], content.cards);
        if (cards == null)
            return err('No content received');
        if (cards.length != Property.ReservedCardSum)
            return err('Wrong cards amount');
        if (!this.cardUtil.popCards(this.cards[sid], cards))
            return err('Cards not match');
        this.reservedCards = cards;
        var action = {cards: cards};
        this.commitAction(action);
        callback(action);
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
        var action = {color: color};
        this.commitAction(action);
        callback(action);
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
            if (!this.cardUtil.checkNotFirstPlayLegal(
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
        var partRejected = !(res == cards);
        if (!this.cardUtil.popCards(this.cards[sid], res))
            return err('Cards not match');
        this.becomeSubMaster(sid, res);
        if (this.currentTurn.maxSid == null) {
            this.currentTurn.maxSid = sid;
        } else {
            var tmpLen = this.currentTurn.done.length;
            for (var i = 0; i < tmpLen; i ++) {
                if (this.currentTurn.done[i].sid == this.currentTurn.maxSid) {
                    if (this.cardUtil.cardGroupLargerThan(
                            this.currentTurn.done[0].cards,
                            this.currentTurn.done[i].cards, res))
                        this.currentTurn.maxSid = sid;
                    break;
                }
            }
        }
        var action = {cards: res, partRejected: partRejected};
        this.commitAction(action);
        callback(action);
    };

    /**
     * init when constructed
     */
    this.init();
}

exports.GameStatus = GameStatus;
exports.Game = Game;