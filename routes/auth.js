/**
 * Created by liboyuan on 16/9/10.
 */

var express = require('express');
var router = express.Router();
var passport = require('../passport');
var crypto = require('crypto');

var keys = {
    '57d3bb98': '37627291d209e7a5'
};

router.get('/:appid/:timestamp/:expires',
    passport.isAuthenticated,
    function(req, res) {
        var appid = req.params.appid;
        var timestamp = req.params.timestamp;
        var expires = parseInt(req.params.expires);
        var key = keys[appid];
        if (!key)
            return res.status(404).send('未找到对应的app');
        var md5 = crypto.createHash('md5');
        md5.update(appid + '&' + timestamp + '&' + expires + '&' + key, 'utf8');
        var str = md5.digest('hex');
        console.log(str);
        res.send(str);
    }
);

module.exports = router;