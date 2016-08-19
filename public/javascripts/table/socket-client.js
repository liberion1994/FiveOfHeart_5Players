/**
 * Created by liboyuan on 16/8/11.
 */

function SocketClient() {
    this.socket = io();

    this.getAllInfo = function (err, succ) {
        $.ajax({
            type: 'GET',
            url: '/tables/current_table/info',
            success: function (res) {
                succ(res);
            },
            error: function (msg) {
                err(msg);
            }
        });
    };

    this.emitCommand = function (commandType, commandContent, error) {
        switch (commandType) {
            // the 'enter' command should not exist since it's conducted through http post
            case AgentCommandType.IntoTable:
            case AgentCommandType.Prepare:
            case AgentCommandType.UnPrepare:
            case AgentCommandType.LeaveTable:
                this.socket.emit('command', { type: commandType });
                break;

            default:
                error('未知的指令类型!');
                break;

        }
    };
    this.socket.on('event', function (event) {
        ui.displayEvent(event);
        //TODO reget all the info if eid not matched
        switch (event.type) {
            case AgentCommandType.IntoTable:
                //ui.playAnimation
                //controller.changeStatus
                //ui.update
                table.onIntoTable();
        }
    });

    this.socket.on('err', function (msg) {
        alert(msg);
    });
    this.emitCommand(AgentCommandType.IntoTable, null, function () {});
}






