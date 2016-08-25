/**
 * Created by liboyuan on 16/8/11.
 */
var socket_io = require('socket.io');
var sessionMiddleware = require('../middleware');
var agentRepo = require('../models/agentRepo');

var AgentCommandType = {
    IntoTable:  1,
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

            socket.eventId = 0;

            function emitFail(msg) { socket.emit('fail', msg) }
            function emitErr(msg) { socket.emit('err', msg) }

            var agent = getAgent(socket);
            if (agent == null)
                return emitErr('找不到您的代理!');
            if (agent.currentTable == null)
                return emitErr('找不到您所在的桌子!');
            var sid = agent.currentTable.agentToSid(agent);

            socket.on('disconnect', function () {

                //如果是离开桌子后的正常退出,不应发送掉线事件
                if (agent.currentTable == null)
                    return;
                socket_io.io.in('table_' + agent.currentTable.id)
                    .emit('event', {
                        type: AgentCommandType.Disconnect,
                        sid: sid,
                        username: agent.username,
                        eid: agent.currentTable.currentEventId ++
                    });
            });

            socket.on('command', function (command) {

                switch (command.type) {
                    case AgentCommandType.IntoTable:
                        //这里的enter更像是打开了那个网页,而加入本身在post的时候已经实现
                        socket.join('table_' + agent.currentTable.id);
                        socket_io.io.in('table_' + agent.currentTable.id)
                            .emit('event', {
                                type: AgentCommandType.IntoTable,
                                sid: sid,
                                username: agent.username,
                                eid: agent.currentTable.currentEventId ++
                            });
                        break;
                    case AgentCommandType.LeaveTable:
                        var group = 'table_' + agent.currentTable.id;
                        var ret = {
                            type: AgentCommandType.LeaveTable,
                            sid: sid,
                            username: agent.username,
                            eid: agent.currentTable.currentEventId ++
                        };
                        agent.leaveTable(emitFail, function () {
                            socket_io.io.in(group)
                                .emit('event', ret);
                            socket.leave(group);
                            //在大厅中的agent没有任何有用的状态信息,因此可以删除;此时当前访问还是拥有该agent的引用,所以还能找到
                            agentRepo.deleteAgentByUsername(agent.username);
                        });
                        break;
                    case AgentCommandType.Prepare:
                        agent.prepareForGame(emitFail, function () {
                            socket_io.io.in('table_' + agent.currentTable.id)
                                .emit('event', {
                                    type: AgentCommandType.Prepare,
                                    sid: sid,
                                    username: agent.username,
                                    eid: agent.currentTable.currentEventId ++
                                })
                        });
                        break;
                    case AgentCommandType.UnPrepare:
                        agent.unPrepareForGame(emitFail, function () {
                            socket_io.io.in('table_' + agent.currentTable.id)
                                .emit('event', {
                                    type: AgentCommandType.UnPrepare,
                                    sid: sid,
                                    username: agent.username,
                                    eid: agent.currentTable.currentEventId ++
                                })
                        });
                        break;
                    case AgentCommandType.InGame:
                        agent.operateInGame(command.content.actionType, command.content.actionContent, emitFail, function (event) {
                            socket_io.io.in('table_' + agent.currentTable.id)
                                .emit('event', {
                                    type: AgentCommandType.InGame,
                                    content: event,
                                    sid: sid,
                                    username: agent.username,
                                    eid: agent.currentTable.currentEventId ++
                                });
                        });
                        break;
                    default:
                        break;
                }
            });
        });
};

module.exports = socket_io;