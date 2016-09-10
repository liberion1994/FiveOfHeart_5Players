/**
 * Created by liboyuan on 16/9/10.
 */

function playVoice(txt) {
    socketClient.getAuth(speechAppid, function (timestamp, expires) {
        var params = { "params" : "vcn = xiaoxin, spd = fast, vol = soft, tte = utf8, caller.appid="
        + speechAppid + ",timestamp=" + timestamp + ",expires=" + expires, "signature" : speechSignature, "gat" : "mp3"};
        speechSession.start(params, txt, function (err, obj) {
            if(err) {
                notify("语音合成发生错误，错误代码 ：" + err, 'error');
            } else {
                playAudio("http://webapi.openspeech.cn/" + obj.audio_url);
            }
        });
    });
}

function playAudio(src) {
    var div = $('#audio-player')
        .attr('src', src);
    div[0].play();
}