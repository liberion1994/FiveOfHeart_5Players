/**
 * Created by liboyuan on 16/8/11.
 */

function SocketClient() {
    this.socket = io();

    this.synchronizing = false;

    this.loadSettings = function (err, succ) {
        $.ajax({
            type: 'GET',
            url: '/users/settings',
            success: function (res) {
                succ(res);
            },
            error: function (msg) {
                err(msg);
            }
        });
    };

    this.getAllInfo = function (err, succ) {
        this.synchronizing = true;
        var _this = this;
        $.ajax({
            type: 'GET',
            url: '/tables/current_table/info',
            success: function (res) {
                _this.synchronizing = false;
                succ(res);
            },
            error: function (msg) {
                _this.synchronizing = false;
                err(msg);
            }
        });
    };

    this.getGameInfo = function (err, succ) {
        this.synchronizing = true;
        var _this = this;
        $.ajax({
            type: 'GET',
            url: '/tables/current_table/game/info',
            success: function (res) {
                _this.synchronizing = false;
                succ(res);
            },
            error: function (msg) {
                _this.synchronizing = false;
                err(msg);
            }
        });
    };

    this.getReservedCards = function (err, succ) {
        this.synchronizing = true;
        var _this = this;
        $.ajax({
            type: 'GET',
            url: '/tables/current_table/game/reserved_cards',
            success: function (res) {
                _this.synchronizing = false;
                succ(res);
            },
            error: function (msg) {
                _this.synchronizing = false;
                err(msg);
            }
        });
    };

    this.emitChatMessage = function (msg) {
        this.socket.emit('chat', msg);
    };

    this.emitBuiltInMessage = function (type) {
        this.socket.emit('built-in-message', type);
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
            case AgentCommandType.InGame:
                this.socket.emit('command', { type: commandType, content: commandContent });
                break;
            default:
                error('未知的指令类型!');
                break;
        }
    };

    var _this = this;

    this.socket.on('chat', function (chat) {
        if (settings.soundtrack != "none")
            playAudio('http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=' + chat.content);
        ui.displayChatContent(chat.sid, chat.content);
    });

    this.socket.on('audio', function (res) {
        if (settings.soundtrack == "none")
            return;
        playAudio("/assets/audios/" + settings.soundtrack + "/" + res.src);
    });

    this.socket.on('event', function (event) {

        if (_this.synchronizing)
            return;

        if (event.audioSrc && settings.soundtrack != "none") {
            playAudio("/assets/audios/" + settings.soundtrack + "/" + event.audioSrc);
        }
        if (event.eid != table.currentEventId ++) {reSync()}
        switch (event.type) {
            case AgentCommandType.IntoTable:
            case AgentCommandType.Disconnect:
                ui.logEvent(event);
                break;
            case AgentCommandType.EnterTable:
                table.onEnterTable(event);
                break;
            case AgentCommandType.Prepare:
                table.onPrepare(event);
                break;
            case AgentCommandType.UnPrepare:
                table.onUnPrepare(event);
                break;
            case AgentCommandType.LeaveTable:
                table.onLeaveTable(event);
                break;
            case AgentCommandType.InGame:
                table.onInGame(event);
                break;
        }
    });

    this.socket.on('err', function (msg) {
        notify(msg, 'error');
        reSync();
    });

    this.socket.on('fail', function (msg) {
        notify(msg, 'error');
    });

    this.socket.on('tick', function (msg) {
        updated = true;
        if (table.currentEventId != msg.eid) {reSync()}
        if (msg.consequence != 'idle')
            table.onTimerCountDown(msg.count);
    });
}






