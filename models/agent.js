/**
 * Created by liboyuan on 16/8/11.
 */

var tableRepo = require('./tableRepo');
var Property = require("../properties/property");
var socket_io = require("../socket_io/socketIoServer");
var User = require('../daos/userDAO');
var agentRepo = require("./agentRepo");
var Types = require("../properties/types");

var Agent = function (user) {
    this.username = user.username;
    this.majorNumber = user.majorNumber;
    this.status = Types.AgentStatus.HALL;
    this.currentTable = null;
    this.activeDate = new Date();
    this.statistics = user.statistics;

    var ref = this;
    this.leaveTimer = {
        currentCount: -1,
        restart: function () {
            if (this.timer)
                clearInterval(this.timer);
            this.currentCount = Property.NoValidActionOutTime;
            var _this = this;
            this.timer = setInterval(function () {
                if (_this.currentCount > 0)
                    _this.currentCount --;
                if (_this.currentCount == 0) {
                    clearInterval(_this.timer);
                    if (ref.status != Types.AgentStatus.HALL)
                        socket_io.io.onLeaveTable(ref, true);
                }
            }, 1000);
        },
        stop: function () {
            if (this.timer)
                clearInterval(this.timer);
            this.currentCount = -1;
        }
    };

    this.prepareTimer = {
        currentCount: -1,
        restart: function () {
            if (this.timer)
                clearInterval(this.timer);
            this.currentCount = Property.NotPrepareOutTime;
            var _this = this;
            this.timer = setInterval(function () {
                if (_this.currentCount > 0)
                    _this.currentCount --;
                if (_this.currentCount == 0) {
                    clearInterval(_this.timer);
                    socket_io.io.onLeaveTable(ref, true);
                }
            }, 1000);
        },
        stop: function () {
            if (this.timer)
                clearInterval(this.timer);
            this.currentCount = -1;
        }
    };

    this.info = function () {
        return {
            username: this.username,
            status: this.status,
            majorNumber: this.majorNumber,
            tableId: this.currentTable ? this.currentTable.id : null
        };
    };

    this.enterTable = function (tid, sid, err, callback) {
        if (this.status != Types.AgentStatus.HALL)
            return err('你已经坐在哪张桌子了吧');
        var table = tableRepo.findTableById(tid);
        if (table == null)
            return err('找不到这张桌子唉');
        var _this = this;
        table.enterAgent(this, sid, err, function () {
            _this.prepareTimer.restart();
            _this.leaveTimer.restart();
            _this.activeDate = new Date();
            _this.status = Types.AgentStatus.UNPREPARED;
            _this.currentTable = table;
            callback();
        });
    };

    this.leaveTable = function (err, callback) {
        if (this.status == Types.AgentStatus.HALL)
            return err('你现在没有在桌子上吧');
        var table = this.currentTable;
        if (table == null)
            return err('找不到这张桌子唉');
        var _this = this;
        table.leaveAgent(this, err, function () {
            _this.prepareTimer.stop();
            _this.leaveTimer.stop();
            _this.activeDate = new Date();
            _this.status = Types.AgentStatus.HALL;
            _this.currentTable = null;

            //save back should be conducted here
            var conditions = { username: _this.username }
                , update = { $set: { majorNumber: _this.majorNumber, statistics: _this.statistics }}
                , options = { multi: false };
            User.update(conditions, update, options, function () {
                callback();
            });

        });
    };

    this.prepareForGame = function (err, callback) {
        if (this.status != Types.AgentStatus.UNPREPARED)
            return err('现在这个状态没法准备呀');
        var table = this.currentTable;
        if (table == null)
            return err('找不到这张桌子唉');
        this.status = Types.AgentStatus.PREPARED;
        this.prepareTimer.stop();
        this.leaveTimer.restart();
        this.activeDate = new Date();
        table.checkGameStart(err, function () {
            callback();
        });
    };

    this.unPrepareForGame = function (err, callback) {
        if (this.status != Types.AgentStatus.PREPARED)
            return err('现在这个状态没法准备呀');
        var table = this.currentTable;
        if (table == null)
            return err('找不到这张桌子唉');
        this.status = Types.AgentStatus.UNPREPARED;
        var _this = this;
        this.prepareTimer.restart();
        this.leaveTimer.restart();
        this.activeDate = new Date();
        callback();
    };

    this.operateInGame = function (actionType, content, err, callback) {
        if (this.status != Types.AgentStatus.IN_GAME)
            return err('你是不是没在游戏中呢');
        var table = this.currentTable;
        if (table == null)
            return err('现在这个状态没法准备呀');
        var _this = this;
        table.inGameOperation(this, actionType, content, err, function (action) {
            _this.leaveTimer.restart();
            _this.activeDate = new Date();
            callback(action);
        });
    };

    this.leaveTimer.restart();
};

module.exports = Agent;