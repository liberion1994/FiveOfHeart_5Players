/**
 * Created by Liberion on 2016/5/27.
 */

var Property = require('../properties/property');
var IoServer = require('../socket_io/socketIoServer');

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
        callback();
    };

    this.leaveAgent = function (agent, err, callback) {
        var sid = this.agentToSid(agent);
        if (sid >= Property.GamePlayers || sid < 0)
            return err('Seat not exists');
        if (this.status == TableStatus.GAMING)
            return err('Cannot leave in game');
        if (this.agents[sid] != agent)
            return err('Not your seat');
        this.agents[sid] = null;
        this.status = TableStatus.AVAILABLE;
        callback();
    };

    this.checkGameStart = function (err, callback) {
        if (this.status == TableStatus.AVAILABLE)
            return callback();
        for (var i = 0; i < Property.GamePlayers; i ++) {
            if (this.agents[i] == null)
                return callback();
        }
        //TODO emit update to clients
        callback();
    }
}

exports.TableStatus = TableStatus;
exports.Table = Table;