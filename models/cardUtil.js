/**
 * Created by Liberion on 2016/6/3.
 */

var Card = require('./card');

var CARD_SET_SUM = 3;

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

    /**
     * 判断是不是相同的牌
     * @param a
     * @param b
     * @returns {boolean}
     */
    this.cardEqual = function (a, b) {
        return a.number == b.number && a.color == b.color;
    };

    /**
     * 判断是否为除了王以外的花色
     * @param tar
     * @returns {boolean}
     */
    this.isNormalColor = function (tar) {
        return (tar == '♠' || tar == '♣' || tar == '♥' || tar == '♦');
    };

    /**
     * 判断含有多少红五
     * @param cards
     * @returns {number}
     */
    this.containsFiveOfHearts = function (cards) {
        var len = cards.length;
        var res = 0;
        for (var i = 0; i < len; i ++)
            if (cards[i].number == 5 && cards[i].color == '♥')
                res ++;
        return res;
    };

    /**
     * 判断牌的类型,包括红五、王、参谋、副参谋、同数主、副同数主、一般主、副牌
     * @param card
     * @returns {number}
     */
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

    /**
     * 得到真主的数量
     * @param cards
     * @returns {number}
     */
    this.getAbsoluteMajorSum = function (cards) {
        var len = cards.length;
        var res = 0;
        for (var i = 0; i < len, cards[i].type > CARD_TYPES.NormalMajor; i ++)
            res ++;
        return res;
    };

    /**
     * 得到最大的n张真主
     * @param cards
     * @param amount
     * @returns {Array}
     */
    this.getAbsoluteMajor = function (cards, amount) {
        var res = [];
        for (var i = 0; i < amount; i ++)
            res.push(cards[i]);
        return res;
    };

    /**
     * 牌的降序
     * @param a 牌
     * @param b 牌
     * @returns {number}
     */
    this.cardDesc = function (a, b) {
        var res = b.type - a.type;
        if (res != 0)
            return res;
        if (a.color == b.color)
            return b.number - a.number;
        return CARD_COLORS[b.color] - CARD_COLORS[a.color];
    };


    /**
     * 不同牌型的降序,优先考虑多重性,其次考虑长度,即 单3 > 2拖拉机 > 单张
     * @param a 牌组
     * @param b 牌组
     * @returns {number}
     */
    this.structureDesc = function (a, b) {
        if (b.multi != a.multi)
            return b.multi - a.multi;
        if (b.type == 'tractor' && a.type == 'single')
            return 1;
        if (a.type == 'tractor' && b.type == 'single')
            return -1;
        return b.content.length - a.content.length;
    };

    /**
     * 限制条件的降序
     * @param a
     * @param b
     * @returns {number}
     */
    this.limitationDesc = function (a, b) {
        if (b.multi != a.multi)
            return b.multi - a.multi;
        return b.length - a.length;
    };

    /**
     * 判断是否同颜色(用来找参谋)
     * @param color
     * @param target
     * @returns {boolean}
     */
    this.sameColorWith = function (color, target) {
        if (color == null)
            return false;
        if (color == '♥' || color == '♦') {
            return target == '♥' || target == '♦';
        } else {
            return target == '♠' || target == '♣';
        }
    };

    /**
     * 获得排序后的牌组,期间会重新赋予牌的类型
     * @param cards
     * @returns {*}
     */
    this.getSortedCards = function (cards) {
        var cardSum = cards.length;
        for (var i = 0; i < cardSum; i ++) {
            cards[i].type = this.getCardType(cards[i]);
        }
        cards.sort(this.cardDesc);
        return cards;
    };

    /**
     * 用数字表示非真主牌的大小,分多种情况考虑
     * @param card
     * @returns {*}
     */
    this.numberScale = function (card) {
        var num = card.number;
        if (card.color == '♥') {
            if (this.sameColorWith(this.majorColor, card.color)) {
                if (num > this.majorNumber && num > 5) {
                    return num;
                } else if (num > 5) {
                    return num + 1;
                } else if (num > this.majorNumber && num > 3) {
                    return num + 1;
                } else if (num > 3) {
                    return num + 2;
                } else if (num > this.majorNum) {
                    return num + 2;
                } else {
                    return num + 3;
                }
            } else {
                if (num > this.majorNumber && num > 5) {
                    return num;
                } else if (num > this.majorNumber || num > 5) {
                    return num + 1;
                } else {
                    return num + 2;
                }
            }
        } else {
            if (this.sameColorWith(this.majorColor, card.color)) {
                if (num > this.majorNumber && num > 3) {
                    return num;
                } else if (num > this.majorNumber || num > 3) {
                    return num + 1;
                } else {
                    return num + 2;
                }
            } else {
                if (num > this.majorNum) {
                    return num;
                } else {
                    return num + 1;
                }
            }
        }
    };

    /**
     * 确定精确的牌的大小序,用来判断拖拉机
     * @param card
     * @returns {*}
     */
    this.cardScale = function (card) {
        if (card.type < CARD_TYPES.SubMajorNum) {
            //一般主或者副牌
            return this.numberScale(card);
        }
        if (card.type < CARD_TYPES.Joker) {
            //王以下
            return 13 + card.type;
        }

        if (card.type == CARD_TYPES.Joker) {
            //王通过点数区分大小王
            return 19 + card.number;
        }
        return 21;
    };

    /**
     * 从src中找出目标牌(源牌组不发生变化),用于出牌和埋底牌
     * 返回找出的牌(有序带类型信息)
     * 返回null说明取出失败(target中包含了src中不存在的牌)
     * @param src
     * @param target
     * @returns {*}
     */
    this.extractCards = function (src, target) {
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
        for (var k = 0; k < len; k ++) {
            if (matched[k]) {
                res.push(src[k]);
            }
        }
        return res;
    };

    /**
     * 从src中弹出目标牌(源牌组发生变化),用于出牌和埋底牌
     * 返回true说明成功
     * 返回false说明弹出失败(target中包含了src中不存在的牌)
     * @param src
     * @param target
     * @returns {boolean}
     */
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
                if (!matched[m] && this.cardEqual(src[m], target[j])) {
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

    /**
     * 获得洗好后的套牌
     * @returns {Array}
     */
    this.getShuffledCards = function () {
        var cards = [];
        for (var i = 0; i < CARD_SET_SUM; i ++) {
            /* A = 14*/
            for (var j = 2; j <= 14; j ++) {
                cards.push(new Card(j, '♠'));
                cards.push(new Card(j, '♣'));
                cards.push(new Card(j, '♥'));
                cards.push(new Card(j, '♦'));
            }
            cards.push(new Card(0, 'J'));
            cards.push(new Card(1, 'J'));
        }
        var cardSum = cards.length;
        var shuffleTimes = Math.floor(Math.random() * 15 + 5);
        for (var k = 0; k < shuffleTimes; k ++) {
            for (var m = 0; m < cardSum - 1; m ++) {
                var pos = Math.floor(Math.random() * cardSum - m);
                var tmp = cards.splice(pos, 1);
                cards = cards.concat(tmp);
            }

        }
        return cards;
    };

    /**
     * 最后一轮得分的倍数
     * @param cards
     * @returns {number}
     */
    this.getMultiple = function (cards) {
        var struc = this.getCardStructure(cards);
        var res = 2;
        for (var type in struc) {
            var len = struc[type].length;
            for (var i = 0; i < len; i ++) {
                var a = struc[type][i].multi;
                var b = struc[type][i].content.length;
                var tmpRes = parseInt(2 * Math.pow(a, b));
                if (tmpRes > res)
                    res = tmpRes;
            }
        }
        return res;
    };

    /**
     * 获得结构化的牌组(识别拖拉机),
     * 其中能不视作拖拉机的就不视作拖拉机,
     * 例如3344455不是拖拉机,7788999是2拖拉机
     * @param cards
     * @returns {Array}
     */
    this.getCardStructure = function (cards) {
        var stacks = [];
        var len = cards.length;

        for (var j = 0; j < len; j ++) {
            var type = 'M';
            if (cards[j].type == 0)
                type = cards[j].color;
            if (stacks[type] == null) {
                stacks[type] = [];
                stacks[type].push({
                    type: 'single',
                    multi: 1,
                    content: [cards[j]]
                });
                continue;
            }
            var last = stacks[type].pop();
            if (last.type != 'single') {
                //前一个是拖拉机
                var tmp1 = last.content[last.content.length - 1];
                if (this.cardEqual(cards[j], tmp1)) {
                    //拆掉前一个拖拉机
                    last.content.pop();
                    if (last.content.length == 1) {
                        last.type = 'single';
                    }
                    stacks[type].push(last);
                    stacks[type].push({
                        type: 'single',
                        multi: last.multi + 1,
                        content: [cards[j]]
                    });
                } else {
                    stacks[type].push(last);
                    stacks[type].push({
                        type: 'single',
                        multi: 1,
                        content: [cards[j]]
                    });
                }
            } else {
                //前一个不是拖拉机
                var tmp = last.content[0];
                if (this.cardEqual(cards[j], tmp)) {
                    last.multi ++;
                    var last2 = stacks[type].pop();
                    if (last2 == null) {
                        stacks[type].push(last);
                    } else if (last2.multi == last.multi) {
                        var ind = last2.content.length - 1;
                        var min = last2.content[ind];
                        if (this.cardScale(min) - this.cardScale(last.content[0]) == 1) {
                            //组成了新的拖拉机
                            last2.type = 'tractor';
                            last2.content.push(last.content[0]);
                            stacks[type].push(last2);
                        } else {
                            stacks[type].push(last2);
                            stacks[type].push(last);
                        }
                    } else {
                        stacks[type].push(last2);
                        stacks[type].push(last);
                    }
                } else {
                    stacks[type].push(last);
                    stacks[type].push({
                        type: 'single',
                        multi: 1,
                        content: [cards[j]]
                    });
                }
            }
        }
        return stacks;
    };

    /**
     * 获得结构化的牌组(不识别拖拉机),
     * 为了判断甩牌时其余玩家手牌是否有更大的(甩牌是否成功),
     * 以及判断在跟牌时是否符合要求,例如要求跟拖拉机加1张,而跟出55666是合法的
     * @param cards
     * @returns {Array}
     */
    this.getCardStructureWithoutTractor = function (cards) {
        var stacks = [];
        var len = cards.length;

        for (var j = 0; j < len; j ++) {
            var type = 'M';
            if (cards[j].type == 0)
                type = cards[j].color;
            if (stacks[type] == null) {
                stacks[type] = [];
                stacks[type].push({
                    multi: 1,
                    content: cards[j]
                });
                continue;
            }
            var last = stacks[type].pop();
            var tmp = last.content;
            if (this.cardEqual(cards[j], tmp)) {
                last.multi ++;
                stacks[type].push(last);
            } else {
                stacks[type].push(last);
                stacks[type].push({
                    multi: 1,
                    content: cards[j]
                });
            }
        }
        return stacks;
    };

    /**
     * 出拖拉机时匹配需要跟的牌,inHand会发生变化
     * @param inHand 手牌的一种花色(结构化牌组)
     * @param multi 拖拉机多重性
     * @param length 拖拉机长度(非牌数)
     * @returns {*} 匹配的拖拉机长度,可以小于length,-1表示未能匹配
     */
    this.matchTractor = function (inHand, multi, length) {
        var len = inHand.length;
        for (var i = 0; i < len; i ++) {
            if (inHand[i].type == 'tractor' && inHand[i].multi == multi) {
                if (length > inHand[i].content.length) {
                    var tmpLen = inHand[i].content.length;
                    inHand.splice(i, 1);
                    return tmpLen;
                } else if (length < inHand[i].content.length) {
                    var tmpLen2 = length;
                    for (var m = 0; m < tmpLen2; m ++)
                        inHand[i].content.pop();
                    if (inHand[i].length == 1)
                        inHand[i].type = 'single';
                    return tmpLen2;
                } else {
                    inHand.splice(i, 1);
                    return length;
                }
            }
        }
        return -1;
    };

    /**
     * 单出时匹配需要跟的牌
     * @param inHand 手牌的一种花色(结构化牌组)
     * @param multi 单出的多重性
     * @returns {boolean} 匹配是否成功
     */
    this.matchSingle = function (inHand, multi) {
        var len = inHand.length;
        for (var i = 0; i < len; i ++) {
            if (inHand[i].multi == multi && inHand[i].type == 'single') {
                inHand.splice(i, 1);
                return true;
            }
        }
        for (i = 0; i < len; i ++) {
            if (inHand[i].multi == multi && inHand[i].type == 'tractor') {
                inHand[i].content.pop();
                if (inHand[i].length == 1)
                    inHand[i].type = 'single';
                return true;
            }
        }
        return false;
    };

    /**
     * 求牌组(识别拖拉机)中牌总数
     * @param struc
     * @returns {number}
     */
    this.getCardSum = function (struc) {
        var len = struc.length;
        var res = 0;
        for (var i = 0; i < len; i ++) {
            res += struc[i].multi * struc[i].content.length;
        }
        return res;
    };

    /**
     * 求牌组(不识别拖拉机)中牌总数
     * @param struc
     * @returns {number}
     */
    this.getCardSumWithoutTractor = function getCardSumRaw(struc) {
        var len = struc.length;
        var res = 0;
        for (var i = 0; i < len; i ++) {
            res += struc[i].multi;
        }
        return res;
    };

    /**
     * 将结构化牌组转换成限制条件
     * @param target
     * @returns {{type: *, multi: *, length: *}}
     */
    this.structureToLimitation = function (target) {
        return {
            type: target.type,
            multi: target.multi,
            length: target.content.length
        };
    };

    /**
     * 判断首次出牌是否合理(返回并非boolean而是最终打出的牌)
     * @param played 打出的牌(raw)
     * @param inHands 其余玩家的手牌(raw)
     * @returns {*}
     */
    this.checkFirstPlayLegal = function (played, inHands) {
        var playerSumRemained = inHands.length;
        for (var i = 0; i < playerSumRemained; i ++) {
            var playedStructure = this.getCardStructure(played);
            // only 1 type should be contained
            var size = 0;
            for (var type in playedStructure) {
                playedStructure = playedStructure[type];
                size ++;
            }
            if (size != 1)
                return null;
            var structureLen = playedStructure.length;
            //非甩牌
            if (structureLen == 1)
                return played;
            playedStructure.sort(this.structureDesc);
            for (var j = 0; j < structureLen; j ++) {
                //这里的limitation已经是有序的了,因为structure和limitation的排序规则一致
                var limit = this.structureToLimitation(playedStructure[j]);
                var struInHand = this.getCardStructureWithoutTractor(inHands[i])[type];
                if (struInHand == null)
                    break;
                var matched = this.findStructure(struInHand, limit);
                if (matched == null)
                    continue;
                if (this.cardDesc(matched.content[0], playedStructure[j].content[0]) < 0) {
                    var res = [];
                    var multi = playedStructure[j].multi;
                    var len = playedStructure[j].content.length;
                    for (var k = 0; k < len; k ++)
                        for (var m = 0; m < multi; m ++)
                            res.push(playedStructure[j].content[k]);
                    return res;
                }
            }
        }
        return played;
    };

    /**
     * 判断非首次出牌是否合理
     * @param firstPlayed
     * @param played
     * @param inHand
     * @returns {boolean}
     */
    this.checkNotFirstPlayLegal = function (firstPlayed, played, inHand) {
        var limit = this.getLimitation(firstPlayed, inHand);
        return this.matchLimitation(played, limit);
    };

    /**
     * 判断现在出的牌是否会是最大的
     * 本轮第一个出的牌组必须作为输入,因为牌型是根据它确定的
     * @param firstPlayed
     * @param preMax
     * @param played
     * @returns {boolean}
     */
    this.cardGroupLargerThan = function (firstPlayed, preMax, played) {
        var firstPlayedStructure = this.getCardStructure(firstPlayed);
        for (var type in firstPlayedStructure)
            firstPlayedStructure = firstPlayedStructure[type];
        firstPlayedStructure.sort(this.structureDesc);
        var firstPlayedStrucLen = firstPlayedStructure.length;

        var playedStructureWithoutTractor = this.getCardStructureWithoutTractor(played);
        var size = 0;
        for (var type2 in playedStructureWithoutTractor) {
            size ++;
        }
        if (size != 1)
            return false;
        var preMaxStructureWithoutTractor = this.getCardStructureWithoutTractor(preMax);
        if (preMaxStructureWithoutTractor['M'] != null && playedStructureWithoutTractor['M'] == null)
            return false;
        if (preMaxStructureWithoutTractor['M'] == null && playedStructureWithoutTractor['M'] != null)
            return true;
        if (preMaxStructureWithoutTractor['M'] == null && playedStructureWithoutTractor['M'] == null) {
            if (playedStructureWithoutTractor[type] == null)
                return false;
        }
        //now assure both M or both first played type
        if (preMaxStructureWithoutTractor['M'] != null)
            type = 'M';
        preMaxStructureWithoutTractor = preMaxStructureWithoutTractor[type];
        playedStructureWithoutTractor = playedStructureWithoutTractor[type];
        for (var j = 0; j < firstPlayedStrucLen; j ++) {
            var limit = this.structureToLimitation(firstPlayedStructure[j]);
            var matched1 = this.findStructure(preMaxStructureWithoutTractor, limit);
            var matched2 = this.findStructure(playedStructureWithoutTractor, limit);
            if (matched2 == null)
                return false;
            if (this.cardDesc(matched1.content[0], matched2.content[0]) <= 0) //pre >= played
                return false;
            //只有单牌可能出现同大小,此时如果比原来的大了,之后再跟的单牌就不用判断
            if (limit.multi == 1)
                break;
        }
        return true;
    };

    /**
     * 获得跟牌的限制
     * @param played 打出的牌(raw)
     * @param inHand 当前玩家的手牌(raw)
     * @returns {*}
     */
    this.getLimitation = function (played, inHand) {

        // get structure
        var tmp = this.getCardStructure(played);
        for (var type in tmp)
            var playedStructure = tmp[type];
        playedStructure.sort(this.structureDesc);
        var tmp2 = this.getCardStructure(inHand);
        var inHandStructure = tmp2[type];
        var sum1 = this.getCardSum(playedStructure);

        var limitation = [];

        if (inHandStructure == null)
            return {
            sum: sum1,
            type: null,
            limitation: null
        };
        var sum2 = this.getCardSum(inHandStructure);


        while (playedStructure.length != 0) {
            inHandStructure.sort(this.structureDesc);
            var target = playedStructure.shift();
            var multi = target.multi;
            var tmpLen = target.content.length;
            if (multi == 1)
                break;
            if (target.type == 'tractor') {
                var res = this.matchTractor(inHandStructure, multi, tmpLen);
                if (res != -1) {
                    // tractor matched
                    if (res < tmpLen) {
                        for (var i = 0; i < res; i ++)
                            target.content.pop();
                        if (tmpLen - res == 1)
                            target.type = 'single';
                        playedStructure.push(target);
                        playedStructure.sort(this.structureDesc);
                    }
                    limitation.push({
                        type: 'tractor',
                        multi: multi,
                        length: res
                    });
                } else {
                    // no tractor matched
                    if (multi == 3) {
                        var res2 = this.matchTractor(inHandStructure, 2, tmpLen);
                        if (res2 != -1) {
                            if (res2 < tmpLen) {
                                for (var j = 0; j < res2; j ++)
                                    target.content.pop();
                                if (tmpLen - res == 1)
                                    target.type = 'single';
                                playedStructure.push(target);
                                playedStructure.sort(this.structureDesc);
                            }
                            limitation.push({
                                type: 'tractor',
                                multi: 2,
                                length: res2
                            });
                            continue;
                        }
                    }
                    for (var n = 0; n < tmpLen; n ++) {
                        playedStructure.push({
                            type: 'single',
                            multi: target.multi,
                            content: [target.content.pop()]
                        });
                    }
                    playedStructure.sort(this.structureDesc);
                }
            } else {
                // target is single type
                if (this.matchSingle(inHandStructure, multi)) {
                    limitation.push({
                        type: 'single',
                        multi: multi,
                        length: 1
                    });
                } else {
                    if (multi == 3 && this.matchSingle(inHandStructure, 2)) {
                        limitation.push({
                            type: 'single',
                            multi: 2,
                            length: 1
                        });
                    }
                }
            }
        }
        return {
            sum: sum1,
            sumInType: sum1 < sum2 ? sum1 : sum2,
            type: type,
            limitation: limitation
        };
    };

    /**
     * 判断打出的牌是否满足某一个限制,期间会改变cards
     * @param cards
     * @param limitation
     * @returns {*}
     */
    this.findStructure = function (cards, limitation) {
        var len = cards.length;
        for (var i = 0; i < len; i ++) {
            if (cards[i].multi >= limitation.multi) {
                var tmpLen = limitation.length;
                var flag = true;
                for (var j = 1; j < tmpLen; j ++) {
                    if (i + j == len) {
                        flag = false;
                        break;
                    }
                    if (this.cardScale(cards[i + j - 1].content) -
                        this.cardScale(cards[i + j].content) == 1) {
                        if (cards[i + j].multi < limitation.multi) {
                            flag = false;
                            break;
                        }
                    } else {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    var res = {type: limitation.type, multi: limitation.multi, content: []};
                    var off = 0;
                    for (var k = 0; k < tmpLen; k ++) {
                        res.content.push(cards[i + off].content);
                        if (cards[i + off].multi == limitation.multi) {
                            cards.splice(i + off, 1);
                        } else {
                            cards[i + off].multi -= limitation.multi;
                            off ++;
                        }
                    }
                    return res;
                }
            }
        }
        return null;
    };

    /**
     * 匹配所有的限制条件
     * @param played 打出的牌(raw)
     * @param limit
     * @returns {boolean}
     */
    this.matchLimitation = function (played, limit) {

        if (played.length != limit.sum)
            return false;
        if (limit.type == null) {
            return true;
        }
        var tmp = this.getCardStructureWithoutTractor(played);
        var playedStructure = tmp[limit.type];
        if (playedStructure == null)
            return false;
        var len = playedStructure.length;
        var sum = this.getCardSumWithoutTractor(playedStructure);
        if (sum != limit.sumInType)
            return false;
        limit.limitation.sort(this.limitationDesc);
        var len2 = limit.limitation.length;
        for (var i = 0; i < len2; i ++) {
            if (this.findStructure(playedStructure, limit.limitation[i]) == null)
                return false;
        }
        return true;
    };

    /**
     * 从手牌中取出满足限制条件的牌组,用于最简单的AI(自动出牌,只要合理即可)
     * @param inHand
     * @param limit
     */
    this.getCardsWithLimitation = function (inHand, limit) {
        var res = [];
        if (limit.type == null) {
            for (var i = 0; i < limit.sum; i ++)
                res.push(inHand[i]);
            return res;
        }
        var tmp = this.getCardStructureWithoutTractor(inHand);
        var inHandStructure = tmp[limit.type];
        limit.limitation.sort(this.limitationDesc);
        var len = limit.limitation.length;
        for (var i2 = 0; i2 < len; i2 ++) {
            var found = this.findStructure(inHandStructure, limit.limitation[i2]); //found shouldn't be null
            for (var j = 0; j < found.content.length; j ++) {
                for (var k = 0; k < found.multi; k ++)
                    res.push(found.content[j]);
            }
        }

        if (res.length < limit.sumInType) {
            var target = limit.sumInType - res.length;
            //随意地加一些牌进来
            for (var i3 = 0; i3 < inHandStructure.length; i3 ++) {
                for (var k2 = 0; k2 < inHandStructure[i3].multi; k2 ++) {
                    res.push(inHandStructure[i3].content);
                    if (-- target == 0)
                        break;
                }
                if (target == 0)
                    break;
            }
        }

        if (res.length < limit.sum) {
            var target2 = limit.sum - res.length;
            //加一些其他花色的牌进来
            for (var type in tmp) {
                if (type == limit.type)
                    continue;
                var cur = tmp[type];
                for (var i4 = 0; i4 < cur.length; i4 ++) {
                    for (var k3 = 0; k3 < cur[i4].multi; k3 ++) {
                        res.push(cur[i4].content);
                        if (-- target2 == 0)
                            break;
                    }
                    if (target2 == 0)
                        break;
                }
                if (target2 == 0)
                    break;
            }
        }
        return res;
    };

    /**
     * 获得牌组包含的分数
     * @param cards
     * @returns {number}
     */
    this.getPoints = function (cards) {
        var res = 0;
        var len = cards.length;
        for (var i = 0; i < len; i ++) {
            if (cards[i].number == 10 || cards[i].number == 13)
                res += 10;
            else if (cards[i].number == 5)
                res += 5;
        }
        return res;
    };
}

exports.CardUtil = CardUtil;
exports.CARD_TYPES = CARD_TYPES;
exports.CARD_COLORS = CARD_COLORS;