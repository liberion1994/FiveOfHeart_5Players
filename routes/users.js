var express = require('express');
var router = express.Router();
var passport = require('../passport');
var agentRepo = require('../models/agentRepo');
var User = require('../daos/userDAO');
var validator = require('../utils/validator');

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


module.exports = router;
