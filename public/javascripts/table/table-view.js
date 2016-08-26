/**
 * 绘制ui界面
 * 目前暂时不考虑横屏的情况
 * Created by liboyuan on 16/8/13.
 */


/**
 * 假设最大张开到30度,则根据计算总共多出0.6倍宽度
 */


var cardWidth = 60;
var cardHeight = cardWidth * 1.5;

var cardWidthInTable = 40;
var cardHeightInTable = cardWidthInTable * 1.5;

var MinOneLineCardAmount = 13;

var TableArea = function (targetDiv) {
    this.div = targetDiv;
    this.repaint = function () {

        this.width = this.div.width();
        this.height = this.div.height();
        for (var i = 0; i < 5; i ++)
            this.updateSeat(i);
        if (table.game) {
            this.updateActiveSeat(table.game.currentTurn.remainedSid[0]);
        } else {
            if (table.masterInGame != null)
                this.updateActiveSeat(table.masterInGame);
            else
                this.updateActiveSeat(0);
        }
        this.updateGameInfo();
        this.drawCurrentTurn();
    };

    this.updateGameInfo = function () {
        if (!table.game) {
            $('#game-info').html("<i class='icon-star'></i>" +
                (table.masterInGame == null ? "待定" : table.seats[table.masterInGame].user));
        } else {
            var majorColor = table.game.majorNumber;
            var aColor = 'A';
            if (table.game.majorColor) {
                if (!(table.game.majorColor == '♥' || table.game.majorColor == '♦')) {
                    majorColor = table.game.majorColor + table.game.majorNumber;
                } else {
                    majorColor = "<span style='color:red;'>" + table.game.majorColor + table.game.majorNumber + "</span>";
                }
            }
            if (table.game.aColor) {
                if (table.game.subMasterSid != null) {
                    aColor = "<span style='color:lightgray; text-decoration: line-through;'>" + table.game.aColor + 'A' + "</span>";
                } else {
                    if (!(table.game.aColor == '♥' || table.game.aColor == '♦')) {
                        aColor = table.game.aColor + 'A';
                    } else {
                        aColor = "<span style='color:red;'>" + table.game.aColor + 'A' + "</span>";
                    }
                }
            }
            $('#game-info').html("<i class='icon-star'></i>" + majorColor + "&nbsp;<i class='icon-star-empty'></i>" + aColor);
        }
    };

    this.drawCurrentTurn = function () {
        //目前只会画card,所以只remove了card
        this.div.children('.card').remove();
        if (!table.game)
            return;
        if (!table.game.currentTurn)
            return;
        switch (table.game.currentTurn.status) {
            case GameStatus.PLAY_CARDS:
                var len = table.game.currentTurn.done.length;
                for (var i = 0; i < len; i ++)
                    this.onNewCardsPlayed(table.game.currentTurn.done[i].cards,
                        (table.game.currentTurn.done[i].sid - table.agentSid + 5 ) % 5);
        }
    };

    this.updateSeat = function (sid) {
        var index = (sid - table.agentSid + 5) % 5;
        var seat = table.seats[sid];
        if (seat) {
            if (seat.status != AgentStatus.IN_GAME)
                $('#seat' + index).html(agentStatusToText(seat.status) + seat.user);
            else {
                var inGameStatus = '<i class="icon-group"></i>';
                if (table.game.masterSid == sid)
                    inGameStatus = '<i class="icon-star"></i>';
                else if (table.game.subMasterSid == sid)
                    inGameStatus = '<i class="icon-star-empty"></i>';
                $('#seat' + index).html(inGameStatus + seat.user + '&nbsp;' + table.game.points[sid]);
            }
        } else {
            $('#seat' + index).html('<i class="icon-circle-blank"></i>空座位');
        }

    };

    this.updateActiveSeat = function (sid) {
        if (sid == this.activeSeat)
            return;
        if (this.activeSeat != null) {
            var index = (this.activeSeat - table.agentSid + 5) % 5;
            $('#seat' + index).removeAttr('active-seat');
        }
        var index2 = (sid - table.agentSid + 5) % 5;
        $('#seat' + index2).attr('active-seat', true);
        this.activeSeat = sid;
    };

    /**
     *
     * @param cards
     * @param index 不是sid,是相对位置
     */
    this.onNewCardsPlayed = function (cards, index) {
        var len = cards.length;
        switch (index) {
            case 4:
                for (var i = 0; i < len; i ++)
                    drawCard(cards[i], i, cardWidthInTable, cardHeightInTable, this.div,
                        10 + cardHeightInTable, this.height - 30 - cardWidthInTable - (len - i - 1) * 15,
                        90, 0, 0, function () {});
                break;
            case 3:
                for (var i = 0; i < len; i ++)
                    drawCard(cards[i], i, cardWidthInTable, cardHeightInTable, this.div,
                        10 + i * 15, 30, 0, 0, 0, function () {});
                break;
            case 2:
                for (var i = 0; i < len; i ++)
                    drawCard(cards[i], i, cardWidthInTable, cardHeightInTable, this.div,
                        this.width - 10 - cardWidthInTable - (len - 1 - i) * 15, 30, 0, 0, 0,
                        function () {});
                break;
            case 1:
                for (var i = 0; i < len; i ++)
                    drawCard(cards[i], i, cardWidthInTable, cardHeightInTable, this.div,
                        this.width - 10 - cardHeightInTable, this.height - 30 - i * 15,
                        -90, 0, 0, function () {});
                break;
            case 0:
                for (var i = 0; i < len; i ++)
                    drawCard(cards[i], i, cardWidthInTable, cardHeightInTable, this.div,
                        (this.width - cardWidthInTable) / 2 + (i - (len - 1) / 2) * 15, this.height - cardHeightInTable - 30, 0, 0, 0,
                        function () {});
        }
    };
};

