/**
 * Created by liboyuan on 16/8/8.
 */

require('should');
var CardUtil = require('../models/cardUtil');

var cardUtil = new CardUtil.CardUtil(7);

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

var STRUCTURE = {
    'M': [
        {
            type: 'single',
            multi: 2,
            content: [{number: 1, color: 'J', type: 6}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 0, color: 'J', type: 6}]
        }
        ,
        {
            type: 'tractor',
            multi: 2,
            content: [{number: 3, color: '♥', type: 5},
                {number: 3, color: '♦', type: 4},
                {number: 7, color: '♥', type: 3}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 7, color: '♠', type: 2}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 7, color: '♦', type: 2}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 12, color: '♥', type: 1}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 11, color: '♥', type: 1}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 8, color: '♥', type: 1}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 6, color: '♥', type: 1}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 2, color: '♥', type: 1}]
        }
    ]
    ,
    '♠': [
        {
            type: 'single',
            multi: 1,
            content: [{number: 10, color: '♠', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 8, color: '♠', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 4, color: '♠', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 3, color: '♠', type: 0}]
        }
    ]
    ,
    '♦': [
        {
            type: 'single',
            multi: 1,
            content: [{number: 14, color: '♦', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 8, color: '♦', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 5, color: '♦', type: 0}]
        }
    ]
    ,
    '♣': [
        {
            type: 'single',
            multi: 1,
            content: [{number: 9, color: '♣', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 8, color: '♣', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 6, color: '♣', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 2,
            content: [{number: 5, color: '♣', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 2,
            content: [{number: 3, color: '♣', type: 0}]
        }
        ,
        {
            type: 'single',
            multi: 1,
            content: [{number: 2, color: '♣', type: 0}]
        }
    ]
};

var STRUCTURE_WITHOUT_TRACTOR = {
    'M': [
        { multi: 2, content: { number: 1, color: 'J', type: 6 } }
        ,
        { multi: 1, content: { number: 0, color: 'J', type: 6 } }
        ,
        { multi: 2, content: { number: 3, color: '♥', type: 5 } }
        ,
        { multi: 2, content: { number: 3, color: '♦', type: 4 } }
        ,
        { multi: 2, content: { number: 7, color: '♥', type: 3 } }
        ,
        { multi: 1, content: { number: 7, color: '♠', type: 2 } }
        ,
        { multi: 1, content: { number: 7, color: '♦', type: 2 } }
        ,
        { multi: 1, content: { number: 12, color: '♥', type: 1 } }
        ,
        { multi: 1, content: { number: 11, color: '♥', type: 1 } }
        ,
        { multi: 1, content: { number: 8, color: '♥', type: 1 } }
        ,
        { multi: 1, content: { number: 6, color: '♥', type: 1 } }
        ,
        { multi: 1, content: { number: 2, color: '♥', type: 1 } }
    ]
    ,
    '♠': [
        { multi: 1, content: { number: 10, color: '♠', type: 0 } }
        ,
        { multi: 1, content: { number: 8, color: '♠', type: 0 } }
        ,
        { multi: 1, content: { number: 4, color: '♠', type: 0 } }
        ,
        { multi: 1, content: { number: 3, color: '♠', type: 0 } }
    ]
    ,
    '♦': [
        { multi: 1, content: { number: 14, color: '♦', type: 0 } }
        ,
        { multi: 1, content: { number: 8, color: '♦', type: 0 } }
        ,
        { multi: 1, content: { number: 5, color: '♦', type: 0 } }
    ]
    ,
    '♣': [
        { multi: 1, content: { number: 9, color: '♣', type: 0 } }
        ,
        { multi: 1, content: { number: 8, color: '♣', type: 0 } }
        ,
        { multi: 1, content: { number: 6, color: '♣', type: 0 } }
        ,
        { multi: 2, content: { number: 5, color: '♣', type: 0 } }
        ,
        { multi: 2, content: { number: 3, color: '♣', type: 0 } }
        ,
        { multi: 1, content: { number: 2, color: '♣', type: 0 } }
    ]
};

function traversalStructure(structure) {
    console.log('{');
    var first1 = true;
    for (var type in structure) {
        if (!first1) {
            console.log(',');
        } else {
            first1 = false;
        }
        console.log('\'' + type + '\': [');
        var first = true;
        for (var struc in structure[type]) {
            if (!first) {
                console.log(',');
            } else {
                first = false;
            }
            console.log(structure[type][struc]);
        }
        console.log(']');
    }
    console.log('}');
}

/**
 *
 */
describe("Card Equal", function() {
    var heart7 = {number: 7, color: '♥'},
        heart7_2 = {number: 7, color: '♥'};
    it("The same number and color should be equal cards", function() {
        cardUtil.cardEqual(heart7, heart7_2).should.eql(true);
    });
});


/**
 *
 */
describe("Card Type", function() {
    var subJoker = {number: 0, color: 'J'},
        three = {number: 3, color: '♥'},
        heart7 = {number: 7, color: '♥'};
    it("The subJoker should be Joker", function() {
        cardUtil.getCardType(subJoker).should.eql(CardUtil.CARD_TYPES.Joker);
    });
    it("♥3 should be Others before majorColor confirmed", function() {
        cardUtil.majorColor = null;
        cardUtil.getCardType(three).should.eql(CardUtil.CARD_TYPES.Others);
    });
    it("♥3 should be Three : ♥7", function() {
        cardUtil.majorColor = '♥';
        cardUtil.getCardType(three).should.eql(CardUtil.CARD_TYPES.Three);
    });
    it("♥7 should be SubMajorNum before majorColor confirmed", function() {
        cardUtil.majorColor = null;
        cardUtil.getCardType(heart7).should.eql(CardUtil.CARD_TYPES.SubMajorNum);
    });
    it("♥7 should be major MajorNum : ♥7", function() {
        cardUtil.majorColor = '♥';
        cardUtil.getCardType(heart7).should.eql(CardUtil.CARD_TYPES.MajorNum);
    });

});

/**
 *
 */
describe("Card Desc", function() {
    it("♥7 should be larger then ♦7 : ♥7", function() {
        var heart7 = {number: 7, color: '♥', type: 3},
            diamond7 = {number: 7, color: '♦', type: 2};
        cardUtil.majorColor = '♥';
        cardUtil.cardDesc(heart7, diamond7).should.below(0);
    });
    it("♦7 should be larger then ♥4 : ♥7", function() {
        var diamond7 = {number: 7, color: '♦', type: 2},
            heart4 = {number: 4, color: '♥', type: 1};
        cardUtil.majorColor = '♥';
        cardUtil.cardDesc(diamond7, heart4).should.below(0);
    });
});

/**
 *
 */
describe("Card Color", function() {
    it("♥7 should be same color as ♦7 : ♥7", function() {
        var heart7 = {number: 7, color: '♥', type: 3},
            diamond7 = {number: 7, color: '♦', type: 2};
        cardUtil.majorColor = '♥';
        cardUtil.sameColorWith(heart7.color, diamond7.color).should.eql(true);
    });
});

/**
 *
 */
describe("Sorting", function() {
    it("Major Color Only : ♥7", function() {
        var cards = [
            {number: 7, color: '♦'},
            {number: 6, color: '♥'},
            {number: 10, color: '♥'},
            {number: 13, color: '♥'},
            {number: 12, color: '♥'},
            {number: 5, color: '♥'},
            {number: 5, color: '♥'},
            {number: 1, color: 'J'},
            {number: 3, color: '♦'},
            {number: 3, color: '♥'}
        ];
        var sorted = [
            {number: 5, color: '♥', type: CardUtil.CARD_TYPES.RedFive},
            {number: 5, color: '♥', type: CardUtil.CARD_TYPES.RedFive},
            {number: 1, color: 'J', type: CardUtil.CARD_TYPES.Joker},
            {number: 3, color: '♥', type: CardUtil.CARD_TYPES.Three},
            {number: 3, color: '♦', type: CardUtil.CARD_TYPES.SubThree},
            {number: 7, color: '♦', type: CardUtil.CARD_TYPES.SubMajorNum},
            {number: 13, color: '♥', type: CardUtil.CARD_TYPES.NormalMajor},
            {number: 12, color: '♥', type: CardUtil.CARD_TYPES.NormalMajor},
            {number: 10, color: '♥', type: CardUtil.CARD_TYPES.NormalMajor},
            {number: 6, color: '♥', type: CardUtil.CARD_TYPES.NormalMajor}
        ];
        cardUtil.majorColor = '♥';
        cardUtil.getSortedCards(cards).should.eql(sorted);
    });
    it("All Color : ♥7", function() {
        var cards = [
            {number: 7, color: '♦'},
            {number: 6, color: '♥'},
            {number: 10, color: '♥'},
            {number: 13, color: '♠'},
            {number: 12, color: '♣'},
            {number: 3, color: '♠'},
            {number: 5, color: '♦'},
            {number: 5, color: '♥'},
            {number: 1, color: 'J'},
            {number: 3, color: '♦'},
            {number: 3, color: '♥'}
        ];
        var sorted = [
            {number: 5, color: '♥', type: CardUtil.CARD_TYPES.RedFive},
            {number: 1, color: 'J', type: CardUtil.CARD_TYPES.Joker},
            {number: 3, color: '♥', type: CardUtil.CARD_TYPES.Three},
            {number: 3, color: '♦', type: CardUtil.CARD_TYPES.SubThree},
            {number: 7, color: '♦', type: CardUtil.CARD_TYPES.SubMajorNum},
            {number: 10, color: '♥', type: CardUtil.CARD_TYPES.NormalMajor},
            {number: 6, color: '♥', type: CardUtil.CARD_TYPES.NormalMajor},
            {number: 13, color: '♠', type: CardUtil.CARD_TYPES.Others},
            {number: 3, color: '♠', type: CardUtil.CARD_TYPES.Others},
            {number: 5, color: '♦', type: CardUtil.CARD_TYPES.Others},
            {number: 12, color: '♣', type: CardUtil.CARD_TYPES.Others}
        ];
        cardUtil.majorColor = '♥';
        cardUtil.getSortedCards(cards).should.eql(sorted);
    });
    it("All Color before majorColor confirmed", function() {
        var cards = [
            {number: 7, color: '♦'},
            {number: 6, color: '♥'},
            {number: 10, color: '♥'},
            {number: 13, color: '♠'},
            {number: 12, color: '♣'},
            {number: 3, color: '♠'},
            {number: 5, color: '♦'},
            {number: 5, color: '♥'},
            {number: 1, color: 'J'},
            {number: 3, color: '♦'},
            {number: 3, color: '♥'}
        ];
        var sorted = [
            {number: 5, color: '♥', type: CardUtil.CARD_TYPES.RedFive},
            {number: 1, color: 'J', type: CardUtil.CARD_TYPES.Joker},
            {number: 7, color: '♦', type: CardUtil.CARD_TYPES.SubMajorNum},
            {number: 10, color: '♥', type: CardUtil.CARD_TYPES.Others},
            {number: 6, color: '♥', type: CardUtil.CARD_TYPES.Others},
            {number: 3, color: '♥', type: CardUtil.CARD_TYPES.Others},
            {number: 13, color: '♠', type: CardUtil.CARD_TYPES.Others},
            {number: 3, color: '♠', type: CardUtil.CARD_TYPES.Others},
            {number: 5, color: '♦', type: CardUtil.CARD_TYPES.Others},
            {number: 3, color: '♦', type: CardUtil.CARD_TYPES.Others},
            {number: 12, color: '♣', type: CardUtil.CARD_TYPES.Others}
        ];
        cardUtil.majorColor = null;
        cardUtil.getSortedCards(cards).should.eql(sorted);
    });
});

/**
 *
 */
describe("Limitation sorting", function() {
    it("Simple test : ♥7", function() {
        var lim = {
            sum: 6,
            type: 'M',
            limitation: [
                { type: 'single', multi: 1, length: 1 },
                { type: 'single', multi: 3, length: 1 },
                { type: 'tractor', multi: 2, length: 2 },
                { type: 'single', multi: 2, length: 1 }
            ]
        };
        var sorted = {
            sum: 6,
            type: 'M',
            limitation: [
                { type: 'single', multi: 3, length: 1 },
                { type: 'tractor', multi: 2, length: 2 },
                { type: 'single', multi: 2, length: 1 },
                { type: 'single', multi: 1, length: 1 }
            ]
        };
        cardUtil.majorColor = '♥';
        lim.limitation.sort(cardUtil.limitationDesc);
        (lim).should.eql(sorted);
    });

});

/**
 *
 */
describe("Number Scale", function() {
    it("♥8 should be 8 : ♥7", function() {
        var heart8 = {number: 8, color: '♥', type: 1};
        cardUtil.majorColor = '♥';
        cardUtil.numberScale(heart8).should.eql(8);
    });
    it("♥6 should be 7 : ♥7", function() {
        var heart6 = {number: 6, color: '♥', type: 1};
        cardUtil.majorColor = '♥';
        cardUtil.numberScale(heart6).should.eql(7);
    });
    it("♥4 should be 6 : ♥7", function() {
        var heart4 = {number: 4, color: '♥', type: 1};
        cardUtil.majorColor = '♥';
        cardUtil.numberScale(heart4).should.eql(6);
    });
    it("♥2 should be 5 : ♥7", function() {
        var heart2 = {number: 2, color: '♥', type: 1};
        cardUtil.majorColor = '♥';
        cardUtil.numberScale(heart2).should.eql(5);
    });
});

/**
 *
 */
describe("Card Scale", function() {
    it("♥8 should be 8 : ♥7", function() {
        var heart8 = {number: 8, color: '♥', type: 1};
        cardUtil.majorColor = '♥';
        cardUtil.cardScale(heart8).should.eql(8);
    });
    it("♥6 should be 7 : ♥7", function() {
        var heart6 = {number: 6, color: '♥', type: 1};
        cardUtil.majorColor = '♥';
        cardUtil.cardScale(heart6).should.eql(7);
    });
    it("♦7 should be 15 : ♥7", function() {
        var diamond7 = {number: 7, color: '♦', type: 2};
        cardUtil.majorColor = '♥';
        cardUtil.cardScale(diamond7).should.eql(15);
    });
    it("♦3 should be 17 : ♥7", function() {
        var diamond3 = {number: 3, color: '♦', type: 4};
        cardUtil.majorColor = '♥';
        cardUtil.cardScale(diamond3).should.eql(17);
    });
    it("J0 should be 19 : ♥7", function() {
        var subJoker = {number: 0, color: 'J', type: 6};
        cardUtil.majorColor = '♥';
        cardUtil.cardScale(subJoker).should.eql(19);
    });
});

/**
 *
 */
describe("Extract Cards", function() {
    it("Extract result should be right : ♥7", function() {
        var src = [
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
        var poped = [
            { number: 5, color: '♣' },
            { number: 8, color: '♥' },
            { number: 1, color: 'J' },
            { number: 8, color: '♠' },
            { number: 7, color: '♠' },
            { number: 7, color: '♥' }
        ];
        var res = [
            { number: 1, color: 'J', type: 6 },
            { number: 7, color: '♥', type: 3 },
            { number: 7, color: '♠', type: 2 },
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♠', type: 0 },
            { number: 5, color: '♣', type: 0 }
        ];
        cardUtil.majorColor = '♥';
        cardUtil.extractCards(src, poped).should.eql(res);
    });
    it("Extract result should be null if illegal : ♥7", function() {
        var src = [
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

        var poped = [
            { number: 7, color: '♣' },
            { number: 8, color: '♥' },
            { number: 1, color: 'J' },
            { number: 8, color: '♠' },
            { number: 7, color: '♠' },
            { number: 7, color: '♥' }
        ];
        cardUtil.majorColor = '♥';
        (cardUtil.extractCards(src, poped) === null).should.eql(true);
    });
});

/**
 *
 */
describe("Pop Cards", function() {
    it("Pop result should be true : ♥7", function() {
        var src = [
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
        var poped = [
            { number: 5, color: '♣' },
            { number: 8, color: '♥' },
            { number: 1, color: 'J' },
            { number: 8, color: '♠' },
            { number: 7, color: '♠' },
            { number: 7, color: '♥' }
        ];
        cardUtil.majorColor = '♥';
        cardUtil.popCards(src, poped).should.eql(true);
    });
    it("Pop result should be false if illegal : ♥7", function() {
        var src = [
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
        var poped = [
            { number: 7, color: '♣' },
            { number: 8, color: '♥' },
            { number: 1, color: 'J' },
            { number: 8, color: '♠' },
            { number: 7, color: '♠' },
            { number: 7, color: '♥' }
        ];
        cardUtil.majorColor = '♥';
        cardUtil.popCards(src, poped).should.eql(false);
    });
    it("Pop result should be true : ♥7", function() {
        var src = [
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
        var remained = [
            { number: 1, color: 'J', type: 6 },
            { number: 0, color: 'J', type: 6 },
            { number: 3, color: '♥', type: 5 },
            { number: 3, color: '♥', type: 5 },
            { number: 3, color: '♦', type: 4 },
            { number: 3, color: '♦', type: 4 },
            { number: 7, color: '♥', type: 3 },
            { number: 7, color: '♦', type: 2 },
            { number: 12, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 10, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 },
            { number: 3, color: '♠', type: 0 },
            { number: 14, color: '♦', type: 0 },
            { number: 8, color: '♦', type: 0 },
            { number: 5, color: '♦', type: 0 },
            { number: 9, color: '♣', type: 0 },
            { number: 8, color: '♣', type: 0 },
            { number: 6, color: '♣', type: 0 },
            { number: 5, color: '♣', type: 0 },
            { number: 3, color: '♣', type: 0 },
            { number: 3, color: '♣', type: 0 },
            { number: 2, color: '♣', type: 0 }
        ];
        var poped = [
            { number: 5, color: '♣' },
            { number: 8, color: '♥' },
            { number: 1, color: 'J' },
            { number: 8, color: '♠' },
            { number: 7, color: '♠' },
            { number: 7, color: '♥' }
        ];
        cardUtil.majorColor = '♥';
        cardUtil.popCards(src, poped);
        src.should.eql(remained);
    });
});

describe("Card Structure", function() {
    it("Structure should be right : ♥7", function() {
        cardUtil.majorColor = '♥';
        var res = cardUtil.getCardStructure(CARDS_IN_HAND);
        res['M'].should.eql(STRUCTURE['M']);
        res['♠'].should.eql(STRUCTURE['♠']);
        res['♦'].should.eql(STRUCTURE['♦']);
        res['♣'].should.eql(STRUCTURE['♣']);

    });

    it("Tractors recognition should be right : ♥7", function() {
        var cards = [
            { number: 8, color: '♠', type: 0 },
            { number: 8, color: '♠', type: 0 },
            { number: 7, color: '♠', type: 0 },
            { number: 7, color: '♠', type: 0 },
            { number: 7, color: '♠', type: 0 },
            { number: 6, color: '♠', type: 0 },
            { number: 6, color: '♠', type: 0 },
            { number: 5, color: '♠', type: 0 },
            { number: 5, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 }
        ];
        var stru = {
            '♠': [
                {
                    type: 'single',
                    multi: 2,
                    content: [{number: 8, color: '♠', type: 0}]
                }, {
                    type: 'single',
                    multi: 3,
                    content: [{number: 7, color: '♠', type: 0}]
                }, {
                    type: 'tractor',
                    multi: 2,
                    content: [{number: 6, color: '♠', type: 0},
                        {number: 5, color: '♠', type: 0}]
                }, {
                    type: 'single',
                    multi: 3,
                    content: [{number: 4, color: '♠', type: 0}]
                }
        ]};
        cardUtil.majorColor = '♥';
        var res = cardUtil.getCardStructure(cards);
        res['♠'].should.eql(stru['♠']);
    });
});


describe("Card Structure Without Tractor", function() {
    it("Structure should be right : ♥7", function() {
        cardUtil.majorColor = '♥';
        var res = cardUtil.getCardStructureWithoutTractor(CARDS_IN_HAND);
        res['M'].should.eql(STRUCTURE_WITHOUT_TRACTOR['M']);
        res['♠'].should.eql(STRUCTURE_WITHOUT_TRACTOR['♠']);
        res['♦'].should.eql(STRUCTURE_WITHOUT_TRACTOR['♦']);
        res['♣'].should.eql(STRUCTURE_WITHOUT_TRACTOR['♣']);

    });

    it("Tractors recognition should be right : ♥7", function() {
        var cards = [
            { number: 8, color: '♠', type: 0 },
            { number: 8, color: '♠', type: 0 },
            { number: 7, color: '♠', type: 0 },
            { number: 7, color: '♠', type: 0 },
            { number: 7, color: '♠', type: 0 },
            { number: 6, color: '♠', type: 0 },
            { number: 6, color: '♠', type: 0 },
            { number: 5, color: '♠', type: 0 },
            { number: 5, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 },
            { number: 4, color: '♠', type: 0 }
        ];
        var stru = {
            '♠': [
                {
                    multi: 2,
                    content: {number: 8, color: '♠', type: 0}
                }, {
                    multi: 3,
                    content: {number: 7, color: '♠', type: 0}
                }, {
                    multi: 2,
                    content: {number: 6, color: '♠', type: 0}
                },
                {
                    multi: 2,
                    content: {number: 5, color: '♠', type: 0}
                }, {
                    multi: 3,
                    content: {number: 4, color: '♠', type: 0}
                }
            ]};
        cardUtil.majorColor = '♥';
        var res = cardUtil.getCardStructureWithoutTractor(cards);
        res['♠'].should.eql(stru['♠']);
    });
});

describe("Match Tractor", function() {
    it("Shorter tractor should be all consumed : ♥7", function() {
        var inHand = [{
                type: 'tractor',
                multi: 2,
                content: [{number: 11, color: '♠', type: 0},
                    {number: 10, color: '♠', type: 0}]
            }, {
                type: 'tractor',
                multi: 2,
                content: [{number: 4, color: '♠', type: 0},
                    {number: 3, color: '♠', type: 0}]
        }];
        var remained = [{
            type: 'tractor',
            multi: 2,
            content: [{number: 4, color: '♠', type: 0},
                {number: 3, color: '♠', type: 0}]
        }];
        cardUtil.majorColor = '♥';
        cardUtil.matchTractor(inHand, 2, 4).should.eql(2);
        inHand.should.eql(remained);
    });
    it("Longer tractor should be partly consumed : ♥7", function() {
        var inHand = [{
            type: 'tractor',
            multi: 2,
            content: [{number: 11, color: '♠', type: 0},
                {number: 10, color: '♠', type: 0},
                {number: 9, color: '♠', type: 0},
                {number: 8, color: '♠', type: 0}]
        }];
        var remained = [{
            type: 'tractor',
            multi: 2,
            content: [{number: 11, color: '♠', type: 0},
                {number: 10, color: '♠', type: 0}]
        }];
        cardUtil.majorColor = '♥';
        cardUtil.matchTractor(inHand, 2, 2).should.eql(2);
        inHand.should.eql(remained);
    });
});


describe("Match Single", function() {
    it("Single should be matched : ♥7", function() {
        var inHand = [{
            type: 'single',
            multi: 2,
            content: [{number: 11, color: '♠', type: 0}]
        }];
        var remained = [];
        cardUtil.majorColor = '♥';
        cardUtil.matchSingle(inHand, 2).should.eql(true);
        inHand.should.eql(remained);
    });
    it("Tractor should be matched at last : ♥7", function() {
        var inHand = [{
            type: 'single',
            multi: 2,
            content: [{number: 11, color: '♠', type: 0}]
        }, {
            type: 'tractor',
            multi: 2,
            content: [{number: 4, color: '♠', type: 0},
                {number: 3, color: '♠', type: 0}]
        }];
        var remained = [{
            type: 'tractor',
            multi: 2,
            content: [{number: 4, color: '♠', type: 0},
                {number: 3, color: '♠', type: 0}]
        }];
        cardUtil.majorColor = '♥';
        cardUtil.matchSingle(inHand, 2).should.eql(true);
        inHand.should.eql(remained);
    });
    it("triple should not be matched by double: ♥7", function() {
        var inHand = [{
            type: 'single',
            multi: 3,
            content: [{number: 11, color: '♠', type: 0}]
        }];
        var remained = [{
            type: 'single',
            multi: 3,
            content: [{number: 11, color: '♠', type: 0}]
        }];
        cardUtil.majorColor = '♥';
        cardUtil.matchSingle(inHand, 2).should.eql(false);
        inHand.should.eql(remained);
    });
});


describe("Get Limitation", function() {
    it("Tractor should be matched : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 }
        ];
        var res = {
            sum: 4,
            sumInType: 4,
            type: 'M',
            limitation: [ { type: 'tractor', multi: 2, length: 2 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, CARDS_IN_HAND).should.eql(res);
    });
    it("Tractor3 should be matched by tractor2 : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 }
        ];
        var res = {
            sum: 6,
            sumInType: 6,
            type: 'M',
            limitation: [ { type: 'tractor', multi: 2, length: 2 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, CARDS_IN_HAND).should.eql(res);
    });
    it("Single3 should be matched by single2 : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 }
        ];
        var res = {
            sum: 3,
            sumInType: 3,
            type: 'M',
            limitation: [ { type: 'single', multi: 2, length: 1 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, CARDS_IN_HAND).should.eql(res);
    });
    it("Single2 shouldn't be matched by single3 : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 }
        ];
        var inHand = [
            { number: 2, color: '♥', type: 0 },
            { number: 2, color: '♥', type: 0 },
            { number: 2, color: '♥', type: 0 }
        ];
        var res = {
            sum: 2,
            type: null,
            limitation: null
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, inHand).should.eql(res);
    });
    it("There should be no limitation if no same type cards in hand : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 }
        ];
        var inHand = [
            { number: 2, color: '♠', type: 0 },
            { number: 2, color: '♠', type: 0 },
            { number: 2, color: '♠', type: 0 }
        ];
        var res = {
            sum: 6,
            type: null,
            limitation: null
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, inHand).should.eql(res);
    });
    it("Sum should not above in-hand cards sum : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 }
        ];
        var inHand = [
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 }
        ];
        var res = {
            sum: 6,
            sumInType: 3,
            type: 'M',
            limitation: [ { type: 'single', multi: 3, length: 1 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, inHand).should.eql(res);
    });
    it("Tractor2 should have priority over single3 when matching tractor3 : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 }
        ];
        var inHand = [
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 10, color: '♥', type: 1 },
            { number: 10, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 }
        ];
        var res = {
            sum: 6,
            sumInType: 6,
            type: 'M',
            limitation: [ { type: 'tractor', multi: 2, length: 2 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, inHand).should.eql(res);
    });
    it("Remained cards should be still matched : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 4, color: '♥', type: 1 },
            { number: 4, color: '♥', type: 1 },
            { number: 4, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 }
        ];
        var inHand = [
            { number: 14, color: '♥', type: 1 },
            { number: 14, color: '♥', type: 1 },
            { number: 13, color: '♥', type: 1 },
            { number: 13, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 10, color: '♥', type: 1 },
            { number: 10, color: '♥', type: 1 }
        ];
        var res = {
            sum: 12,
            sumInType: 8,
            type: 'M',
            limitation: [ { type: 'tractor', multi: 2, length: 2 }, { type: 'tractor', multi: 2, length: 2 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, inHand).should.eql(res);
    });
    it("Group should still be well matched : ♥7", function() {
        var played = [
            { number: 14, color: '♥', type: 1 },
            { number: 14, color: '♥', type: 1 },
            { number: 14, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 }
        ];
        var inHand = [
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 10, color: '♥', type: 1 },
            { number: 10, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 }
        ];
        var res = {
            sum: 7,
            sumInType: 6,
            type: 'M',
            limitation: [ { type: 'single', multi: 2, length: 1 }, { type: 'tractor', multi: 2, length: 2 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.getLimitation(played, inHand).should.eql(res);
    });
});

describe("Match Limitation", function() {
    it("Wrong type shouldn't be matched : ♥7", function() {
        var played = [
            { number: 8, color: '♥', type: 1 },
            { number: 8, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 }
        ];
        var lim = {
            sum: 4,
            type: '♠',
            limitation: [ { type: 'tractor', multi: 2, length: 2 } ]
        };
        cardUtil.majorColor = '♥';
        cardUtil.matchLimitation(played, lim).should.eql(false);
    });
    it("Null limitation should be matched by anything: ♥7", function () {
        var played = [
            { number: 14, color: '♥', type: 1 }
        ];
        var lim = {sum: 1};
        cardUtil.majorColor = '♥';
        cardUtil.matchLimitation(played, lim).should.eql(true);
    });
    it("Limitation should be matched : ♥7", function () {
        var played = [
            { number: 12, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 }
        ];
        var lim = {
            sum: 4,
            sumInType: 4,
            type: 'M',
            limitation: [{type: 'tractor', multi: 2, length: 2}]
        };
        cardUtil.majorColor = '♥';
        cardUtil.matchLimitation(played, lim).should.eql(true);
    });
    it("Tractor2 + single1 should be well matched : ♥7", function () {
        var played = [
            { number: 13, color: '♥', type: 1 },
            { number: 13, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 }
        ];
        var lim = {
            sum: 7,
            sumInType: 7,
            type: 'M',
            limitation: [{type: 'tractor', multi: 2, length: 3}]
        };
        cardUtil.majorColor = '♥';
        cardUtil.matchLimitation(played, lim).should.eql(true);
    });
    it("Tractor2 + single3 should be well matched : ♥7", function () {
        var played = [
            { number: 13, color: '♥', type: 1 },
            { number: 13, color: '♥', type: 1 },
            { number: 13, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 }
        ];
        var lim = {
            sum: 7,
            sumInType: 7,
            type: 'M',
            limitation: [{type: 'tractor', multi: 2, length: 2}, {type: 'single', multi: 3, length: 1}]
        };
        cardUtil.majorColor = '♥';
        cardUtil.matchLimitation(played, lim).should.eql(true);
    });
    it("Multiple tractors be well matched : ♥7", function () {
        var played = [
            { number: 12, color: '♥', type: 1 },
            { number: 12, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 11, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 6, color: '♥', type: 1 },
            { number: 4, color: '♥', type: 1 },
            { number: 4, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 },
            { number: 2, color: '♥', type: 1 }
        ];
        var lim = {
            sum: 10,
            sumInType: 10,
            type: 'M',
            limitation: [{type: 'tractor', multi: 2, length: 2}, {type: 'tractor', multi: 2, length: 3}]
        };
        cardUtil.majorColor = '♥';
        cardUtil.matchLimitation(played, lim).should.eql(true);
    });
});



describe("Check first play legal", function() {
    it("Single struture should be always legal: ♥7", function () {
        var played = [
            {number: 4, color: '♥', type: 1}
        ];
        var inHands = [
            [
                {number: 2, color: '♥', type: 1}
            ], [
                {number: 6, color: '♥', type: 1}
            ], [
                {number: 8, color: '♥', type: 1}
            ], [
                {number: 9, color: '♥', type: 1}
            ]
        ];
        cardUtil.majorColor = '♥';
        cardUtil.checkFirstPlayLegal(played, inHands).should.eql(played);
    });
    it("Failed if there is bigger one: ♥7", function () {
        var played = [
            {number: 6, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1}
        ];
        var inHands = [
            [
                {number: 9, color: '♥', type: 1},
                {number: 2, color: '♥', type: 1}
            ], [
                {number: 10, color: '♥', type: 1},
                {number: 6, color: '♥', type: 1}
            ], [
                {number: 11, color: '♥', type: 1},
                {number: 8, color: '♥', type: 1}
            ], [
                {number: 12, color: '♥', type: 1},
                {number: 9, color: '♥', type: 1}
            ]
        ];
        var res = [{number: 6, color: '♥', type: 1}];
        cardUtil.majorColor = '♥';
        cardUtil.checkFirstPlayLegal(played, inHands).should.eql(res);
    });
    it("Success if all biggest: ♥7", function () {
        var played = [
            {number: 14, color: '♥', type: 1},
            {number: 13, color: '♥', type: 1}
        ];
        var inHands = [
            [
                {number: 13, color: '♥', type: 1},
                {number: 2, color: '♥', type: 1}
            ], [
                {number: 10, color: '♥', type: 1},
                {number: 6, color: '♥', type: 1}
            ], [
                {number: 11, color: '♥', type: 1},
                {number: 8, color: '♥', type: 1}
            ], [
                {number: 12, color: '♥', type: 1},
                {number: 9, color: '♥', type: 1}
            ]
        ];
        cardUtil.majorColor = '♥';
        cardUtil.checkFirstPlayLegal(played, inHands).should.eql(played);
    });
    it("Complex situation: ♥7", function () {
        var played = [
            {number: 13, color: '♥', type: 1},
            {number: 13, color: '♥', type: 1},
            {number: 13, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1}
        ];
        var inHands = [
            [
                {number: 11, color: '♥', type: 1},
                {number: 11, color: '♥', type: 1},
                {number: 11, color: '♥', type: 1},
                {number: 10, color: '♥', type: 1},
                {number: 10, color: '♥', type: 1},
                {number: 10, color: '♥', type: 1},
                {number: 2, color: '♥', type: 1}
            ]
        ];
        var res = [
            {number: 8, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1}
        ];
        cardUtil.majorColor = '♥';
        cardUtil.checkFirstPlayLegal(played, inHands).should.eql(res);
    });
});


describe("Check not first play legal", function() {
    it("Simple test : ♥7", function () {
        var inHand = [
            {number: 1, color: 'J', type: 6},
            {number: 1, color: 'J', type: 6},
            {number: 1, color: 'J', type: 6},
            {number: 10, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1}
        ];
        var played = [
            {number: 1, color: 'J', type: 6},
            {number: 8, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1}
        ];
        var firstPlayed = [
            {number: 5, color: '♥', type: 7},
            {number: 5, color: '♥', type: 7},
            {number: 14, color: '♥', type: 1},
            {number: 14, color: '♥', type: 1},
            {number: 13, color: '♥', type: 1},
            {number: 13, color: '♥', type: 1}
        ];
        cardUtil.majorColor = '♥';
        cardUtil.checkNotFirstPlayLegal(firstPlayed, played, inHand).should.eql(true);
    });
    it("Wrong amount : ♥7", function () {
        var inHand = [
            {number: 1, color: 'J', type: 6},
            {number: 1, color: 'J', type: 6},
            {number: 1, color: 'J', type: 6},
            {number: 10, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 6, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1}
        ];
        var played = [
            {number: 1, color: 'J', type: 6}
        ];
        var firstPlayed = [
            {number: 5, color: '♠', type: 0},
            {number: 5, color: '♠', type: 0}
        ];
        cardUtil.majorColor = '♥';
        cardUtil.checkNotFirstPlayLegal(firstPlayed, played, inHand).should.eql(false);
    });
});

describe("Card group comparison", function() {
    it("None-major, with first played largest: ♥7", function () {
        var firstPlayed = [
            {number: 14, color: '♠', type: 0},
            {number: 10, color: '♠', type: 0},
            {number: 10, color: '♠', type: 0},
            {number: 9, color: '♠', type: 0},
            {number: 9, color: '♠', type: 0}
        ];
        var playedNoneMajor = [
            {number: 5, color: '♠', type: 0},
            {number: 5, color: '♠', type: 0},
            {number: 5, color: '♠', type: 0},
            {number: 4, color: '♠', type: 0},
            {number: 4, color: '♠', type: 0}
        ];
        var playedMajor = [
            {number: 4, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1}
        ];
        var playedOthers = [
            {number: 5, color: '♦', type: 0},
            {number: 5, color: '♦', type: 0},
            {number: 5, color: '♦', type: 0},
            {number: 4, color: '♦', type: 0},
            {number: 4, color: '♦', type: 0}
        ];
        cardUtil.majorColor = '♥';
        cardUtil.cardGroupLargerThan(firstPlayed, firstPlayed, playedNoneMajor).should.eql(false);
        cardUtil.cardGroupLargerThan(firstPlayed, firstPlayed, playedOthers).should.eql(false);
        cardUtil.cardGroupLargerThan(firstPlayed, firstPlayed, playedMajor).should.eql(true);
    });
    it("None-major, with none-first played largest: ♥7", function () {
        var firstPlayed = [
            {number: 14, color: '♠', type: 0},
            {number: 10, color: '♠', type: 0},
            {number: 10, color: '♠', type: 0},
            {number: 9, color: '♠', type: 0},
            {number: 9, color: '♠', type: 0}
        ];
        var preMax = [
            {number: 9, color: '♥', type: 1},
            {number: 9, color: '♥', type: 1},
            {number: 9, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1}
        ];
        var playedNoneMajor = [
            {number: 5, color: '♠', type: 0},
            {number: 5, color: '♠', type: 0},
            {number: 5, color: '♠', type: 0},
            {number: 4, color: '♠', type: 0},
            {number: 4, color: '♠', type: 0}
        ];
        var playedMajor = [
            {number: 4, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1}
        ];
        var playedPartlyLarger = [
            {number: 10, color: '♥', type: 1},
            {number: 5, color: '♥', type: 1},
            {number: 5, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1}
        ];
        cardUtil.majorColor = '♥';
        cardUtil.cardGroupLargerThan(firstPlayed, preMax, playedNoneMajor).should.eql(false);
        cardUtil.cardGroupLargerThan(firstPlayed, preMax, playedMajor).should.eql(false);
        cardUtil.cardGroupLargerThan(firstPlayed, preMax, playedPartlyLarger).should.eql(false);
    });
    it("More complex: ♥7", function () {
        var firstPlayed = [
            {number: 14, color: '♠', type: 0},
            {number: 13, color: '♠', type: 0},
            {number: 10, color: '♠', type: 0},
            {number: 10, color: '♠', type: 0},
            {number: 2, color: '♠', type: 0},
            {number: 2, color: '♠', type: 0}
        ];
        var preMax = [
            {number: 11, color: '♥', type: 1},
            {number: 10, color: '♥', type: 1},
            {number: 9, color: '♥', type: 1},
            {number: 9, color: '♥', type: 1},
            {number: 9, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1}
        ];
        var played = [
            {number: 14, color: '♥', type: 1},
            {number: 14, color: '♥', type: 1},
            {number: 14, color: '♥', type: 1},
            {number: 12, color: '♥', type: 1},
            {number: 12, color: '♥', type: 1},
            {number: 8, color: '♥', type: 1}
        ];
        var playedFailed = [
            {number: 14, color: '♥', type: 1},
            {number: 14, color: '♥', type: 1},
            {number: 14, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 4, color: '♥', type: 1},
            {number: 2, color: '♥', type: 1}
        ];

        cardUtil.majorColor = '♥';
        cardUtil.cardGroupLargerThan(firstPlayed, preMax, played).should.eql(true);
        cardUtil.cardGroupLargerThan(firstPlayed, preMax, playedFailed).should.eql(false);
    });

});

describe("Check Multiple", function() {
    it("Double", function () {
        var played = [
            {number: 14, color: '♥', type: 1},
            {number: 14, color: '♥', type: 1}
        ];
        cardUtil.getMultiple(played).should.eql(4);
    });
});

describe("Find Legal Cards", function() {
    it("Simple Test", function () {
        var played = [
            { number: 4, color: '♣', type: 0 },
            { number: 4, color: '♣', type: 0 },
            { number: 4, color: '♣', type: 0 }
        ];
        var res = [
            { number: 5, color: '♣', type: 0 },
            { number: 5, color: '♣', type: 0 },
            { number: 9, color: '♣', type: 0 }
        ];
        cardUtil.majorColor = '♥';
        cardUtil.getCardsWithLimitation(CARDS_IN_HAND, cardUtil.getLimitation(played, CARDS_IN_HAND)).should.eql(res);
    });

    it("More Complex", function () {
        var played = [
            { number: 10, color: '♣', type: 0 },
            { number: 10, color: '♣', type: 0 },
            { number: 10, color: '♣', type: 0 },
            { number: 6, color: '♣', type: 0 },
            { number: 6, color: '♣', type: 0 },
            { number: 6, color: '♣', type: 0 },
            { number: 4, color: '♣', type: 0 },
            { number: 4, color: '♣', type: 0 },
            { number: 4, color: '♣', type: 0 }
        ];
        var res = [
            { number: 5, color: '♣', type: 0 },
            { number: 5, color: '♣', type: 0 },
            { number: 3, color: '♣', type: 0 },
            { number: 3, color: '♣', type: 0 },
            { number: 9, color: '♣', type: 0 },
            { number: 8, color: '♣', type: 0 },
            { number: 6, color: '♣', type: 0 },
            { number: 2, color: '♣', type: 0 },
            { number: 1, color: 'J', type: 6 }
        ];
        cardUtil.majorColor = '♥';
        cardUtil.getCardsWithLimitation(CARDS_IN_HAND, cardUtil.getLimitation(played, CARDS_IN_HAND)).should.eql(res);
    });
});