var express = require('express');
var router = express.Router();
var passport = require('../passport');

router.post('/login',
    function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(err);
        }
        req.logIn(user, function (err) {
            if (err)
                return next(err);
            return res.end('success');
        });
    })(req, res, next)}
);

module.exports = router;
