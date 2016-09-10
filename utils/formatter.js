/**
 * Created by liboyuan on 16/9/9.
 */
exports.toPercentage = function(num){
    return (Math.round(num * 10000)/100).toFixed(2) + '%';
};

exports.toFloat = function (num) {
    return num.toFixed(2);
};

exports.numberToText = function (num) {
    switch (num) {
        case 11: num = 'J'; break;
        case 12: num = 'Q'; break;
        case 13: num = 'K'; break;
        case 14: num = 'A'; break;
        default: break;
    }
    return num;
};