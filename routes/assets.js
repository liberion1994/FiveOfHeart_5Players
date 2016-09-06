/**
 * Created by liboyuan on 16/9/4.
 */

var express = require('express');
var router = express.Router();
var passport = require('../passport');
var path = require('path');

var defaultBuiltIn = { '赞扬': 5, '惊愕': 6, '嘲讽': 3, '投降': 5 };

router.get('/audios/default/in_game/:id',
    passport.isAuthenticated,
    function(req, res) {
        res.sendFile(path.join(__dirname, '../public/assets/audios/default/in_game/' + req.params.id + '.mp3'));
    }
);

router.get('/audios/default/built_in_message/:id',
    passport.isAuthenticated,
    function(req, res) {
        var type = req.params.id;
        var sum = defaultBuiltIn[type];
        if (!sum) {
            res.status(404).end();
        } else {
            var random = Math.floor(Math.random() * sum + 1);
            res.sendFile(path.join(__dirname, '../public/assets/audios/default/built_in_message/' + type + random + '.mp3'));
        }
    }
);

module.exports = router;
