/**
 * Created by liboyuan on 16/8/11.
 */
var socket_io = require('socket.io');
var sessionMiddleware = require('../middleware');
var Property = require("../properties/property.js");
var Agent = require("../models/agent.js");

var AgentCommandType = {
    EnterTable: 1,
    LeaveTable: 2,
    Prepare:    3,
    UnPrepare:  4,
    InGame:     5,
    Disconnect: 6
};

socket_io.init = function (server) {
    //require can only be here since it's just a function called
    var AgentRepo = require('../models/agentRepo');
    function getAgent(socket) {
        if (socket.request.session.passport == null)
            return null;
        if (socket.request.session.passport.user == null)
            return null;
        return AgentRepo.findAgentByUsername(socket.request.session.passport.user);
    }

    socket_io.io = socket_io(server)
        .use(function(socket, next){
            // Wrap the express middleware
            sessionMiddleware(socket.request, {}, next);
        })
        .on('connection', function (socket) {

            function emitFail(msg) { socket.emit('fail', msg) }
            function emitErr(msg) { socket.emit('err', msg) }

            var agent = getAgent(socket);
            if (agent == null)
                return emitErr('找不到您的代理!');
            if (agent.currentTable == null)
                return emitErr('找不到您所在的桌子!');

            socket.on('disconnect', function () {
                socket_io.io.onDisconnect(agent, socket);
            });

            socket.on('command', function (command) {

                switch (command.type) {
                    case AgentCommandType.IntoTable:
                        socket_io.io.onIntoTable(agent, socket);
                        break;
                    case AgentCommandType.LeaveTable:
                        socket_io.io.onLeaveTable(agent, false, emitErr, emitFail);
                        break;
                    case AgentCommandType.Prepare:
                        socket_io.io.onPrepare(agent, emitErr, emitFail);
                        break;
                    case AgentCommandType.UnPrepare:
                        socket_io.io.onUnPrepare(agent, emitErr, emitFail);
                        break;
                    case AgentCommandType.InGame:
                        socket_io.io.onInGame(agent, emitErr, emitFail);
                        break;
                    default:
                        break;
                }
            });
        });

    socket_io.io.onDisconnect = function (agent, socket) {
        //如果是离开桌子后的正常退出,不应发送掉线事件
        if (agent.currentTable == null)
            return;
        var group = 'table_' + agent.currentTable.id;
        socket_io.io.in(group)
            .emit('event', {
                type: AgentCommandType.Disconnect,
                sid: agent.currentTable.agentToSid(agent),
                username: agent.username,
                eid: agent.currentTable.currentEventId ++
            });
        socket.leave(group);
    };

    socket_io.io.onEnterTable = function (agent) {
        var group = 'table_' + agent.currentTable.id;
        socket_io.io.in(group)
            .emit('event', {
                type: AgentCommandType.EnterTable,
                sid: agent.currentTable.agentToSid(agent),
                username: agent.username,
                eid: agent.currentTable.currentEventId ++
            });
        var table = agent.currentTable;
    };

    socket_io.io.onIntoTable = function (agent, socket) {
        //打开了网页
        socket.join('table_' + agent.currentTable.id);
    };

    socket_io.io.onLeaveTable = function (agent, force, err, fail) {
        var group = 'table_' + agent.currentTable.id;
        var table = agent.currentTable;
        var ret = {
            type: AgentCommandType.LeaveTable,
            sid: table.agentToSid(agent),
            username: agent.username,
            force: force
        };

        agent.leaveTable(fail, function () {
            // eid只能在成功以后自增
            ret.eid = table.currentEventId ++;
            socket_io.io.in(group)
                .emit('event', ret);
            //在大厅中的agent没有任何有用的状态信息,因此可以删除;此时当前访问还是拥有该agent的引用,所以还能找到
            AgentRepo.deleteAgentByUsername(agent.username);
        });
    };

    socket_io.io.onPrepare = function (agent, err, fail) {
        var group = 'table_' + agent.currentTable.id;
        agent.prepareForGame(fail, function () {
            socket_io.io.in(group)
                .emit('event', {
                    type: AgentCommandType.Prepare,
                    sid: agent.currentTable.agentToSid(agent),
                    username: agent.username,
                    eid: agent.currentTable.currentEventId ++
                })
        });
    };

    socket_io.io.onUnPrepare = function(agent, err, fail) {
        agent.unPrepareForGame(fail, function () {
            socket_io.io.in('table_' + agent.currentTable.id)
                .emit('event', {
                    type: AgentCommandType.UnPrepare,
                    sid: agent.currentTable.agentToSid(agent),
                    username: agent.username,
                    eid: agent.currentTable.currentEventId ++
                });
        });
    };

    socket_io.io.onInGame = function(agent, command, err, fail) {
        if (!command.content)
            return fail('似乎收到了错误的指令');
        agent.operateInGame(command.content.actionType, command.content.actionContent, fail, function (event) {
            var group = 'table_' + agent.currentTable.id;
            var table = agent.currentTable;
            socket_io.io.in('group')
                .emit('event', {
                    type: AgentCommandType.InGame,
                    content: event,
                    sid: table.agentToSid(agent),
                    username: agent.username,
                    eid: table.currentEventId ++
                });
        });
    };
};

module.exports = socket_io;