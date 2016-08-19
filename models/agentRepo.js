/**
 * Created by liboyuan on 16/8/11.
 */

var Agent = require("./agent");

var AgentRepo = {
    agents: []
};

AgentRepo.createAgent = function (userId) {
    var ret = new Agent.Agent(userId);
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

AgentRepo.findOrCreateAgentByUsername = function (username) {
    var len = AgentRepo.agents.length;
    for (var i = 0; i < len; i ++) {
        if (AgentRepo.agents[i].username == username)
            return AgentRepo.agents[i];
    }
    return this.createAgent(username);
};

module.exports = AgentRepo;