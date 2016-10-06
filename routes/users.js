var express = require('express');
var router = express.Router();
var passport = require('../passport');
var agentRepo = require('../models/agentRepo');
var User = require('../daos/userDAO');
var validator = require('../utils/validator');
var Types = require("../properties/types");
var formatter = require("../utils/formatter");
var cipher = require("../cipher");

router.post('/login',
    function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (err) {
            return res.status(401).send('用户名或密码错误');
        } else if (!user) {
            return res.status(401).send('用户名或密码错误');
        }
        req.logIn(user, function (err) {
            if (err)
                return res.status(400).send('登录错误,请重试');
            return res.send({username: user.username, auth: cipher.cipher(user.username)});
        });
    })(req, res, next)}
);

router.post('/logout',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        if (agent.status == Types.AgentStatus.IN_GAME) {
            return res.status(400).send('您正在游戏中,无法登出');
        } else if (agent.status != Types.AgentStatus.HALL) {
            return res.status(400).send('您正在房间内,请先退出房间');
        }
        req.logOut();
        res.send({success: true});
    }
);

router.post('/register',
    function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (!validator.isUsername(username))
            return res.status(400).send('用户名不符合规范:' + validator.usernameReg);
        if (!validator.isPassword(password))
            return res.status(400).send('密码不符合规范:' + validator.passwordReg);
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return res.status(400).send('数据库访问出错,请重试');
            } else if (user) {
                return res.status(400).send('用户名已存在');
            }
            new User({
                username: username,
                password: password
            }).save();
            res.send({success: true});
        });

    }
);

router.get('/settings',
    passport.isAuthenticated,
    function(req, res) {
        var settings = req.user.settings;
        res.send(settings);
    }
);

router.post('/settings',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        var settings = req.user.settings;
        settings.soundtrack = req.body.soundtrack;

        var conditions = { username: agent.username }
            , update = { $set: { settings: settings }}
            , options = { multi: false };

        User.update(conditions, update, options, function () {
            res.render('settings', {username: agent.username, settings: settings});
        });
    }
);

router.get('/settings_page',
    passport.isAuthenticatedBackToLogin,
    function(req, res) {
        var agent = req.user.agent;
        var settings = req.user.settings;
        res.render('settings', {username: agent.username, settings: settings});
    }
);

router.get('/user_list',
    passport.isAuthenticatedBackToLogin,
    function(req, res) {
        User.find({}, function (err, users) {
            if (err) {
                res.status(400).send('无法获取用户列表');
            } else {
                var len = users.length;
                var arr = [];
                for (var i = 0; i < len; i ++) {
                    var username = users[i].username;
                    var agent = agentRepo.findAgentByUsername(username);
                    var status = '离线';
                    if (agent && new Date() - agent.activeDate <= 5 * 60 * 1000) {
                        if (agent.status == Types.AgentStatus.HALL)
                            status = '大厅';
                        else
                            status = '第' + agent.currentTable.id + '桌';
                    }
                    var info = {
                        username: users[i].username,
                        status: status,
                        majorNumber: formatter.numberToText(users[i].majorNumber)
                    };
                    var sta = users[i].getStatistics();
                    for (var type in sta)
                        info[type] = sta[type];
                    arr.push(info);
                }
                arr.sort(function (a, b) {
                    if (a.status == '离线' && b.status != '离线')
                        return 1;
                    if (b.status == '离线' && a.status != '离线')
                        return -1;
                    var tmp = b.score - a.score;
                    if (tmp != 0)
                        return tmp;
                    return parseFloat(b.winRate) - parseFloat(a.winRate);
                });
                agent = req.user.agent;
                res.render('users', {users: arr, username: agent.username});
            }

        });
    }
);

module.exports = router;
