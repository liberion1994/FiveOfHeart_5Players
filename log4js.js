/**
 * Created by liboyuan on 16/8/29.
 */
var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'dateFile',
            filename: __dirname + '/logs/socket_server.log',
            category: 'socket_server',
            pattern: "-yyyy-MM-dd",
            alwaysIncludePattern: false
        }, {
            type: 'dateFile',
            filename: __dirname + '/logs/mem_watch.log',
            category: 'mem_watch',
            pattern: "-yyyy-MM-dd",
            alwaysIncludePattern: false
        }
    ]
});

module.exports = log4js;