/**
 * Created by liboyuan on 16/8/13.
 */

var Game = require('../models/game');

describe("Game init", function() {
    it("Show game", function() {
        var game = new Game.Game(0, 2);
        console.log(game);
    });
});