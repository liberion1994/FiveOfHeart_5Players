/**
 * Created by liboyuan on 16/8/11.
 */

var tableRepo = require('./tableRepo');
var Property = require("../properties/property");
var socket_io = require("../socket_io/socketIoServer");

var AgentStatus = {
    HALL        : 1,
    UNPREPARED  : 2,
    PREPARED    : 3,
    IN_GAME     : 4
};

var Agent = function (username) {
    this.username = username;
    this.status = AgentStatus.HALL;
    this.currentTable = null;

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
            status: this.status
        };
    };

    this.enterTable = function (tid, sid, err, callback) {
        if (this.status != AgentStatus.HALL)
            return err('你已经坐在哪张桌子了吧,刷新试试');
        var table = tableRepo.findTableById(tid);
        if (table == null)
            return err('找不到这张桌子唉');
        var _this = this;
        table.enterAgent(this, sid, err, function () {
            _this.prepareTimer.restart();
            _this.leaveTimer.restart();
            _this.status = AgentStatus.UNPREPARED;
            _this.currentTable = table;
            callback();
        });
    };

    this.leaveTable = function (err, callback) {
        if (this.status == AgentStatus.HALL)
            return err('你现在没有在桌子上吧');
        var table = this.currentTable;
        if (table == null)
            return err('找不到这张桌子唉');
        var _this = this;
        table.leaveAgent(this, err, function () {
            _this.prepareTimer.stop();
            _this.leaveTimer.stop();
            _this.status = AgentStatus.HALL;
            _this.currentTable = null;
            callback();
        });
    };

    this.prepareForGame = function (err, callback) {
        if (this.status != AgentStatus.UNPREPARED)
            return err('现在这个状态没法准备呀');
        var table = this.currentTable;
        if (table == null)
            return err('找不到这张桌子唉');
        this.status = AgentStatus.PREPARED;
        this.prepareTimer.stop();
        this.leaveTimer.restart();
        table.checkGameStart(err, function () {
            callback();
        });
    };

    this.unPrepareForGame = function (err, callback) {
        if (this.status != AgentStatus.PREPARED)
            return err('现在这个状态没法准备呀');
        var table = this.currentTable;
        if (table == null)
            return err('找不到这张桌子唉');
        this.status = AgentStatus.UNPREPARED;
        var _this = this;
        this.prepareTimer.restart();
        this.leaveTimer.restart();
        callback();
    };

    this.operateInGame = function (actionType, content, err, callback) {
        if (this.status != AgentStatus.IN_GAME)
            return err('你是不是没在游戏中呢');
        var table = this.currentTable;
        if (table == null)
            return err('现在这个状态没法准备呀');
        var _this = this;
        table.inGameOperation(this, actionType, content, err, function (action) {
            _this.leaveTimer.restart();
            callback(action);
        });
    };
};

exports.AgentStatus = AgentStatus;
exports.Agent = Agent;