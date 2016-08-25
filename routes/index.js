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

router.get('/test2',
    function(req, res) {
        res.render('test2');
    }
);

router.get('/ui-test',
    function(req, res) {
        res.render('ui-test');
    }
);

module.exports = router;
