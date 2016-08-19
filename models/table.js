/**
 * Created by Liberion on 2016/5/27.
 */

var Property = require('../properties/property');
var IoServer = require('../socket_io/socketIoServer');
var Game = require('./game');

var TableStatus = {
    AVAILABLE       : 1,
    TO_BE_STARTED   : 2,
    GAMING          : 3
};

function Table(id) {
    this.id = id;
    this.status = TableStatus.AVAILABLE;
    this.agents = new Array(Property.GamePlayers);
    this.game = null;
    this.currentEventId = 0;

    this.masterInGame = null;
    this.majorNumbersInGame = new Array(Property.GamePlayers);

    this.histories = [];

    this.log = function (content) {
        this.histories.push(content);
    };

    this.reset = function () {
        this.masterInGame = null;
        for (var i = 0; i < Property.GamePlayers; i ++)
            this.majorNumbersInGame[i] = Property.StartMajorNumber;
    };

    this.tableInfo = function (agent) {
        var sid = this.agentToSid(agent);
        return {
            id: this.id,
            status: this.status,
            currentSid: sid,
            seats: this.seatsInfo(),
            currentEventId: this.currentEventId,
            masterInGame: this.masterInGame,
            majorNumbersInGame: this.majorNumbersInGame,
            game: (this.game == null) ? null : this.game.gameInfo(sid)
        }
    };

    this.seatsInfo = function () {
        var res = [];
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == null) {
                res.push({available: true});
            } else {
                res.push({available: false, user: this.agents[i].username});
            }
        }
        return res;
    };

    this.reset();
    /**
     * agent to sid
     * @param agent
     * @returns {number} -1 if no such agent
     */
    this.agentToSid = function (agent) {
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == agent)
                return i;
        }
        return -1;
    };

    this.isFull = function () {
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == null)
                return false;
        }
        return true;
    };
    
    this.enterAgent = function (agent, sid, err, callback) {
        if (sid >= Property.GamePlayers || sid < 0)
            return err('Seat not exists');
        if (this.agents[sid] != null)
            return err('Seat already occupied');
        this.agents[sid] = agent;
        if (this.isFull())
            this.status = TableStatus.TO_BE_STARTED;
        this.log(agent.username + '加入了' + sid + '号座位');
        callback();
    };

    this.leaveAgent = function (agent, err, callback) {
        var sid = this.agentToSid(agent);
        if (sid >= Property.GamePlayers || sid < 0)
            return err('Seat not exists');
        if (this.status == TableStatus.GAMING)
            return err('Cannot leave in game');
        this.agents[sid] = null;
        this.status = TableStatus.AVAILABLE;
        this.reset();
        this.log(agent.username + '离开了' + sid + '号座位');
        callback();
    };

    this.checkGameStart = function (err, callback) {
        if (this.status == TableStatus.AVAILABLE)
            return callback();
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == null)
                return callback();
        }
        var majorNum = Property.StartMajorNumber;
        if (this.masterInGame != null)
            majorNum = this.majorNumbersInGame[this.masterInGame];
        this.game = new Game.Game(this.masterInGame, majorNum);

        callback();
    };

    this.inGameOperation = function (agent, actionType, content, err, callback) {
        var sid = this.agentToSid(agent);
        if (sid >= Property.GamePlayers || sid < 0)
            return err('Seat not exists');
        if (this.status != TableStatus.GAMING)
            return err('Game hasn\'t started');
        var _this = this;
        this.game.onAction(sid, actionType, content, err, function (action) {
            _this.log(agent.username + '做了' + actionType);
            //TODO if last round, should do something here(delete the game and display the sumup)
            callback(action);
        });
    };
}

exports.TableStatus = TableStatus;
exports.Table = Table;