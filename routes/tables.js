/**
 * Created by liboyuan on 16/8/12.
 */

var express = require('express');
var router = express.Router();
var passport = require('../passport');

router.get('/',
    passport.isAuthenticated,
    function(req, res) {
        res.render('tableList');
    }
);

module.exports = router;