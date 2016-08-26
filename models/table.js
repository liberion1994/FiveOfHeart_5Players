/**
 * Created by Liberion on 2016/5/27.
 */

var Property = require('../properties/property');
var Game = require('./game');
var Agent = require('./agent');

function Table(id) {
    this.id = id;
    this.agents = new Array(Property.GamePlayers);
    this.game = null;
    this.currentEventId = 0;

    this.masterInGame = null;
    this.majorNumbersInGame = new Array(Property.GamePlayers);


    this.reset = function () {
        this.masterInGame = null;
        var noLeft = true;
        for (var i = 0; i < Property.GamePlayers; i ++) {
            this.majorNumbersInGame[i] = Property.StartMajorNumber;
            if (this.agents[i])
                noLeft = false;
        }
        if (noLeft)
            this.currentEventId = 0;
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
            //TODO if last round, should do something here(delete the game and display the sumup)
            if (_this.game.result) {
                /**
                 * 游戏结束:
                 * 1.更新每家打的点数
                 * 2.确定下一句的庄家
                 * 3.所有玩家状态变为为准备
                 * 4.删除前一局游戏
                 */
                if (_this.game.result.winners == '庄家') {
                    _this.levelUp(_this.game.masterSid, _this.game.result.levelUp);
                    if (_this.game.subMasterSid != null) {
                        _this.masterInGame = _this.game.subMasterSid;
                        _this.levelUp(_this.game.subMasterSid, _this.game.result.levelUp);
                    }
                    else
                        _this.masterInGame = _this.game.masterSid;
                } else {
                    var matched = false;
                    for (var i = 1; i < Property.GamePlayers; i ++) {
                        var tmpId = (_this.game.masterSid + i) % Property.GamePlayers;
                        if (_this.game.subMasterSid != tmpId) {
                            _this.levelUp(tmpId, _this.game.result.levelUp);
                            if (!matched) {
                                _this.masterInGame = tmpId;
                                matched = true;
                            }
                        }
                    }
                }
                _this.game = null;
                for (var j = 0; j < Property.GamePlayers; j ++)
                    _this.agents[j].status = Agent.AgentStatus.UNPREPARED;
            }
            callback(action);
        });
    };

    this.levelUp = function (sid, up) {
        for (var i = 0; i < up; i ++) {
            this.majorNumbersInGame[sid] ++;
            if (this.majorNumbersInGame[sid] == 3 || this.majorNumbersInGame[sid] == 5)
                this.majorNumbersInGame[sid] ++;
            if (this.majorNumbersInGame[sid] > 14)
                this.majorNumbersInGame[sid] -= 13;
        }
    }
}

exports.Table = Table;