/**
 * Created by Liberion on 2016/5/27.
 */

var Property = require('../properties/property');
var Game = require('./game');
var socket_io = require('../socket_io/socketIoServer');
var Types = require("../properties/types");
var logger = require("../log4js").getLogger('game');

function Table(id) {
    this.id = id;
    this.agents = new Array(Property.GamePlayers);
    this.game = null;
    this.currentEventId = 0;

    this.masterInGame = null;
    this.tableTimer = {
        currentCount: -1,
        restart: function (initCount, onCountDown, onTimeOut) {
            if (this.timer)
                clearInterval(this.timer);
            this.currentCount = initCount;
            var _this = this;
            this.timer = setInterval(function () {
                if (_this.currentCount > 0)
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
        var _this = this;
        var group = 'table_' + this.id;
        this.tableTimer.restart(-1, function () {
            socket_io.io.in(group).emit('tick',
                {consequence: 'idle', eid: _this.currentEventId});
        }, function () {});
        var noLeft = true;
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i])
                noLeft = false;
        }
        if (noLeft) {
            this.masterInGame = null;
            this.currentEventId = 0;
            this.tableTimer.stop();
        }
    };

    this.simpleInfo = function () {
        var agentsInfo = new Array(Property.GamePlayers);
        for (var i = 0; i < Property.GamePlayers; i ++)
            agentsInfo[i] = this.agents[i] ? this.agents[i].info : null;
        return {
            id: this.id,
            agents: agentsInfo,
            inGame: this.game ? true : false
        };
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
                res[i] = this.agents[i].info();
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
                        if (_this.agents[i] && _this.agents[i].status == Types.AgentStatus.UNPREPARED) {
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
            else if (this.agents[i].status != Types.AgentStatus.PREPARED)
                return callback();
        }
        var majorNum = this.agents[0].majorNumber;
        if (this.masterInGame != null)
            majorNum = this.agents[this.masterInGame].majorNumber;
        logger.info('<==Game Start==>');
        logger.info('players:');
        logger.info(JSON.stringify(this.wrappedSeatsInfo()));
        logger.info('----------------');
        this.game = new Game(this.masterInGame, majorNum);
        for (var j = 0; j < Property.GamePlayers; j ++)
            this.agents[j].status = Types.AgentStatus.IN_GAME;

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
         * 1.更新每家打的点数，包括其他数据
         * 2.确定下一句的庄家
         * 3.所有玩家状态变为未准备
         * 4.删除前一局游戏
         * 5.重新打开准备计时器
         */
        this.updateStatistics();
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
            this.agents[j].status = Types.AgentStatus.PREPARED;
            this.agents[j].unPrepareForGame(function () {}, function () {
                var group = 'table_' + _this.id;
                _this.tableTimer.restart(Property.NotPrepareOutTimeTableFullWithLastGameEnd,
                    function () {
                        socket_io.io.in(group).emit('tick',
                            {consequence: 'leave', count: _this.tableTimer.currentCount, eid: _this.currentEventId});
                    }, function () {
                        for (var i = 0; i < Property.GamePlayers; i++) {
                            if (_this.agents[i] && _this.agents[i].status == Types.AgentStatus.UNPREPARED) {
                                socket_io.io.onLeaveTable(_this.agents[i], true);
                            }
                        }
                    });
            });
        }

    };
    
    this.levelUp = function (sid, up) {
        for (var i = 0; i < up; i ++) {
            this.agents[sid].majorNumber ++;
            if (this.agents[sid].majorNumber == 3 || this.agents[sid].majorNumber == 5)
                this.agents[sid].majorNumber ++;
            if (this.agents[sid].majorNumber > 13)
                this.agents[sid].majorNumber -= 12;
        }
    };

    this.updateStatistics = function () {
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (i == this.game.masterSid) {
                this.agents[i].statistics.games.major ++;
                if (this.game.result.winners == '庄家') {
                    this.agents[i].statistics.wins.major ++;
                    this.agents[i].statistics.levelUps.major += this.game.result.levelUp;
                    if (this.game.subMasterSid != null)
                        this.agents[i].statistics.score += 3 + this.game.result.levelUp;
                    else
                        this.agents[i].statistics.score += 6 + 2 * this.game.result.levelUp;
                } else {
                    if (this.game.subMasterSid != null)
                        this.agents[i].statistics.score -= 3;
                    else
                        this.agents[i].statistics.score -= 6;
                }
                this.agents[i].statistics.points.major += this.game.points[i] +
                    this.game.result.fohIn[i] * 55;
                this.agents[i].statistics.fohIn.major += this.game.result.fohIn[i];
                this.agents[i].statistics.fohOut.major += this.game.result.fohOut[i];
            } else if (i == this.game.subMasterSid) {
                this.agents[i].statistics.games.subMajor ++;
                if (this.game.result.winners == '庄家') {
                    this.agents[i].statistics.wins.subMajor ++;
                    this.agents[i].statistics.levelUps.subMajor += this.game.result.levelUp;
                    this.agents[i].statistics.score += 3 + this.game.result.levelUp;
                } else {
                    this.agents[i].statistics.score -= 3;
                }
                this.agents[i].statistics.points.subMajor += this.game.points[i] +
                    this.game.result.fohIn[i] * 55;
                this.agents[i].statistics.fohIn.subMajor += this.game.result.fohIn[i];
                this.agents[i].statistics.fohOut.subMajor += this.game.result.fohOut[i];
            } else {
                this.agents[i].statistics.games.slave ++;
                if (this.game.result.winners == '闲家') {
                    this.agents[i].statistics.wins.slave ++;
                    this.agents[i].statistics.levelUps.slave += this.game.result.levelUp;
                    this.agents[i].statistics.score += 2 + 2 * this.game.result.levelUp;
                } else {
                    this.agents[i].statistics.score -= 2;
                }
                this.agents[i].statistics.points.slave += this.game.points[i] +
                    this.game.result.fohIn[i] * 55;
                this.agents[i].statistics.fohIn.slave += this.game.result.fohIn[i];
                this.agents[i].statistics.fohOut.slave += this.game.result.fohOut[i];
            }
            this.agents[i].statistics.score += this.game.result.fohIn[i];
            this.agents[i].statistics.score -= this.game.result.fohOut[i];
            this.agents[i].statistics.score ++;
        }
    }
}

module.exports = Table;
