/**
 * Created by liboyuan on 16/8/13.
 */

require('should');
var tableRepo = require('../models/tableRepo');
var Agent = require('../models/agent');

tableRepo.init();

/**
 * tid: 0
 */
describe("Agent Enter Table", function() {
    it("Illegal tid", function() {
        var agent = new Agent.Agent(0);
        var errorMsg = 'No Error';
        function logError(msg) { errorMsg = msg; }
        agent.enterTable(-1, 0, logError);
        errorMsg.should.eql('Table not found');
        agent.status.should.eql(Agent.AgentStatus.HALL);
    });
    it("Illegal sid", function() {
        var agent = new Agent.Agent(0);
        var errorMsg = 'No Error';
        function logError(msg) { errorMsg = msg; }
        agent.enterTable(0, 5, logError);
        errorMsg.should.eql('Seat not exists');
        agent.status.should.eql(Agent.AgentStatus.HALL);
    });
    it("Wrong status", function() {
        var agent = new Agent.Agent(0);
        agent.status = Agent.AgentStatus.UNPREPARED;
        var errorMsg = 'No Error';
        function logError(msg) { errorMsg = msg; }
        agent.enterTable(0, 0, logError);
        errorMsg.should.eql('You already in some table');
    });
    it("Normal", function() {
        var agent = new Agent.Agent(0);
        var errorMsg = 'No Error';
        function logError(msg) { errorMsg = msg; }
        agent.enterTable(0, 0, logError);
        errorMsg.should.eql('No Error');
        agent.status.should.eql(Agent.AgentStatus.UNPREPARED);
    });
});


/**
 * tid: 1
 */
describe("Agent Leave Table", function() {
    it("Wrong status", function() {
        var agent = new Agent.Agent(0);
        var errorMsg = 'No Error';
        function logError(msg) { errorMsg = msg; }
        agent.leaveTable(logError);
        errorMsg.should.eql('You are not in the table');
    });
    it("Normal", function() {
        var agent = new Agent.Agent(0);
        var errorMsg = 'No Error';
        function logError(msg) { errorMsg = msg; }
        agent.enterTable(1, 0, logError);
        agent.leaveTable(logError);
        errorMsg.should.eql('No Error');
    });
});