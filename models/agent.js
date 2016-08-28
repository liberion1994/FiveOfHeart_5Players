/**
 * Created by liboyuan on 16/8/11.
 */

//TODO 把所有的枚举变量放到一个外部文件方便操作

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

    this.prepareTimer = {
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

    this.enterTable = function (tid, sid, err, callback) {
        if (this.status != AgentStatus.HALL)
            return err('You already in some table');
        var table = tableRepo.findTableById(tid);
        if (table == null)
            return err('Table not found');
        var _this = this;
        table.enterAgent(this, sid, err, function () {
            _this.prepareTimer.restart(Property.NotPrepareOutTime, function () {},
                function () {socket_io.io.onLeaveTable(_this, true)});
            _this.status = AgentStatus.UNPREPARED;
            _this.currentTable = table;
            callback();
        });
    };

    this.leaveTable = function (err, callback) {
        if (this.status == AgentStatus.HALL)
            return err('You are not in the table');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        var _this = this;
        table.leaveAgent(this, err, function () {
            _this.prepareTimer.stop();
            _this.status = AgentStatus.HALL;
            _this.currentTable = null;
            callback();
        });
    };

    this.prepareForGame = function (err, callback) {
        if (this.status != AgentStatus.UNPREPARED)
            return err('Failed to prepare');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        this.status = AgentStatus.PREPARED;
        this.prepareTimer.stop();
        table.checkGameStart(err, function () {
            callback();
        });
    };

    this.unPrepareForGame = function (err, callback) {
        if (this.status != AgentStatus.PREPARED)
            return err('Failed to unPrepare');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        this.status = AgentStatus.UNPREPARED;
        var _this = this;
        this.prepareTimer.restart(Property.NotPrepareOutTime, function () {},
            function () {socket_io.io.onLeaveTable(_this, true)});
        callback();
    };

    this.operateInGame = function (actionType, content, err, callback) {
        if (this.status != AgentStatus.IN_GAME)
            return err('Not In Game');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        table.inGameOperation(this, actionType, content, err, function (action) {
            callback(action);
        });
    };
};

exports.AgentStatus = AgentStatus;
exports.Agent = Agent;