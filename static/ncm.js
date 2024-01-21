var enable = true

// 加载 ws 链接
var ws = new WebSocket("ws://localhost:2000/ncm")
ws.onerror = function(evt){
    console.log("连接到副屏服务器错误");
    enable = false
    ws = new WebSocket("ws://localhost:2000/ncm")
};
ws.onmessage = function(e) {
    data = e.data.split(";")
    switch (data[0]) {
        case "prev":
            // 上一首
            document.getElementsByClassName("cmd-icon-pre")[0].click()
            break
        case "next":
            // 下一首
            document.getElementsByClassName("cmd-icon-next")[0].click()
            break
        case "play":
            // 暂停 / 播放
            document.getElementsByClassName("playorPauseIconStyle_p1vrwawb")[0].click()
            break
        case "like":
            // 喜欢
            document.getElementById('page_pc_mini_bar').getElementsByClassName("cmd-icon-like")[0].click()
            break
        case "less":
            document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':40,'ctrlKey':true}));
            break
        case "more":
            document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':38,'ctrlKey':true}));
            break
    }
}
ws.onclose = function(e) {
    // 强制重连
    ws = new WebSocket("ws://localhost:2000/ncm")
}
var oldPlaying = -1
var oldTime = -1
var oldPlay = true
var oldPic = ""
var oldLyric = ""

var checkSong = function() {
    //nowID = betterncm.ncm.getPlaying().id
    nowID = getIDv2()
    if (oldPlaying != nowID) {
        oldPlaying = nowID
        ws.send("change;"+nowID)
    }
    
    //nowTime = betterncm.ncm.getPlayingSong().from.lastTime
    nowTime = getTimeV2()
    //console.log(nowTime)
    if (oldTime != nowTime) {
        oldTime = nowTime
        ws.send("time;"+nowTime)
    }

    nowPlay = (document.getElementsByClassName("cmd-assignedColor-icon icon IconStyle_icbceci")[0].getAttribute('title').indexOf("播放")==-1)
    if (oldPlay != nowPlay) {
        oldPlay = nowPlay
        ws.send("play;"+nowPlay)
    }

    da = document.getElementsByClassName("cmd-image")
    nowPic = da[da.length-1].src
    if (nowPic != oldPic) {
        oldPic = nowPic
        ws.send("pic;"+nowPic)
    }

    nowLyric = document.getElementsByClassName("current")[0].innerHTML.split('="vpjX51">')[1]
    nowLyric = nowLyric.replace("</p>","")
    if (nowLyric != oldLyric) {
        oldLyric = nowLyric
        ws.send("lyric;"+nowLyric)
    }
}


// 每 100ms 加载一遍歌
setInterval(() => {
    checkSong()
}, 100);

function getIDv2() {
    log = document.getElementById('page_pc_mini_bar').getAttribute('data-log')
    return parseInt(log.substring(log.indexOf('"s_cid":"')+'"s_cid":"'.length,log.indexOf('","s')))
}
function getTimeV2() {
    //style = document.getElementsByClassName('slider-default StyledSlider_smigcsb')[0].getAttribute('style')
    style = document.getElementsByClassName('slider-default styledSliderCls_smigcsb')[0].getAttribute('style')
    allTime = document.getElementsByClassName('miniBarTimeTextStyle_m1uuv23b')[0].innerHTML
    min = allTime.substring(0,allTime.indexOf(":"))
    sec = allTime.substring(allTime.indexOf(":")+1,allTime.length)
    time = parseInt(min)*60+parseInt(sec)
    return time
    return parseFloat(style.substring(style.indexOf('--smigcsb-0:"')+'--smigcsb-0:'.length,style.indexOf('%; --sm')))/100*time
}