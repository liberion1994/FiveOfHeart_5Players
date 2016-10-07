/**
 * Created by liboyuan on 16/8/11.
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var User = require('./daos/userDAO');
var AgentRepo = require('./models/agentRepo');
var cipher = require("./cipher");

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            } else if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    // save what to identify the session
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    // get passport.user
    User.findOne({ username: username }, function(err, user) {
        user.agent = AgentRepo.findOrCreateAgentByUser(user);
        done(err, user);
    });
});

passport.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    var auth;
    if (req.method == "POST") {
        auth = req.body.auth;
    } else if (req.method == "GET") {
        auth = req.query.auth;
    }
    if (!auth) {
        return res.status(401).send({msg: '您尚未登录'});
    }
    var username = cipher.decipher(auth);
    User.findOne({ username: username }, function(err, user) {
        if (err) {
            return res.status(401).send({msg: '您尚未登录'});
        }
        user.agent = AgentRepo.findOrCreateAgentByUser(user);
        req.user = user;
        next();
    });
};

passport.isAuthenticatedBackToLogin = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
};

passport.isNotAuthenticated = function(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/tables');
};

module.exports = passport;