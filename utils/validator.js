/**
 * Created by liboyuan on 16/8/26.
 */

var usernameReg = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9]{0,5}$/;
var passwordReg = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

module.exports = {
    usernameReg: usernameReg,
    passwordReg: passwordReg,
    isUsername: function(str) {
        return str && (typeof str === 'string') && usernameReg.test(str);
    },
    isPassword: function(str) {
        return str && (typeof str === 'string') && passwordReg.test(str);
    },
    isPhoneNumber: function(str) {
        return str && (typeof str === 'string') && /^[0-9\+]{3,20}$/.test(str);
    },
    isEmail: function(str) {
        return str && (typeof str === 'string') && /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(str);
    }
};
