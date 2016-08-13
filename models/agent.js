/**
 * Created by liboyuan on 16/8/11.
 */

var tableRepo = require('../models/tableRepo');

var AgentStatus = {
    HALL        : 1,
    UNPREPARED  : 2,
    PREPARED    : 3,
    IN_GAME     : 4
};

var Agent = function (userId) {
    this.userId = userId;
    this.status = AgentStatus.HALL;
    this.currentTable = null;

    this.activeDate = new Date().getTime();

    //TODO add log & update active date for each function

    this.enterTable = function (tid, sid, err) {
        if (this.status != AgentStatus.HALL)
            return err('You already in some table');
        var table = tableRepo.findTableById(tid);
        if (table == null)
            return err('Table not found');
        var _this = this;
        table.enterAgent(this, sid, err, function () {
            _this.status = AgentStatus.UNPREPARED;
            _this.currentTable = table;
        });
    };

    this.leaveTable = function (err) {
        if (this.status == AgentStatus.HALL)
            return err('You are not in the table');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        var _this = this;
        table.leaveAgent(this, err, function () {
            _this.status = AgentStatus.HALL;
            _this.currentTable = null;
        });
    };

    this.prepareForGame = function (err) {
        if (this.status != AgentStatus.UNPREPARED)
            return err('Failed to prepare');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        this.status = AgentStatus.PREPARED;
        table.checkGameStart(err, function () {});
    };

    this.unPrepareForGame = function (err) {
        if (this.status != AgentStatus.PREPARED)
            return err('Failed to unPrepare');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        this.status = AgentStatus.UNPREPARED;
        table.checkGameStart(err, function () {});
    };

    this.operateInGame = function (actionType, content, err) {
        if (this.status != AgentStatus.IN_GAME)
            return err('Not In Game');
        var table = this.currentTable;
        if (table == null)
            return err('Table not found');
        table.inGameOperation(this, actionType, content, err, function () {});
    };
};

exports.AgentStatus = AgentStatus;
exports.Agent = Agent;