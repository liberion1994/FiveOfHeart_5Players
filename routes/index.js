var express = require('express');
var router = express.Router();
var passport = require('../passport');

/* GET home page. */
router.get('/',
    passport.isNotAuthenticated,
    function(req, res) {
        res.render('login');
    }
);

router.get('/about',
    passport.isAuthenticatedBackToLogin,
    function(req, res) {
        var agent = req.user.agent;
        res.render('about', {username: agent.username});
    }
);

module.exports = router;