var OperationArea = function (targetDiv) {
    
    this.div = targetDiv;

    this.repaint = function () {

        this.div.empty();

        this.width = this.div.width();
        this.height = this.div.height();

        var status = table.getCurrentAgentStatus();

        switch (status) {
            case AgentStatus.PREPARED:
                this.preparedPane();
                break;
            case AgentStatus.UNPREPARED:
                this.unPreparedPane();
                break;
            case AgentStatus.IN_GAME:
                this.inGamePane();
                break;
        }
    };

    this.getAngle = function (index, total) {
        if (total == 1)
            return 0;
        return -30 + 60 * index / (total - 1);
    };

    this.preparedPane = function () {
        var unPrepareBtn = $("<a type='button' class='btn btn-default' id='unPrepareBtn'>取消</a>");
        unPrepareBtn
            .click(function () { socketClient.emitCommand(AgentCommandType.UnPrepare, null, wrappedAlert) })
            .appendTo(this.div);
        var leaveBtn = $("<a type='button' class='btn btn-default' id='leaveBtn'>离开</a>");
        leaveBtn
            .click(function () { socketClient.emitCommand(AgentCommandType.LeaveTable, null, wrappedAlert) })
            .appendTo(this.div);
    };

    this.unPreparedPane = function () {
        var prepareBtn = $("<a type='button' class='btn btn-default' id='prepareBtn'>准备</a>");
        prepareBtn
            .click(function () { socketClient.emitCommand(AgentCommandType.Prepare, null, wrappedAlert) })
            .appendTo(this.div);
        var leaveBtn = $("<a type='button' class='btn btn-default' id='leaveBtn'>离开</a>");
        leaveBtn
            .click(function () { socketClient.emitCommand(AgentCommandType.LeaveTable, null, wrappedAlert) })
            .appendTo(this.div);

    };

    this.inGamePane = function () {
        this.drawCardsInHand();
        this.drawControls();
    };

    //所有的控件必须带有control类,以便于统一删除
    this.drawControls = function () {
        this.div.children('.control').remove();
        if (table.game.currentTurn.remainedSid.length == 0) //说明只是在显示本轮最后信息,短暂延时后会显示新的轮次,因此不画控件
            return;
        if (table.game.currentTurn.remainedSid[0] == table.agentSid) {
            switch (table.game.currentTurn.status) {
                case GameStatus.OFFER_MAJOR_AMOUNT:
                    this.drawMajorAmountOptions();
                    break;
                case GameStatus.CHOOSE_MAJOR_COLOR:
                    this.drawMajorColorOptions();
                    break;
                case GameStatus.RESERVE_CARDS:
                    this.drawReserveCardsBtn();
                    break;
                case GameStatus.CHOOSE_A_COLOR:
                    this.drawAColorOptions();
                    break;
                case GameStatus.PLAY_CARDS:
                    this.drawPlayCardsBtn();
                    break;
            }
        }
    };

    this.drawMajorAmountOptions = function () {
        var options = $("<div class='options control' id='major-amount-options'>");
        for (var i = 0; i <= table.cardUtil.getAbsoluteMajorSum(table.game.cards); i ++) {
            $("<div class='option-block'>" + i + "</div>")
                .attr('major-amount-pick', i)
                .click(function () {
                    var newVal = $(this).attr('major-amount-pick');
                    if (table.majorAmountPicked != null) {
                        if (table.majorAmountPicked == newVal) {
                            table.majorAmountPicked = null;
                            $(this).removeClass('option-chosen');
                            return;
                        } else {
                            $('#major-amount-options').children('div[major-amount-pick = ' +
                                table.majorAmountPicked + ']').removeClass('option-chosen');
                        }
                    }
                    table.majorAmountPicked = newVal;
                    $(this).addClass('option-chosen');
                })
                .appendTo(options);
        }
        options.appendTo(this.div);

        var okBtn = $("<a type='button' class='btn btn-default control' id='okBtn'>确定</a>");
        okBtn
            .click(function () {
                var amount = table.majorAmountPicked;
                if (amount) {
                    socketClient.emitCommand(AgentCommandType.InGame, {
                        actionType: GameStatus.OFFER_MAJOR_AMOUNT,
                        actionContent: {amount: amount}
                    }, wrappedAlert)
                } else {
                    notify('请选择一个数字', 'error')
                }
            })
            .appendTo(this.div);
    };

    this.drawMajorColorOptions = function () {
        var colors = ['♥', '♠', '♦', '♣'];

        var options = $("<div class='options control' id='major-color-options'>");
        for (var i = 0; i < 4; i ++) {
            $("<div class='option-block'>" + colors[i] + "</div>")
                .attr('major-color-pick', colors[i])
                .css('color', (i % 2 == 0) ? 'red' : 'black')
                .click(function () {
                    var newVal = $(this).attr('major-color-pick');
                    if (table.majorColorPicked != null) {
                        if (table.majorColorPicked == newVal) {
                            table.majorColorPicked = null;
                            $(this).removeClass('option-chosen');
                            return;
                        } else {
                            $('#major-color-options').children('div[major-color-pick = \'' +
                                table.majorColorPicked + '\']').removeClass('option-chosen');
                        }
                    }
                    table.majorColorPicked = newVal;
                    $(this).addClass('option-chosen');
                })
                .appendTo(options);
        }
        options.appendTo(this.div);

        var okBtn = $("<a type='button' class='btn btn-default control' id='okBtn'>确定</a>");
        okBtn
            .click(function () {
                var color = table.majorColorPicked;
                if (color) {
                    socketClient.emitCommand(AgentCommandType.InGame, {
                        actionType: GameStatus.CHOOSE_MAJOR_COLOR,
                        actionContent: {color: color}
                    }, wrappedAlert)
                } else {
                    notify('请选择一个花色', 'error')
                }
            })
            .appendTo(this.div);
    };

    this.drawReserveCardsBtn = function () {
        var okBtn = $("<a type='button' class='btn btn-default control' id='okBtn'>埋底</a>");
        okBtn
            .click(function () {
                var cards = table.game.cards;
                var len = cards.length;
                var tmp = [];
                for (var i = 0; i < len; i ++) {
                    var card = cards[i];
                    if (card.status == 'chosen') {
                        tmp.push(card);
                    }
                }
                if (tmp.length != 7) {
                    notify('底牌数量不对呀', 'error');
                } else {
                    table.game.reservedCards = tmp;
                    socketClient.emitCommand(AgentCommandType.InGame, {
                        actionType: GameStatus.RESERVE_CARDS,
                        actionContent: {cards: tmp}
                    }, wrappedAlert)
                }
            })
            .appendTo(this.div);
    };

    this.drawAColorOptions = function () {
        var colors = ['♥', '♠', '♦', '♣'];

        var options = $("<div class='options control' id='a-color-options'>");
        for (var i = 0; i < 4; i ++) {
            $("<div class='option-block'>" + colors[i] + "</div>")
                .attr('a-color-pick', colors[i])
                .css('color', (i % 2 == 0) ? 'red' : 'black')
                .click(function () {
                    var newVal = $(this).attr('a-color-pick');
                    if (table.aColorPicked != null) {
                        if (table.aColorPicked == newVal) {
                            table.aColorPicked = null;
                            $(this).removeClass('option-chosen');
                            return;
                        } else {
                            $('#a-color-options').children('div[a-color-pick = \'' +
                                table.aColorPicked + '\']').removeClass('option-chosen');
                        }
                    }
                    table.aColorPicked = newVal;
                    $(this).addClass('option-chosen');
                })
                .appendTo(options);
        }
        options.appendTo(this.div);

        var okBtn = $("<a type='button' class='btn btn-default control' id='okBtn'>确定</a>");
        okBtn
            .click(function () {
                var color = table.aColorPicked;
                if (color) {
                    socketClient.emitCommand(AgentCommandType.InGame, {
                        actionType: GameStatus.CHOOSE_A_COLOR,
                        actionContent: {color: color}
                    }, wrappedAlert)
                } else {
                    notify('请选择一个花色', 'error')
                }
            })
            .appendTo(this.div);
    };

    this.drawPlayCardsBtn = function () {
        var okBtn = $("<a type='button' class='btn btn-default control' id='okBtn'>出牌</a>");
        okBtn
            .click(function () {
                var cards = table.game.cards;
                var len = cards.length;
                var tmp = [];
                for (var i = 0; i < len; i ++) {
                    var card = cards[i];
                    if (card.status == 'chosen') {
                        tmp.push(card);
                    }
                }
                if (tmp.length == 0) {
                    notify('请选择至少一张牌', 'error');
                } else {
                    table.playedCardsPicked = tmp;
                    socketClient.emitCommand(AgentCommandType.InGame, {
                        actionType: GameStatus.PLAY_CARDS,
                        actionContent: {cards: tmp}
                    }, wrappedAlert)
                }
            })
            .appendTo(this.div);
    };

    /**
     * 重新画牌:
     * 1.清空画布
     * 2.计算绘画用的一些变量
     * 3.绘画并设置id(绑定model)
     * width = (2sqr(3)+3)/4 * X + R(R=ry-X3/4)
     */
    this.drawCardsInHand = function () {

        var cards = table.game.cards;


        var param1 = {
            centerX: (this.width - cardWidth) / 2,
            centerY: this.height - cardHeight * 1.5 + 5,
            rotateX: cardWidth / 2,
            rotateY: this.width - cardWidth * 0.866
        };
        var param2 = {
            centerX: param1.centerX,
            centerY: param1.centerY + cardHeight / 2,
            rotateX: param1.rotateX,
            rotateY: param1.rotateY - cardHeight / 2
        };
        var cardLine1, cardLine2 = null;
        var singleLine = true;
        if (cards.length > MinOneLineCardAmount) {
            var len1 = parseInt(cards.length * 0.55);
            cardLine1 = cards.slice(0, len1);
            cardLine2 = cards.slice(len1);
            singleLine = false;
        } else {
            cardLine1 = cards;
            param1.centerY += cardHeight * 0.25;
        }

        var _this = this;
        var len = cardLine1.length;
        for (var i = 0; i < len; i ++)
            drawCard(cardLine1[i], i, cardWidth, cardHeight, this.div,
                param1.centerX, param1.centerY, this.getAngle(i, len),
                param1.rotateX, param1.rotateY, function () { _this.onCardChosen($(this)) });
        if (!singleLine) {
            var len2 = cardLine2.length;
            for (var i2 = 0; i2 < len2; i2 ++)
                drawCard(cardLine2[i2], (len + i2), cardWidth, cardHeight, this.div,
                    param2.centerX, param2.centerY, this.getAngle(i2, len2),
                    param2.rotateX, param2.rotateY, function () { _this.onCardChosen($(this)) });
        }
    };

    /**
     * 调整手牌,并播放动画
     */
    this.adjustCards = function () {
        var cards = table.game.cards;

        var param1 = {
            centerX: (this.width - cardWidth) / 2,
            centerY: this.height - cardHeight * 1.5 + 5,
            rotateX: cardWidth / 2,
            rotateY: this.width - cardWidth * 0.866
        };
        var param2 = {
            centerX: param1.centerX,
            centerY: param1.centerY + cardHeight / 2,
            rotateX: param1.rotateX,
            rotateY: param1.rotateY - cardHeight / 2
        };
        var cardLine1, cardLine2 = null;
        var singleLine = true;
        if (cards.length > MinOneLineCardAmount) {
            var len1 = parseInt(cards.length * 0.55);
            cardLine1 = cards.slice(0, len1);
            cardLine2 = cards.slice(len1);
            singleLine = false;
        } else {
            cardLine1 = cards;
            param1.centerY += cardHeight * 0.25;
        }
        var len = cardLine1.length;
        for (var i = 0; i < len; i ++) {
            cardLine1[i].status = 'inHand';
            updateCard(cardLine1[i], i,
                param1.centerX, param1.centerY, this.getAngle(i, len),
                param1.rotateX, param1.rotateY, '-webkit-transform .5s ease');
        }
        if (!singleLine) {
            var len2 = cardLine2.length;
            for (var i2 = 0; i2 < len2; i2 ++) {
                cardLine2[i2].status = 'inHand';
                updateCard(cardLine2[i2], (len + i2),
                    param2.centerX, param2.centerY, this.getAngle(i2, len2),
                    param2.rotateX, param2.rotateY, '-webkit-transform .5s ease');
            }
        }
    };

    this.resortCards = function () {
        var cards = table.game.cards;
        var len = cards.length;
        var endCount = len;
        var _this = this;

        if (!$("#operation-area").hasClass("active")) {
            //如果不是active的pane,动画会无法播放,因此要直接画出来
            this.drawCardsInHand();
            return;
        }
        for (var i = 0; i < len; i ++) {
            if (!cards[i].view) {
                endCount --;
                continue;
            }
            setAnimation(cards[i].view, ' translateY(' + 2 * cardHeight + 'px)', '-webkit-transform 1s ease',
                function () {
                    if (-- endCount == 0) {
                        var cx = (_this.width - cardWidth) / 2;
                        for (var i = 0; i < len; i ++) {
                            if (cards[i].view) {
                                cards[i].view.removeAttr('animating');
                                cards[i].view.remove();
                            }
                            drawCard(cards[i], 'ih_' + i, cardWidth, cardHeight, _this.div,
                                cx, 2 * cardHeight + 40, 0, 0, 0, function () {
                                    _this.onCardChosen($(this))
                                });
                        }
                        setTimeout(function() {_this.adjustCards()}, 500);
                    }
                });
        }
    };

    this.onCardChosen = function (card) {
        var cards = table.game.cards;
        var inHandIndex = parseInt(card.attr('index'));
        var card_model = cards[inHandIndex];
        if (typeof(card.attr('animating')) != "undefined")
            return;
        var newly = card.css('transform');

        if (card.attr('status') != 'chosen') {
            newly += ' translateY(-10px)';
            card
                .attr('animating', true)
                .attr('status', 'chosen');
            card_model.status = 'chosen';
        } else {
            newly += ' translateY(10px)';
            card
                .attr('animating', true)
                .attr('status', 'inHand');
            card_model.status = 'inHand';
        }
        setAnimation(card, newly, '-webkit-transform .2s ease', function () {
            card.removeAttr('animating')
        });
    };

    this.onCardOut = function (cardDiv) {
        cardDiv
            .attr('animating', true)
            .attr('status', 'played');
        setAnimation(cardDiv, ' translateY(' + (-2 * cardHeight - 40) + 'px)', '-webkit-transform 1s ease', function () { cardDiv.remove() });
    };

    this.moveOutCards = function (cards) {
        if (!cards)
            return;
        var len = cards.length;
        for (var i = 0; i < len; i ++) {
            this.onCardOut(cards[i].view);
            cards[i].view = null;
        }
        this.adjustCards();
    };

};

