var express = require('express');
var router = express.Router();
var passport = require('../passport');

/* GET home page. */
router.get('/',
    passport.isNotAuthenticated,
    function(req, res) {
        res.render('index');
    }
);

router.get('/test',
    function(req, res) {
        res.render('test');
    }
);

module.exports = router;
