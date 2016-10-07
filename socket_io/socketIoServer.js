/**
 * Created by liboyuan on 16/8/11.
 */
var socket_io = require('socket.io');
var sessionMiddleware = require('../middleware');
var Property = require("../properties/property.js");
var audioGenerator = require('../utils/audioGenerator');
var logger = require("../log4js").getLogger('socket_server');
var Types = require("../properties/types");
var cipher = require("../cipher");
var User = require('../daos/userDAO');

socket_io.init = function (server) {
    //require can only be here since it's just a function called
    var AgentRepo = require('../models/agentRepo');
    function getAgent(socket) {
        if (socket.request.session.passport == null)
            return null;
        if (socket.request.session.passport.user == null)
            return null;
        return AgentRepo.findOrCreateAgentByUser(socket.request.session.passport.user);
    }

    socket_io.io = socket_io(server)
        .on('connection', function (socket) {

            function emitFail(msg) { logger.error(msg); socket.emit('fail', msg) }
            function emitErr(msg) { logger.error(msg); socket.emit('err', msg) }

            console.log('conn');

            if (!socket.agent)
                socket.emit('auth', '需要身份验证');

            socket.on('auth', function (auth) {
                if (!auth) {
                    return socket.emit('auth_err', '身份验证无效，请重新登录');
                }
                var username = cipher.decipher(auth);
                User.findOne({ username: username }, function(err, user) {
                    if (err) {
                        return socket.emit('auth_err', '身份验证无效，请重新登录');
                    }
                    socket.agent = AgentRepo.findOrCreateAgentByUser(user);

                    if (socket.agent.currentTable) {
                        socket.join('table_' + socket.agent.currentTable.id);
                    }
                    socket.emit('auth_done', '身份验证成功');
                });
            });

            socket.on('disconnect', function () {
                if (!socket.agent)
                    return;
                socket_io.io.onDisconnect(socket.agent, socket);
            });

            socket.on('command', function (command) {
                if (!socket.agent)
                    return socket.emit('auth', '需要身份验证');
                var agent = socket.agent;
                logger.trace('Receive command from ' + agent.username);
                logger.info(command);
                switch (command.type) {
                    case Types.AgentCommandType.IntoTable:
                        socket_io.io.onIntoTable(agent, socket);
                        break;
                    case Types.AgentCommandType.EnterTable:
                        socket_io.io.onEnterTable(agent, command.content.tid, command.content.sid, emitErr, emitFail, socket);
                        break;
                    case Types.AgentCommandType.LeaveTable:
                        if (!socket.agent.currentTable )
                            return socket.emit('err', '大厅中无法进行此操作');
                        socket_io.io.onLeaveTable(agent, false, emitErr, emitFail);
                        break;
                    case Types.AgentCommandType.Prepare:
                        if (!socket.agent.currentTable )
                            return socket.emit('err', '大厅中无法进行此操作');
                        socket_io.io.onPrepare(agent, emitErr, emitFail);
                        break;
                    case Types.AgentCommandType.UnPrepare:
                        if (!socket.agent.currentTable )
                            return socket.emit('err', '大厅中无法进行此操作');
                        socket_io.io.onUnPrepare(agent, emitErr, emitFail);
                        break;
                    case Types.AgentCommandType.InGame:
                        if (!socket.agent.currentTable )
                            return socket.emit('err', '大厅中无法进行此操作');
                        socket_io.io.onInGame(agent, command, false, emitErr, emitFail);
                        break;
                    case Types.AgentCommandType.LeftTable:
                        socket.leave('table_' + command.content.tid);
                        break;
                    default:
                        break;
                }
            });

            socket.on('chat', function (content) {
                if (!socket.agent)
                    return socket.emit('auth', '需要身份验证');
                if (!socket.agent.currentTable)
                    return socket.emit('err', '大厅中无法进行此操作');
                var agent = socket.agent;
                if (content.length > Property.ChatContentLength)
                    return emitFail('发送的内容太长了啦');
                var cur = new Date();
                if (agent.lastChatDate && cur - agent.lastChatDate <= Property.ChatMinInterval)
                    return emitFail('发送得太频繁了啦');
                agent.lastChatDate = cur;
                var sid = agent.currentTable.agentToSid(agent);
                var group = 'table_' + agent.currentTable.id;
                socket_io.io.in(group)
                    .emit('chat', {
                        sid: sid,
                        content: content
                    });
            });

            socket.on('built-in-message', function (content) {
                if (!socket.agent)
                    return socket.emit('auth', '需要身份验证');
                if (!socket.agent.currentTable)
                    return socket.emit('err', '大厅中无法进行此操作');
                var agent = socket.agent;
                var found = false;
                var len = Property.BuiltInMessageTypes.length;
                for (var i = 0; i < len; i ++) {
                    if (content == Property.BuiltInMessageTypes[i]) {
                        found = true;
                        break;
                    }
                }

                if (!found)
                    return emitFail('未知的内置指令呢');
                var cur = new Date();
                if (agent.lastBuiltInMessageDate && cur - agent.lastBuiltInMessageDate <= Property.BuiltInMessageMinInterval)
                    return emitFail('发送得太频繁了啦');
                agent.lastBuiltInMessageDate = cur;

                var sid = agent.currentTable.agentToSid(agent);
                var group = 'table_' + agent.currentTable.id;
                socket_io.io.in(group)
                    .emit('built_in_message', {
                        sid: sid,
                        type: content
                    });
            });
        });

    socket_io.io.onDisconnect = function (agent, socket) {
        //如果是离开桌子后的正常退出,不应发送掉线事件
        if (agent.currentTable == null)
            return;
        var group = 'table_' + agent.currentTable.id;
        socket_io.io.in(group)
            .emit('event', {
                type: Types.AgentCommandType.Disconnect,
                sid: agent.currentTable.agentToSid(agent),
                username: agent.username,
                eid: agent.currentTable.currentEventId ++
            });
        socket.leave(group);

        logger.trace('Response: Disconnect');
    };

    socket_io.io.onEnterTable = function (agent, tid, sid, err, fail, socket) {
        agent.enterTable(tid, sid, fail, function () {
            var group = 'table_' + tid;
            socket.join(group);
            socket_io.io.in(group)
                .emit('event', {
                    type: Types.AgentCommandType.EnterTable,
                    sid: sid,
                    majorNumber: agent.majorNumber,
                    username: agent.username,
                    eid: agent.currentTable.currentEventId ++,
                    audioSrc: audioGenerator.getEnterAudio()
                });
            logger.trace('Response: EnterTable');
        });


    };

    socket_io.io.onLeaveTable = function (agent, force, err, fail) {
        var table = agent.currentTable;
        if (!table)
            return err('找不到这张桌子唉');
        var group = 'table_' + table.id;
        var sid = table.agentToSid(agent);
        var ret = {
            type: Types.AgentCommandType.LeaveTable,
            sid: sid,
            tid: table.id,
            username: agent.username,
            force: force,
            audioSrc: audioGenerator.getLeaveAudio()
        };

        agent.leaveTable(fail, function () {
            // eid只能在成功以后自增
            ret.eid = table.currentEventId ++;
            socket_io.io.in(group)
                .emit('event', ret);
            logger.trace('Response: LeaveTable');
        });
    };

    socket_io.io.onPrepare = function (agent, err, fail) {
        var group = 'table_' + agent.currentTable.id;
        var sid = agent.currentTable.agentToSid(agent);
        agent.prepareForGame(fail, function () {
            socket_io.io.in(group)
                .emit('event', {
                    type: Types.AgentCommandType.Prepare,
                    sid: sid,
                    username: agent.username,
                    eid: agent.currentTable.currentEventId ++,
                    audioSrc: audioGenerator.getPrepareAudio()
                });
            console.log('prepare');
            logger.trace('Response: Prepare');
        });
    };

    socket_io.io.onUnPrepare = function(agent, err, fail) {
        var sid = agent.currentTable.agentToSid(agent);
        agent.unPrepareForGame(fail, function () {
            socket_io.io.in('table_' + agent.currentTable.id)
                .emit('event', {
                    type: Types.AgentCommandType.UnPrepare,
                    sid: sid,
                    username: agent.username,
                    eid: agent.currentTable.currentEventId ++,
                    audioSrc: audioGenerator.getUnPrepareAudio()
                });
            logger.trace('Response: UnPrepare');
        });
    };

    socket_io.io.onInGame = function(agent, command, force, err, fail) {
        if (!command.content)
            return fail('似乎收到了错误的指令');
        agent.operateInGame(command.content.actionType, command.content.actionContent, fail, function (event) {
            var group = 'table_' + agent.currentTable.id;
            var table = agent.currentTable;
            socket_io.io.in(group)
                .emit('event', {
                    type: Types.AgentCommandType.InGame,
                    content: event,
                    sid: table.agentToSid(agent),
                    username: agent.username,
                    force: force,
                    eid: table.currentEventId ++,
                    audioSrc: audioGenerator.getInGameAudio(event, table.game)
                });

            logger.trace('Response: InGame');
            logger.info(event);
        });
    };
};

module.exports = socket_io;