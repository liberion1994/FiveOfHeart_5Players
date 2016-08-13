/**
 * Created by liboyuan on 16/8/11.
 */

var socket_io = require('socket.io');
var sessionMiddleware = require('../middleware');

var agentRepo = require('../models/agentRepo');

function getAgent(socket) {
    if (socket.request.session.passport == null)
        return null;
    if (socket.request.session.passport.user == null)
        return null;
    return agentRepo.findAgentByUserId(
        socket.request.session.passport.user.id);
}

socket_io.prepareSocketIO = function (server) {
    socket_io.io = socket_io(server)
        .use(function(socket, next){
            // Wrap the express middleware
            sessionMiddleware(socket.request, {}, next);
        })
        .on('connection', function (socket) {
            socket.on('command', function (command) {
                switch (command.type) {
                    default:
                        break;
                }
            });
        });
};

module.exports = socket_io;