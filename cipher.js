/**
 * Created by liboyuan on 2016/10/5.
 */
var crypto = require('crypto');

var exp = {
    key: '20120916'
};
exp.cipher = function (target) {
    var _cipher = crypto.createCipher('aes-256-cbc', exp.key);
    var ret = _cipher.update(target,'utf8','hex');
    ret += _cipher.final('hex');
    return ret;
};
exp.decipher = function (target) {
    var _decipher = crypto.createDecipher('aes-256-cbc', exp.key);
    var ret = _decipher.update(target,'hex','utf8');
    ret += _decipher.final('utf8');
    return ret;
};
module.exports = exp;