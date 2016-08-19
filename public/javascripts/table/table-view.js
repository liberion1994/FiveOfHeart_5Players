/**
 * 绘制ui界面
 * 目前暂时不考虑横屏的情况
 * Created by liboyuan on 16/8/13.
 */


/**
 * 假设最大张开到30度,则根据计算总共多出0.6倍宽度
 */

var CARDS_IN_HAND = [
    { number: 1, color: 'J', type: 6 },
    { number: 1, color: 'J', type: 6 },
    { number: 0, color: 'J', type: 6 },
    { number: 3, color: '♥', type: 5 },
    { number: 3, color: '♥', type: 5 },
    { number: 3, color: '♦', type: 4 },
    { number: 3, color: '♦', type: 4 },
    { number: 7, color: '♥', type: 3 },
    { number: 7, color: '♥', type: 3 },
    { number: 7, color: '♠', type: 2 },
    { number: 7, color: '♦', type: 2 },
    { number: 12, color: '♥', type: 1 },
    { number: 11, color: '♥', type: 1 },
    { number: 8, color: '♥', type: 1 },
    { number: 6, color: '♥', type: 1 },
    { number: 2, color: '♥', type: 1 },
    { number: 10, color: '♠', type: 0 },
    { number: 8, color: '♠', type: 0 },
    { number: 4, color: '♠', type: 0 },
    { number: 3, color: '♠', type: 0 },
    { number: 14, color: '♦', type: 0 },
    { number: 8, color: '♦', type: 0 },
    { number: 5, color: '♦', type: 0 },
    { number: 9, color: '♣', type: 0 },
    { number: 8, color: '♣', type: 0 },
    { number: 6, color: '♣', type: 0 },
    { number: 5, color: '♣', type: 0 },
    { number: 5, color: '♣', type: 0 },
    { number: 3, color: '♣', type: 0 },
    { number: 3, color: '♣', type: 0 },
    { number: 2, color: '♣', type: 0 }
];


var CARDS_PLAYED = [
    { number: 5, color: '♣', type: 0, from: 0, turnLeft: 0 },
    { number: 3, color: '♣', type: 0, from: 0, turnLeft: 0 },
    { number: 3, color: '♣', type: 0, from: 0, turnLeft: 0 },
    { number: 2, color: '♣', type: 0, from: 0, turnLeft: 0 }
];

var SeatType = {
    TBD: 0,
    Master: 1,
    SubMaster: 2,
    Slave: 3
};

var seats = [
    { id: 1, type: 0, fromMine: 0, active: true },
    { id: 2, type: 1, fromMine: 1, active: false },
    { id: 3, type: 2, fromMine: 2, active: false },
    { id: 4, type: 3, fromMine: 3, active: false },
    { id: 5, type: 3, fromMine: 4, active: false }
];

var cardWidth = 60;
var cardHeight = cardWidth * 1.5;

var MinOneLineCardAmount = 13;

var TableArea = function (targetDiv) {
    this.div = targetDiv;
    this.cardsPlayed = CARDS_PLAYED;
    this.onResize = function () {

        this.width = this.div.width();
        this.height = this.div.height();
        this.drawCardsOnTable();
    };

    this.drawCardsOnTable = function () {
        var len = this.cardsPlayed.length;
        for (var i = 0; i < len; i ++)
            drawCard(this.cardsPlayed[i], 'ip_' + i, cardWidth, cardHeight, this.div,
                30 + i * 15, 30, 0, 0, 0, function () {});
    };

    this.onNewCardsPlayed = function (cards) {

    };
};

