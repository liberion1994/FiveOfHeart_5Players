/**
 * Created by liboyuan on 16/8/11.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');

var UserSchema = mongoose.Schema({
    username: String,
    password: String,
    settings: {
        soundtrack: {type : String, default: "default"}

    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;