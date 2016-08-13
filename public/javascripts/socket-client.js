/**
 * Created by liboyuan on 16/8/11.
 */
var socket = io();

function emitCommand(commandType, error) {
    switch (commandType) {
        // the 'enter' command should not exist since it's conducted through http post
        case 'Prepare':
        case 'UnPrepare':
        case 'Leave':
            socket.emit('command', {
                type: commandType,
                content: null
            });
            break;
        case 'Init':
            //get table infomation and join socket.io group
            break;
        default:
            error('未知的指令类型!');
            break;

    }
}

function onNewEvent(event) {
    displayEvent(event);
}