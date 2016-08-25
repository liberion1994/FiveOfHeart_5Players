/**
 * Created by liboyuan on 16/8/18.
 */

$(document).ready(function () {

    var res = {
        agentSid: 0,

        id: 10,
        seats: new Array(5),
        currentEventId: 0,
        masterInGame: null,
        game: {
            majorNumber: 2
        }
    };

    table = new Table(res);

    table.seats[0] = {
        user : '123',
        status : AgentStatus.IN_GAME
    };

    table.game.currentTurn = {
        remainedSid: []
    };
    table.game.cards = [
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
        { number: 2, color: '♣', type: 0 },
        { number: 1, color: 'J', type: 6 }
    ];

    ui = new UI();
    ui.resize();


    ui.operationArea.repaint();
    setTimeout(function () {
        notify('123456', 'error');
        for (var i = 0; i < 7; i ++)
            table.game.cards.push({ number: 8, color: '♦', type: 0 });
        table.cardUtil = new CardUtil(table.game.majorNumber);
        table.cardUtil.majorColor = '♦';
        table.game.cards = table.cardUtil.getSortedCards(table.game.cards);
        ui.operationArea.resortCards();
        setTimeout(function () {
            table.game.reservedCards = [];
            for (var j = 0; j < 7; j ++) {
                table.game.reservedCards.push(table.game.cards[2 * j]);
            }
            table.cardUtil.popCards(table.game.cards, table.game.reservedCards);
            ui.operationArea.moveOutCards(table.game.reservedCards);
        }, 2500);
    }, 1000);

    bootstrapInit();



    $(window).resize(function () {
        ui.repaint();
    });
});
