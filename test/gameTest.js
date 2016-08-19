/**
 * Created by liboyuan on 16/8/13.
 * 一个简单的shell,测试游戏逻辑
 * 测试的结果输出到GameTest.pdf
 */

var Game = require('../models/game');
var rl = require("readline");

var prompts = rl.createInterface(process.stdin, process.stdout);

var game = new Game.Game(null, 2);

function errLog(msg) {
    console.log('--[Error] ' + msg);
}


//TODO save the test result as GameTest.pdf

console.log('>>Input command here:');
prompts.on("line", function (inp) {
    var params = inp.split(' ');
    var cmd = params[0];
    if (cmd == 'p') {
        switch (params[1]) {
            case 'i':
                var infoSid = parseInt(params[2]);
                console.log(game.gameInfo(infoSid));
                break;
            case 't':
                console.log(game.currentTurn);
                break;
            case 'c':
                var cardSid = parseInt(params[2]);
                console.log(game.cards[cardSid]);
                break;
            case 'r':
                console.log(game.reservedCards);
                break;
            default:
                break;
        }
    } else if (cmd == 'a'){
        var sid = parseInt(params[1]);
        var action = parseInt(params[2]);
        switch (action) {
            case Game.GameStatus.OFFER_MAJOR_AMOUNT:
                game.onAction(sid, action, {sum: parseInt(params[3])}, errLog, function () {});
                break;
            case Game.GameStatus.CHOOSE_MAJOR_COLOR:
                game.onAction(sid, action, {color: params[3]}, errLog, function () {});
                break;
            case Game.GameStatus.RESERVE_CARDS:
                var cards = [];
                var len = params.length;
                for (var i = 3; i < len; i += 2)
                    cards.push({number : parseInt(params[i + 1]), color: params[i]});
                game.onAction(sid, action, {cards: cards}, errLog, function () {});
                break;
            case Game.GameStatus.CHOOSE_A_COLOR:
                game.onAction(sid, action, {color: params[3]}, errLog, function () {});
                break;
            case Game.GameStatus.PLAY_CARDS:
                var cards2 = [];
                var len2 = params.length;
                for (var i2 = 3; i2 < len2; i2 += 2)
                    cards2.push({number : parseInt(params[i2 + 1]), color: params[i2]});
                game.onAction(sid, action, {cards: cards2}, errLog, function () {});
                break;
            default:
                break;
        }
    } else if (cmd == 'r') {
        game = new Game.Game(null, 2);
    } else if (cmd == 'e') {
        process.exit();
        console.log('>>Test finished.');
        return;
    }
    console.log('>>Input command here:');
});