var InHandCardsArea = function (cards, targetDiv) {
    
    this.div = targetDiv;
    this.cards = cards;

    this.onResize = function () {

        this.width = this.div.width();
        this.height = this.div.height();

        this.drawCardsInHand();
    };

    this.getAngle = function (index, total) {
        if (total == 1)
            return 0;
        return -30 + 60 * index / (total - 1);
    };

    /**
     * 重新画牌:
     * 1.清空画布
     * 2.计算绘画用的一些变量
     * 3.绘画并设置id(绑定model)
     * width = (2sqr(3)+3)/4 * X + R(R=ry-X3/4)
     */
    this.drawCardsInHand = function () {

        this.div.children().remove('.card');

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
        if (this.cards.length > MinOneLineCardAmount) {
            var len1 = parseInt(this.cards.length * 0.55);
            cardLine1 = this.cards.slice(0, len1);
            cardLine2 = this.cards.slice(len1);
            singleLine = false;
        } else {
            cardLine1 = this.cards;
            param1.centerY += cardHeight * 0.25;
        }

        var _this = this;
        var len = cardLine1.length;
        for (var i = 0; i < len; i ++)
            drawCard(cardLine1[i], 'ih_' + i, cardWidth, cardHeight, this.div,
                param1.centerX, param1.centerY, this.getAngle(i, len),
                param1.rotateX, param1.rotateY, function () { _this.onCardChosen($(this)) });
        if (!singleLine) {
            var len2 = cardLine2.length;
            for (var i2 = 0; i2 < len2; i2 ++)
                drawCard(cardLine2[i2], 'ih_' + (len + i2), cardWidth, cardHeight, this.div,
                    param2.centerX, param2.centerY, this.getAngle(i2, len2),
                    param2.rotateX, param2.rotateY, function () { _this.onCardChosen($(this)) });
        }
    };

    /**
     * 更新手牌,并播放动画
     */
    this.updateCards = function () {
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
        if (this.cards.length > MinOneLineCardAmount) {
            var len1 = parseInt(this.cards.length * 0.55);
            cardLine1 = this.cards.slice(0, len1);
            cardLine2 = this.cards.slice(len1);
            singleLine = false;
        } else {
            cardLine1 = this.cards;
            param1.centerY += cardHeight * 0.25;
        }

        var len = cardLine1.length;
        for (var i = 0; i < len; i ++)
            updateCard(cardLine1[i].view, 'ih_' + i,
                param1.centerX, param1.centerY, this.getAngle(i, len),
                param1.rotateX, param1.rotateY, '-webkit-transform .5s ease')
        if (!singleLine) {
            var len2 = cardLine2.length;
            for (var i2 = 0; i2 < len2; i2 ++)
                updateCard(cardLine2[i2].view, 'ih_' + (len + i2),
                    param2.centerX, param2.centerY, this.getAngle(i2, len2),
                    param2.rotateX, param2.rotateY, '-webkit-transform .5s ease');
        }
    };

    this.onCardChosen = function (card) {
        if (typeof(card.attr('animating')) != "undefined")
            return;
        var newly = card.css('transform');
        var inHandIndex = parseInt(card.attr('id').split('_')[1]);
        if (card.attr('status') != 'chosen') {
            newly += ' translateY(-10px)';
            card
                .attr('animating', true)
                .attr('status', 'chosen');
            this.cards[inHandIndex].status = 'chosen';
        } else {
            newly += ' translateY(10px)';
            card
                .attr('animating', true)
                .attr('status', 'inHand');
            this.cards[inHandIndex].status = 'inHand';
        }
        setAnimation(card, newly, '-webkit-transform .2s ease', function () {
            card.removeAttr('animating')
        });
    };

    this.onCardOut = function (card) {
        card
            .attr('animating', true)
            .attr('status', 'played');
        setAnimation(card, ' translateY(-150px)', '-webkit-transform 1s ease', function () {
            card.remove()
        });
    };

    this.onPlayCards = function () {
        var len = this.cards.length;
        for (var i = 0; i < len; i ++) {
            var card = this.cards[i];
            if (card.status == 'chosen') {
                this.onCardOut(this.cards[i].view);
                this.cards.splice(i, 1);
                i --; len --;
            }
        }
        //TODO 重新整理牌(选出view,将view动画移动而非重新创建view)
        this.updateCards();
    };

};

var UI = function () {

    this.minFontSize = 8;
    this.seatInfoWidth = 30;
    this.seatInfoHeight = 10;

    cardWidth = 60;
    cardHeight = cardWidth * 1.5;

    this.inHandCardsArea = new InHandCardsArea(CARDS_IN_HAND, $('#cardsInHand'));
    this.tableArea = new TableArea($('#table'));


    this.onIntoTable = function () {

    };

    this.onResize = function () {
        var windowHeight = $(document.body).height();
        var windowWidth = $(document.body).width();
        this.cardsInHandProperty = {
            width: windowWidth - 20,
            height: cardHeight * 1.5 + 40
        };
        $('#cardsInHand')
            .css('width', this.cardsInHandProperty.width + 'px')
            .css('height', this.cardsInHandProperty.height + 'px');
        this.tableProperty = {
            width: windowWidth - 20,
            height: windowHeight - $('#bottom-area').height() - 30
        };
        $('#table')
            .css('width', this.tableProperty.width + 'px')
            .css('height', this.tableProperty.height + 'px');
        this.inHandCardsArea.onResize();
        this.tableArea.onResize();
    };

    this.displayEvent = function (event) {
        var txt = event.eid + ': ' + event.username;
        switch (event.type) {
            case AgentCommandType.Disconnect:
                txt += '掉线了';
                break;
            case AgentCommandType.IntoTable:
                txt += '进入了' + event.sid + '号座位';
                break;
            case AgentCommandType.Prepare:
                txt += '准备好了';
                break;
            case AgentCommandType.UnPrepare:
                txt += '取消了准备';
                break;
            case AgentCommandType.LeaveTable:
                txt += '离开了座位';
                break;
        }
        var paragraph = $('<div>')
            .html(txt);
        paragraph.appendTo($('#history'));
    };
};