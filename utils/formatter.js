/**
 * Created by liboyuan on 16/9/9.
 */
exports.toPercentage = function(num){
    return (Math.round(num * 10000)/100).toFixed(2) + '%';
};

exports.toFloat = function (num) {
    return num.toFixed(2);
};