/**
 * Created by liboyuan on 16/8/12.
 */

var express = require('express');
var router = express.Router();
var passport = require('../passport');
var TableRepo = require('../models/tableRepo');
var socket_io = require("../socket_io/socketIoServer");

router.get('/',
    passport.isAuthenticatedBackToLogin,
    function(req, res) {
        var agent = req.user.agent;
        if (agent.currentTable == null) {
            var ua = req.headers['user-agent'];
            res.render('tableList', {tables: TableRepo.getAllTablesInfo(), username: agent.username});
        }
        else
            res.redirect('/tables/' + agent.currentTable.id);
    }
);

router.get('/simple_info',
    passport.isAuthenticated,
    function(req, res) {
        res.send(TableRepo.getAllTablesInfo());
    }
);

router.get('/:id',
    passport.isAuthenticatedBackToLogin,
    function(req, res) {
        var ua = req.headers['user-agent'];
        var agent = req.user.agent;
        var tid = req.params.id;
        if (!agent.currentTable || agent.currentTable.id != tid) {
            res.redirect('/tables');
        } else {
            if (/mobile/i.test(ua)) {
                res.render('table', {tableId: tid});
            } else {
                res.render('table-pc', {tableId: tid});
            }
        }
    }
);

router.get('/current_table/info',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        var table = agent.currentTable;
        if (table == null) {
            res.status(400).send('您不在任何桌内');
        } else {
            res.send(table.tableInfo(agent));
        }
    }
);

router.get('/current_table/game/info',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        var table = agent.currentTable;
        if (table == null) {
            res.status(400).send('您不在任何桌内');
        } else if (table.game == null) {
            res.status(400).send('游戏尚未开始');
        } else {
            res.send(table.game.gameInfo(table.agentToSid(agent)));
        }
    }
);

router.get('/current_table/game/reserved_cards',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        var table = agent.currentTable;
        if (table == null) {
            res.status(400).eend('您不在任何桌内');
        } else if (table.game == null) {
            res.status(400).send('游戏尚未开始');
        } else {
            res.send(table.game.getReservedCards(table.agentToSid(agent)));
        }
    }
);

router.get('/:id/seats',
    passport.isAuthenticated,
    function(req, res) {
        var tid = req.params.id;
        var table = TableRepo.findTableById(tid);
        if (table == null) {
            res.status(400).send('未找到该桌');
        } else {
            res.send(table.seatsInfo());
        }
    }
);

module.exports = router;