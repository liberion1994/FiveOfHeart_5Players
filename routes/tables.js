/**
 * Created by liboyuan on 16/8/12.
 */

var express = require('express');
var router = express.Router();
var passport = require('../passport');
var TableRepo = require('../models/tableRepo');

router.get('/',
    passport.isAuthenticated,
    function(req, res) {
        res.render('tableList', {tables: TableRepo.getAllTables()});
    }
);

router.get('/:id',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        var tid = req.params.id;
        if (agent.currentTable == null || agent.currentTable.id != tid) {
            res.redirect('/');
        } else {
            res.render('test');
        }
    }
);

router.get('/current_table/info',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        var table = agent.currentTable;
        if (table == null) {
            res.end('您不在任何桌内');
        } else {
            res.send(table.tableInfo(agent));
        }
    }
);

router.get('/:id/seats',
    passport.isAuthenticated,
    function(req, res) {
        var tid = req.params.id;
        var table = TableRepo.findTableById(tid);
        if (table == null) {
            res.end('未找到该桌');
        } else {
            res.send(table.seatsInfo());
        }
    }
);

router.post('/:id',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        var tid = req.params.id;
        var sid = req.body.sid;
        if (tid == null || sid == null) {
            res.end('请求数据出错');
        } else {
            agent.enterTable(tid, sid, res.end, res.end);
        }
    }
);

module.exports = router;