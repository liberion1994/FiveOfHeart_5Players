/**
 * Created by liboyuan on 16/8/11.
 */

var Agent = require('./agent');
var Property = require("../properties/property");
var logger = require("../log4js").getLogger('mem_watch');

var AgentRepo = {
    agents: []
};

AgentRepo.createAgent = function (user) {
    var ret = new Agent(user);
    AgentRepo.agents.push(ret);
    return ret;
};

AgentRepo.findAgentByUsername = function (username) {
    var len = AgentRepo.agents.length;
    for (var i = 0; i < len; i ++) {
        if (AgentRepo.agents[i].username == username)
            return AgentRepo.agents[i];
    }
    return null;
};

AgentRepo.deleteAgentByUsername = function (username) {
    var len = AgentRepo.agents.length;
    for (var i = 0; i < len; i ++) {
        if (AgentRepo.agents[i].username == username) {

            return;
        }
    }
};

AgentRepo.findOrCreateAgentByUser = function (user) {
    var len = AgentRepo.agents.length;
    for (var i = 0; i < len; i ++) {
        if (AgentRepo.agents[i].username == user.username)
            return AgentRepo.agents[i];
    }
    return this.createAgent(user);
};

/**
 * agentRepo长期持有agent引用，会导致内存泄漏，因此需要定时清理
 */
AgentRepo.init = function () {
    setInterval(function () {
        var cur = new Date();
        var len = AgentRepo.agents.length;
        var retrieved = 0;
        for (var i = 0; i < len; i ++) {
            if (cur - AgentRepo.agents[i].activeDate > Property.RetrieveTimeOut) {
                AgentRepo.agents.splice(i, 1);
                len --; i --; retrieved ++;
            }
        }
        logger.info('AgentRepo retrieves agents: ' + retrieved + ', remained: ' + AgentRepo.agents.length);
    }, Property.AgentRepoRetrieveTime);
};

module.exports = AgentRepo;
