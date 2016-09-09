/**
 * Created by liboyuan on 16/8/11.
 */

var mongoose = require('mongoose');
var formatter = require('../utils/formatter');
mongoose.connect('mongodb://localhost/users');

var UserSchema = mongoose.Schema({
    username: String,
    password: String,
    majorNumber: {type : Number, default: 2},
    statistics: {
        games: {
            major: {type: Number, default: 0},
            subMajor: {type: Number, default: 0},
            slave: {type: Number, default: 0}
        },
        wins: {
            major: {type: Number, default: 0},
            subMajor: {type: Number, default: 0},
            slave: {type: Number, default: 0}
        },
        levelUps: {
            major: {type: Number, default: 0},
            subMajor: {type: Number, default: 0},
            slave: {type: Number, default: 0}
        },
        points: {
            major: {type: Number, default: 0},
            subMajor: {type: Number, default: 0},
            slave: {type: Number, default: 0}
        },
        fohIn: {
            major: {type: Number, default: 0},
            subMajor: {type: Number, default: 0},
            slave: {type: Number, default: 0}
        },
        fohOut: {
            major: {type: Number, default: 0},
            subMajor: {type: Number, default: 0},
            slave: {type: Number, default: 0}
        },
        score: {type: Number, default: 0}
    },
    settings: {
        soundtrack: {type : String, default: "default"}
    }
});

UserSchema.methods.getStatistics = function () {
    var ret = {};
    var games = 0;
    for (var type in this.statistics.games)
        games += this.statistics.games[type];
    var wins = 0;
    for (var type in this.statistics.wins)
        wins += this.statistics.wins[type];
    var levelUps = 0;
    for (var type in this.statistics.levelUps)
        levelUps += this.statistics.levelUps[type];
    var points = 0;
    for (var type in this.statistics.points)
        points += this.statistics.points[type];
    var fohIn = 0;
    for (var type in this.statistics.fohIn)
        fohIn += this.statistics.fohIn[type];
    var fohOut = 0;
    for (var type in this.statistics.fohOut)
        fohOut += this.statistics.fohOut[type];
    ret.score = this.statistics.score;
    ret.winRate = formatter.toPercentage(games == 0 ? wins / games : 0);
    ret.levelUpsPerGame = games == 0 ? levelUps / games : 0;
    ret.pointsPerGame = games == 0 ? points / games : 0;
    ret.fohInPerGame = games == 0 ? fohIn / games : 0;
    ret.fohOutPerGame = games == 0 ? fohOut / games : 0;
    return ret;
};

var User = mongoose.model('User', UserSchema);

module.exports = User;