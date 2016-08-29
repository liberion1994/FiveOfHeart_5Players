/**
 * Created by Liberion on 2016/5/27.
 */

var Property = require('../properties/property');
var Game = require('./game');
var Agent = require('./agent');
var socket_io = require('../socket_io/socketIoServer');

function Table(id) {
    this.id = id;
    this.agents = new Array(Property.GamePlayers);
    this.game = null;
    this.currentEventId = 0;

    this.masterInGame = null;
    this.majorNumbersInGame = new Array(Property.GamePlayers);

    this.tableTimer = {
        currentCount: -1,
        restart: function (initCount, onCountDown, onTimeOut) {
            if (this.timer)
                clearInterval(this.timer);
            this.currentCount = initCount;
            var _this = this;
            this.timer = setInterval(function () {
                _this.currentCount --;
                onCountDown();
                if (_this.currentCount == 0) {
                    clearInterval(_this.timer);
                    if (onTimeOut)
                        onTimeOut();
                }
            }, 1000);
        },
        stop: function () {
            if (this.timer)
                clearInterval(this.timer);
            this.currentCount = -1;
        }
    };

    this.isFull = function () {
        for (var i = 0; i < Property.GamePlayers; i ++)
            if (!this.agents[i])
                return false;
        return true;
    };

    this.reset = function () {
        this.masterInGame = null;
        var _this = this;
        var group = 'table_' + this.id;
        this.tableTimer.restart(-1, function () {
            socket_io.io.in(group).emit('tick',
                {consequence: 'idle', eid: _this.currentEventId});
        }, function () {});
        var noLeft = true;
        for (var i = 0; i < Property.GamePlayers; i ++) {
            this.majorNumbersInGame[i] = Property.StartMajorNumber;
            if (this.agents[i])
                noLeft = false;
        }
        if (noLeft) {
            this.currentEventId = 0;
            this.tableTimer.stop();
        }
    };

    this.tableInfo = function (agent) {
        var sid = this.agentToSid(agent);
        return {
            agentSid: sid,

            id: this.id,
            seats: this.wrappedSeatsInfo(),
            currentEventId: this.currentEventId,
            masterInGame: this.masterInGame,
            game: (this.game == null) ? null : this.game.gameInfo(sid),

            timerCount: this.tableTimer.currentCount
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
    
    this.enterAgent = function (agent, sid, err, callback) {
        if (sid >= Property.GamePlayers || sid < 0)
            return err('Seat not exists');
        if (this.agents[sid] != null)
            return err('Seat already occupied');
        this.agents[sid] = agent;
        var _this = this;
        var group = 'table_' + this.id;
        if (this.isFull()) {
            this.tableTimer.restart(Property.NotPrepareOutTimeTableFull,
                function () {
                    socket_io.io.in(group).emit('tick',
                        {consequence: 'leave', count: _this.tableTimer.currentCount, eid: _this.currentEventId});
                }, function () {
                    for (var i = 0; i < Property.GamePlayers; i ++) {
                        if (_this.agents[i] && _this.agents[i].status == Agent.AgentStatus.UNPREPARED) {
                            socket_io.io.onLeaveTable(_this.agents[i], true);
                        }
                    }
                });
        } else {
            this.tableTimer.restart(-1, function () {
                socket_io.io.in(group).emit('tick',
                    {consequence: 'idle', eid: _this.currentEventId});
            }, function () {});
        }
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

        var group = 'table_' + this.id;
        var _this = this;
        this.tableTimer.restart(Property.InGameTime,
            function () {
                socket_io.io.in(group).emit('tick',
                    {consequence: 'auto_play', count: _this.tableTimer.currentCount, eid: _this.currentEventId});
            }, function () {
                var agent = _this.agents[_this.game.currentTurn.remainedSid[0]];
                var actionType = _this.game.currentTurn.status;
                var actionContent =  _this.game.autoPlayer.makeAction();
                var command = {
                    content: {
                        actionType: actionType,
                        actionContent: actionContent
                    }
                };
                socket_io.io.onInGame(agent, command, true, function () {}, function () {});
            });

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
            if (_this.game.result) {
                _this.onGameEnd();
            } else {
                //TODO 这里可以判断一下是否最后一轮,然后自动出牌
                var group = 'table_' + _this.id;
                _this.tableTimer.restart(Property.InGameTime,
                    function () {
                        socket_io.io.in(group).emit('tick',
                            {consequence: 'auto_play', count: _this.tableTimer.currentCount, eid: _this.currentEventId});
                    }, function () {
                        var agent = _this.agents[_this.game.currentTurn.remainedSid[0]];
                        var actionType = _this.game.currentTurn.status;
                        var actionContent =  _this.game.autoPlayer.makeAction();
                        var command = {
                            content: {
                                actionType: actionType,
                                actionContent: actionContent
                            }
                        };
                        socket_io.io.onInGame(agent, command, true, function () {}, function () {});
                    });

            }
            callback(action);
        });
    };

    this.onGameEnd = function () {
        /**
         * 游戏结束:
         * 1.更新每家打的点数
         * 2.确定下一句的庄家
         * 3.所有玩家状态变为为准备
         * 4.删除前一局游戏
         * 5.重新打开准备计时器
         */
        if (this.game.result.winners == '庄家') {
            this.levelUp(this.game.masterSid, this.game.result.levelUp);
            if (this.game.subMasterSid != null) {
                this.masterInGame = this.game.subMasterSid;
                this.levelUp(this.game.subMasterSid, this.game.result.levelUp);
            } else {
                this.masterInGame = this.game.masterSid;
            }
        } else {
            var matched = false;
            for (var i = 1; i < Property.GamePlayers; i ++) {
                var tmpId = (this.game.masterSid + i) % Property.GamePlayers;
                if (this.game.subMasterSid != tmpId) {
                    this.levelUp(tmpId, this.game.result.levelUp);
                    if (!matched) {
                        this.masterInGame = tmpId;
                        matched = true;
                    }
                }
            }
        }
        this.game = null;
        var _this = this;
        for (var j = 0; j < Property.GamePlayers; j ++) {
            //不准备的话原则上不让取消准备,所以这里这么操作
            this.agents[j].status = Agent.AgentStatus.PREPARED;
            this.agents[j].unPrepareForGame(function () {}, function () {
                var group = 'table_' + _this.id;
                _this.tableTimer.restart(Property.NotPrepareOutTimeTableFullWithLastGameEnd,
                    function () {
                        socket_io.io.in(group).emit('tick',
                            {consequence: 'leave', count: _this.tableTimer.currentCount, eid: _this.currentEventId});
                    }, function () {
                        for (var i = 0; i < Property.GamePlayers; i++) {
                            if (_this.agents[i] && _this.agents[i].status == Agent.AgentStatus.UNPREPARED) {
                                socket_io.io.onLeaveTable(_this.agents[i], true);
                            }
                        }
                    });
            });
        }

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