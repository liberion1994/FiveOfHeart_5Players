/**
 * Created by liboyuan on 16/8/18.
 */

function Table(data) {
    for (var item in data) {
        this[item] = data[item];
    }
    if (this.game) {
        this.cardUtil = new CardUtil(this.game.majorNumber);
        if (this.game.majorColor)
            this.cardUtil.majorColor = this.game.majorColor;
    }

    this.reset = function () {
        this.onTimerCountDown(0);
    };

    this.getCurrentAgentStatus = function () {
        var sid = this.agentSid;
        return this.seats[sid].status;
    };

    this.onTimerCountDown = function (newCount) {
        this.timerCount = newCount;
        ui.onTimerCountDown();
    };

    this.onEnterTable = function (event) {
        if (!this.seats[event.sid]) {
            this.seats[event.sid] = {
                username: event.username,
                majorNumber: event.majorNumber,
                status: AgentStatus.UNPREPARED
            };
            ui.onEnterTable(event);
        }
    };

    this.onPrepare = function (event) {
        this.seats[event.sid].status = AgentStatus.PREPARED;
        for (var i = 0; i < 5; i ++) {
            if (this.seats[i] == null)
                return ui.onPrepare(event);
            else if (this.seats[i].status != AgentStatus.PREPARED)
                return ui.onPrepare(event);
        }
        var _this = this;
        socketClient.getGameInfo(
            function () {reSync()},
            function (info) {
                for (var i = 0; i < 5; i ++)
                    _this.seats[i].status = AgentStatus.IN_GAME;
                _this.game = info;
                _this.cardUtil = new CardUtil(info.majorNumber);
                _this.onTimerCountDown(0);
                ui.onPrepareAndGameStart(event);
            }
        );
    };

    this.onUnPrepare = function (event) {
        this.seats[event.sid].status = AgentStatus.UNPREPARED;
        ui.onUnPrepare(event);
    };

    this.onLeaveTable = function (event) {
        this.reset();
        this.seats[event.sid] = null;
        ui.onLeaveTable(event);
    };

    this.onInGame = function (event) {
        this.game.currentTurn.done.push(event.content);
        this.game.currentTurn.remainedSid.shift();

        switch (event.content.actionType) {
            case GameStatus.OFFER_MAJOR_AMOUNT:
                ui.onOfferMajorAmount(event);
                if (this.game.currentTurn.remainedSid.length == 0) {
                    /**
                     * 更新:下一轮的轮次信息,报主者的真主
                     * 可能更新:庄家信息
                     */
                    var _this = this;
                    setTimeout(function () {
                        _this.lastTurn = _this.game.currentTurn;
                        _this.game.currentTurn = event.content.updated.currentTurn;
                        var master = event.content.updated.masterSid;
                        if (master != null)
                            _this.game.masterSid = master;
                        ui.drawNextTurn(event, _this.game.currentTurn.status, {masterSid: master});
                    }, 1000);
                }
                break;
            case GameStatus.CHOOSE_MAJOR_COLOR:
                this.game.majorColor = event.content.color;
                this.cardUtil.majorColor = event.content.color;

                var _this2 = this;
                if (this.game.masterSid == this.agentSid) {
                    //庄家需要去取底牌
                    socketClient.getReservedCards(
                        function () {notify('无法获取底牌信息', 'error'); reSync(); },
                        function (cards) {
                            var len = cards.length;
                            for (var i = 0; i < len; i ++)
                                _this2.game.cards.push(cards[i]);
                            _this2.game.cards = _this2.cardUtil.getSortedCards(_this2.game.cards);
                            ui.onChooseMajorColor(event);
                            setTimeout(function () {
                                _this2.lastTurn = _this2.game.currentTurn;
                                _this2.game.currentTurn = event.content.updated.currentTurn;
                                ui.drawNextTurn(event, _this2.game.currentTurn.status);
                            }, 1000);
                        }
                    )
                } else {
                    this.game.cards = this.cardUtil.getSortedCards(this.game.cards);
                    ui.onChooseMajorColor(event);
                    setTimeout(function () {
                        _this2.lastTurn = _this2.game.currentTurn;
                        _this2.game.currentTurn = event.content.updated.currentTurn;
                        ui.drawNextTurn(event, _this2.game.currentTurn.status);
                    }, 1000);
                }
                break;
            case GameStatus.RESERVE_CARDS:
                if (event.sid == this.agentSid) {
                    if (event.force)
                        return reSync();
                    //移除所有的底牌
                    var res = this.cardUtil.popCards(this.game.cards, this.game.reservedCards);
                    if (!res) {reSync()}
                }
                ui.onReserveCards(event);
                var _this3 = this;
                setTimeout(function () {
                    _this3.lastTurn = _this3.game.currentTurn;
                    _this3.game.currentTurn = event.content.updated.currentTurn;
                    ui.drawNextTurn(event, _this3.game.currentTurn.status);
                }, 1000);
                break;
            case GameStatus.CHOOSE_A_COLOR:
                this.game.aColor = event.content.color;
                ui.onChooseAColor(event);
                var _this4 = this;
                setTimeout(function () {
                    _this4.lastTurn = _this4.game.currentTurn;
                    _this4.game.currentTurn = event.content.updated.currentTurn;
                    ui.drawNextTurn(event, _this4.game.currentTurn.status);
                }, 1000);
                break;
            case GameStatus.PLAY_CARDS:
                //不能先放动画再删除,放动画的时候会标注id
                if (event.sid == this.agentSid) {
                    if (event.force) {
                        this.playedCardsPicked = this.cardUtil.getCardsSameContent(
                            this.game.cards, event.content.cards);
                    } else if (event.content.original) {
                        this.playedCardsPicked = this.cardUtil.getCardsSameContent(
                            this.playedCardsPicked, event.content.cards);
                    }
                    var res2 = this.cardUtil.popCards(this.game.cards, this.playedCardsPicked);
                    if (!res2) {reSync()}
                }
                if (event.content.subMasterSid != null) {
                    this.game.subMasterSid = event.content.subMasterSid;
                }
                ui.onPlayCards(event);

                if (this.game.currentTurn.remainedSid.length == 0) {
                    /**
                     * 更新:,得分情况,抓到红五的情况
                     * 可能更新:副庄家信息,结局信息/下一轮的轮次信息
                     */
                    var _this5 = this;
                    if (event.content.updated.currentTurn) {
                        setTimeout(function () {
                            _this5.lastTurn = _this5.game.currentTurn;
                            _this5.game.currentTurn = event.content.updated.currentTurn;
                            _this5.game.points = event.content.updated.points;
                            _this5.game.caught5Heart = event.content.updated.caught5Heart;
                            ui.drawNextTurn(event, _this5.game.currentTurn.status);

                        }, 2000);
                    } else {
                        setTimeout(function () {ui.showResult(event.content.updated.result)}, 2000);
                    }
                }
                break;
        }
    };
}