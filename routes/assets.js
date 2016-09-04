/**
 * Created by liboyuan on 16/9/4.
 */

var express = require('express');
var router = express.Router();
var passport = require('../passport');
var path = require('path');

router.get('/audios/default/:id',
    passport.isAuthenticated,
    function(req, res) {
        res.sendFile(path.join(__dirname, '../public/assets/audios/default/' + req.params.id + '.mp3'));
    }
);

module.exports = router;
