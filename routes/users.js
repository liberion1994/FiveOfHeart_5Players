var express = require('express');
var router = express.Router();
var passport = require('../passport');
var agentRepo = require('../models/agentRepo');
var User = require('../daos/userDAO');
var validator = require('../utils/validator');
var Agent = require("../models/agent");

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
            return res.end('success');
        });
    })(req, res, next)}
);

router.post('/logout',
    passport.isAuthenticated,
    function(req, res) {
        var agent = req.user.agent;
        if (agent.status == Agent.AgentStatus.IN_GAME) {
            return res.status(400).send('您正在游戏中,无法登出');
        } else if (agent.status != Agent.AgentStatus.HALL) {
            return res.status(400).send('您正在房间内,请先退出房间');
        }
        req.logOut();
        res.end('success');
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
            res.end('success');
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

module.exports = router;