var UI = function () {

    cardWidth = 60;
    cardHeight = cardWidth * 1.5;

    this.operationArea = new OperationArea($('#operation-area'));
    this.tableArea = new TableArea($('#table-area'));

    this.resize = function () {
        var windowHeight = $(document.body).height();
        var windowWidth = $(document.body).width();
        var margin_left = 0;

        if (windowWidth > windowHeight * 0.75) {
            margin_left = (windowWidth - windowHeight * 0.75) / 2;
            windowWidth = windowHeight * 0.75;
        }

        cardWidth = windowWidth / 7;
        cardHeight = cardWidth * 1.5;

        this.operationAreaProperty = {
            width: windowWidth - 20,
            height: cardHeight * 1.5 + 40
        };

        $('#operation-area')
            .css('width', this.operationAreaProperty.width + 'px')
            .css('height', this.operationAreaProperty.height + 'px');
        $('#history-area')
            .css('width', this.operationAreaProperty.width + 'px')
            .css('height', this.operationAreaProperty.height + 'px');
        $('#chat-area')
            .css('width', this.operationAreaProperty.width + 'px')
            .css('height', this.operationAreaProperty.height + 'px');
        var bottom_area = $('#bottom-area')
            .css('width', windowWidth + 'px')
            .css('margin-left', margin_left + 'px');
        this.tableProperty = {
            width: windowWidth - 20,
            height: windowHeight - bottom_area.height() - 30
        };

        cardHeightInTable = this.tableProperty.height / 2 - 70;
        cardWidthInTable = this.tableProperty.width / 4 - 40;
        if (cardHeightInTable > cardWidthInTable * 1.5)
            cardHeightInTable = cardWidthInTable * 1.5;
        else
            cardWidthInTable = cardHeightInTable / 1.5;

        $('#table-area')
            .css('width', this.tableProperty.width + 'px')
            .css('height', this.tableProperty.height + 'px')
            .css('left', margin_left + 'px');
    };

    this.repaint = function () {
        this.resize();
        this.operationArea.repaint();
        this.tableArea.repaint();
    };

    this.logEvent = function (event) {
        var txt = '[' + event.username + ']';
        switch (event.type) {
            case AgentCommandType.Disconnect:
                txt += '掉线了';
                break;
            case AgentCommandType.IntoTable:
                txt += '加入了' + event.sid + '号座位';
                break;
            case AgentCommandType.Prepare:
                txt += '准备好了';
                break;
            case AgentCommandType.UnPrepare:
                txt += '取消了准备';
                break;
            case AgentCommandType.LeaveTable:
                txt += '离开了' + event.sid + '号座位';
                break;
            case AgentCommandType.InGame:
                switch (event.content.actionType) {
                    case GameStatus.OFFER_MAJOR_AMOUNT:
                        txt += '称有' + event.content.amount + '张真主';
                        break;
                    case GameStatus.CHOOSE_MAJOR_COLOR:
                        txt += '选择了' + cardColorWithColor(event.content.color) + '作为主花色';
                        break;
                    case GameStatus.RESERVE_CARDS:
                        txt += '完成了埋底';
                        break;
                    case GameStatus.CHOOSE_A_COLOR:
                        txt += '选择了' + cardColorWithColor(event.content.color) + '为A的花色';
                        break;
                    case GameStatus.PLAY_CARDS:
                        if (event.content.partRejected)
                            txt += '甩牌失败,';
                        txt += '打出了:[';
                        var len = event.content.cards.length;
                        for (var i = 0; i < len; i ++) {
                            if (isBlack(event.content.cards[i]))
                                txt += cardToText(event.content.cards[i], '');
                            else
                                txt += "<span style='color:red;'>" + cardToText(event.content.cards[i], '') + "</span>";
                        }
                        txt += ']';
                        break;
                }
                break;
        }
        $('<div>')
            .html(txt)
            .appendTo($('#history-area'));
    };

    this.showResult = function (result) {
        this.logSystemEvent('游戏结束');
        $('#game-result-modal-header')
            .empty()
            .append('<h3>' + result.winners + '胜,升级数:' + result.levelUp + '</h3>');
        var body = $('#game-result-modal-body')
            .empty()
            .append('<p>闲家得分:&nbsp;' + result.slavePoints + '</p>')
            .append('<p>底牌:</p>');
        var div = $('<div>')
            .css('position', 'relative')
            .css('height', cardHeight);
        var len = result.reservedCards.length;
        for (var i = 0; i < len; i ++)
            drawCard(result.reservedCards[i], i, cardWidth, cardHeight, div,
                10 + 15 * i, 0, 0, 0, 0, function () {});
        div.appendTo(body);
        $('#game-result')
            .on('hidden.bs.modal', function () {
                reSync();
            })
            .modal();
    };

    this.logSystemEvent = function (txt) {
        $('<div>')
            .css('color', 'blue')
            .html(txt)
            .appendTo($('#history-area'));
        notify(txt, 'alert');
    };

    this.onIntoTable = function (event) {
        this.tableArea.updateSeat(event.sid);
        this.logEvent(event);
    };

    this.onPrepare = function (event) {
        var sid = event.sid;
        this.tableArea.updateSeat(sid);
        if (sid == table.agentSid)
            this.operationArea.repaint();
        this.logEvent(event);

    };

    this.onPrepareAndGameStart = function (event) {
        this.repaint();
        this.logEvent(event);
        this.logSystemEvent('游戏开始');
        this.logSystemEvent('[' + table.seats[table.game.currentTurn.startSid].user + ']先报真主数');
    };

    this.onUnPrepare = function (event) {
        var sid = event.sid;
        this.tableArea.updateSeat(sid);
        if (sid == table.agentSid)
            this.operationArea.repaint();
        this.logEvent(event);
    };

    this.onLeaveTable = function (event) {
        var sid = event.sid;
        if (sid == table.agentSid)
            location.href = '/tables';
        else {
            this.tableArea.updateSeat(sid);
            this.tableArea.updateGameInfo();
            this.logEvent(event);
        }
    };

    this.onOfferMajorAmount = function(event) {
        this.operationArea.drawControls();
        this.tableArea.updateActiveSeat(table.game.currentTurn.remainedSid[0]);
        this.logEvent(event);
    };

    this.onChooseMajorColor = function(event) {
        this.operationArea.drawControls();
        this.tableArea.updateGameInfo();
        this.tableArea.updateActiveSeat(table.game.currentTurn.remainedSid[0]);
        this.operationArea.resortCards();
        this.logEvent(event);
    };

    this.onReserveCards = function(event) {
        this.operationArea.drawControls();
        this.tableArea.updateActiveSeat(table.game.currentTurn.remainedSid[0]);
        this.operationArea.moveOutCards(table.game.reservedCards);
        this.logEvent(event);
    };

    this.onChooseAColor = function(event) {
        this.operationArea.drawControls();
        this.tableArea.updateGameInfo();
        this.tableArea.updateActiveSeat(table.game.currentTurn.remainedSid[0]);
        this.logEvent(event);
    };

    this.onPlayCards = function (event) {

        this.operationArea.drawControls();
        this.tableArea.onNewCardsPlayed(event.content.cards, (event.sid - table.agentSid + 5) % 5);
        this.tableArea.updateActiveSeat(table.game.currentTurn.remainedSid[0]);
        if (event.sid == table.agentSid)
            this.operationArea.moveOutCards(table.playedCardsPicked);
        this.logEvent(event);
        if (event.content.subMasterSid != null) {
            this.tableArea.updateSeat(event.content.subMasterSid);
            this.tableArea.updateGameInfo();
            this.logSystemEvent('[' + table.seats[event.content.subMasterSid].user + ']成为了副庄');
        }
    };

    this.drawNextTurn = function (event, newStatus, extraUpdated) {
        this.operationArea.drawControls();
        this.tableArea.updateActiveSeat(table.game.currentTurn.remainedSid[0]);
        var txt = '[' + table.seats[table.game.currentTurn.startSid].user + ']';
        switch (newStatus) {
            case GameStatus.CHOOSE_MAJOR_COLOR:
                if (extraUpdated.masterSid != null) {
                    this.tableArea.updateSeat(extraUpdated.masterSid);
                    this.logSystemEvent(txt + '成为了庄家');
                }
                this.logSystemEvent(txt + '正在选择主花色');
                break;
            case GameStatus.RESERVE_CARDS:
                this.logSystemEvent(txt + '正在埋底牌');
                break;
            case GameStatus.CHOOSE_A_COLOR:
                this.logSystemEvent(txt + '正在选择A的花色');
                break;
            case GameStatus.PLAY_CARDS:
                this.logSystemEvent(txt + '本轮先出牌');
                for (var i = 0; i < 5; i ++)
                    this.tableArea.updateSeat(i);
                if (table.lastTurn) {
                    switch (table.lastTurn.status) {
                        case GameStatus.PLAY_CARDS:
                            var len = table.lastTurn.done.length;
                            for (var j = 0; j < len; j ++) {
                                var cards = table.lastTurn.done[j].cards;
                                var len2 = cards.length;
                                for (var k = 0; k < len2; k ++) {
                                    cards[k].view.remove();
                                    cards[k].view = null;
                                }
                            }
                    }
                }
                break;
        }
    };
};