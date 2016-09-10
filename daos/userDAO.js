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
    games += this.statistics.games.major;
    games += this.statistics.games.subMajor;
    games += this.statistics.games.slave;
    var wins = 0;
    wins += this.statistics.wins.major;
    wins += this.statistics.wins.subMajor;
    wins += this.statistics.wins.slave;
    var levelUps = 0;
    levelUps += this.statistics.levelUps.major;
    levelUps += this.statistics.levelUps.subMajor;
    levelUps += this.statistics.levelUps.slave;
    var points = 0;
    points += this.statistics.points.major;
    points += this.statistics.points.subMajor;
    points += this.statistics.points.slave;
    var fohIn = 0;
    fohIn += this.statistics.fohIn.major;
    fohIn += this.statistics.fohIn.subMajor;
    fohIn += this.statistics.fohIn.slave;
    var fohOut = 0;
    fohOut += this.statistics.fohOut.major;
    fohOut += this.statistics.fohOut.subMajor;
    fohOut += this.statistics.fohOut.slave;
    ret.score = this.statistics.score;
    ret.winRate = formatter.toPercentage(games != 0 ? wins / games : 0);
    ret.levelUpsPerGame = formatter.toFloat(games != 0 ? levelUps / games : 0);
    ret.pointsPerGame = formatter.toFloat(games != 0 ? points / games : 0);
    ret.fohInPerGame = formatter.toFloat(games != 0 ? fohIn / games : 0);
    ret.fohOutPerGame = formatter.toFloat(games != 0 ? fohOut / games : 0);
    return ret;
};

var User = mongoose.model('User', UserSchema);

module.exports = User;