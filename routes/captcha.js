/**
 * Created by liboyuan on 16/8/12.
 */

var express = require('express');
var router = express.Router();
var ccap = require('ccap')();

router.get('/', function(req, res, next) {
    var ary = ccap.get();
    var txt = ary[0];
    var buf = ary[1];
    res.end(buf);
});

module.exports = router;