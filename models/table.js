/**
 * Created by Liberion on 2016/5/27.
 */

var Property = require('../properties/property');
var IoServer = require('../socket_io/socketIoServer');
var Game = require('./game');
var Agent = require('./agent');


function Table(id) {
    this.id = id;
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
            agentSid: sid,

            id: this.id,
            seats: this.wrappedSeatsInfo(),
            currentEventId: this.currentEventId,
            masterInGame: this.masterInGame,
            game: (this.game == null) ? null : this.game.gameInfo(sid)
        }
    };

    this.wrappedSeatsInfo = function () {
        var res = new Array(Property.GamePlayers);
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == null) {
                res[i] = null;
            } else {
                res[i] = {
                    user: this.agents[i].username,
                    majorNumberInGame: this.majorNumbersInGame[i],
                    status: this.agents[i].status
                };
            }
        }
        return res;
    };

    this.seatsInfo = function () {
        var res = [];
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == null) {
                res.push({user: null});
            } else {
                res.push({user: this.agents[i].username});
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
        this.log(agent.username + '加入了' + sid + '号座位');
        callback();
    };

    this.leaveAgent = function (agent, err, callback) {
        var sid = this.agentToSid(agent);
        if (sid >= Property.GamePlayers || sid < 0)
            return err('Seat not exists');
        if (this.game)
            return err('Cannot leave in game');
        this.agents[sid] = null;
        this.reset();
        this.log(agent.username + '离开了' + sid + '号座位');
        callback();
    };

    this.checkGameStart = function (err, callback) {
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == null)
                return callback();
            else if (this.agents[i].status != Agent.AgentStatus.PREPARED)
                return callback();
        }
        var majorNum = Property.StartMajorNumber;
        if (this.masterInGame != null)
            majorNum = this.majorNumbersInGame[this.masterInGame];
        this.game = new Game.Game(this.masterInGame, majorNum);
        for (var j = 0; j < Property.GamePlayers; j ++)
            this.agents[j].status = Agent.AgentStatus.IN_GAME;
        callback();
    };

    this.inGameOperation = function (agent, actionType, content, err, callback) {
        var sid = this.agentToSid(agent);
        if (sid >= Property.GamePlayers || sid < 0)
            return err('Seat not exists');
        if (!this.game)
            return err('Game hasn\'t started');
        var _this = this;
        this.game.onAction(sid, actionType, content, err, function (action) {
            _this.log(agent.username + '做了' + actionType);
            //TODO if last round, should do something here(delete the game and display the sumup)
            callback(action);
        });
    };
}

exports.Table = Table;