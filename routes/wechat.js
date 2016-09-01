/**
 * Created by liboyuan on 16/9/1.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/',
    function(req, res) {
        var signature = req.query.signature;
        var timestamp = req.query.timestamp;
        var nonce = req.query.nonce;
        var echostr = req.query.echostr;
        var arr = [signature, timestamp, nonce];
        arr.sort();
        var str = crypto.createHash('sha1').update(arr.join('')).digest('hex');
        console.log(str + '\n' + signature);
        res.send(echostr);
    }
);

module.exports = router;
