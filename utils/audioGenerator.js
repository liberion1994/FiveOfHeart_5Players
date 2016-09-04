/**
 * Created by liboyuan on 16/9/4.
 */

exports.getEnterAudio = function (sid) {
    return 't0enter_' + sid;
};

exports.getLeaveAudio = function (sid) {
    return 't0leave_' + sid;
};

exports.getPrepareAudio = function (sid) {
    return 't0prepare_' + sid;
};

exports.getUnPrepareAudio = function (sid) {
    return 't0unprepare_' + sid;
};