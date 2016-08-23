/**
 * Created by liboyuan on 16/8/22.
 */

var CARD_COLORS = {
    'J': 5,
    '♥': 4,
    '♠': 3,
    '♦': 2,
    '♣': 1
};

var CARD_TYPES = {
    RedFive: 7,
    Joker: 6,
    Three: 5,
    SubThree: 4,
    MajorNum: 3,
    SubMajorNum: 2,
    NormalMajor: 1,
    Others: 0
};

function CardUtil(majorNumber) {
    this.majorColor = null;
    this.majorNumber = majorNumber;


    this.cardEqual = function (a, b) {
        return a.number == b.number && a.color == b.color;
    };

    this.getAbsoluteMajorSum = function (cards) {
        var len = cards.length;
        var res = 0;
        for (var i = 0; i < len, cards[i].type > CARD_TYPES.NormalMajor; i ++)
            res ++;
        return res;
    };

    this.sameColorWith = function (color, target) {
        if (color == null)
            return false;
        if (color == '♥' || color == '♦') {
            return target == '♥' || target == '♦';
        } else {
            return target == '♠' || target == '♣';
        }
    };

    this.getCardType = function (card) {
        if (card.color == '♥' && card.number == 5)
            return CARD_TYPES.RedFive;
        if (card.color == 'J')
            return CARD_TYPES.Joker;
        if (card.number == 3 && this.sameColorWith(this.majorColor, card.color)) {
            if (this.majorColor == card.color)
                return CARD_TYPES.Three;
            return CARD_TYPES.SubThree;
        }
        if (card.number == this.majorNumber) {
            if (this.majorColor == card.color)
                return CARD_TYPES.MajorNum;
            return CARD_TYPES.SubMajorNum;
        }
        if (this.majorColor == card.color)
            return CARD_TYPES.NormalMajor;
        return CARD_TYPES.Others;
    };

    this.cardDesc = function (a, b) {
        var res = b.type - a.type;
        if (res != 0)
            return res;
        if (a.color == b.color)
            return b.number - a.number;
        return CARD_COLORS[b.color] - CARD_COLORS[a.color];
    };

    this.getSortedCards = function (cards) {
        var cardSum = cards.length;
        for (var i = 0; i < cardSum; i ++) {
            cards[i].type = this.getCardType(cards[i]);
        }
        cards.sort(this.cardDesc);
        return cards;
    };

    this.popCards = function(src, target) {
        var len = src.length;
        var matched = [len];
        for (var i = 0; i < len; i ++) {
            matched[i] = false;
        }
        var len2 = target.length;
        for (var j = 0; j < len2; j ++) {
            var flag = false;
            for (var m = 0; m < len; m ++) {
                if (!matched[m] && src[m] == target[j]) {
                    matched[m] = true;
                    flag = true;
                    break;
                }
            }
            if (flag == false)
                return false;
        }
        var tmp = 0;
        for (var k = 0; k < len; k ++) {
            if (matched[k + tmp]) {
                src.splice(k, 1);
                k --;
                tmp ++;
                len --;
            }
        }
        return true;
    };

    this.getCardsSameContent = function(src, target) {
        var len = src.length;
        var matched = [len];
        for (var i = 0; i < len; i ++) {
            matched[i] = false;
        }
        var len2 = target.length;
        for (var j = 0; j < len2; j ++) {
            var flag = false;
            for (var m = 0; m < len; m ++) {
                if (!matched[m] && this.cardEqual(src[m], target[j])) {
                    matched[m] = true;
                    flag = true;
                    break;
                }
            }
            if (flag == false)
                return null;
        }
        var res = [];
        var tmp = 0;
        for (var k = 0; k < len; k ++) {
            if (matched[k + tmp]) {
                res.push(src.splice(k, 1)[0]);
                k --;
                tmp ++;
                len --;
            }
        }
        return res;
    };
}