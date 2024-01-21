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
            document.getElementsByClassName("btnc-prv")[0].click()
            break
        case "next":
            // 下一首
            document.getElementsByClassName("btnc-nxt")[0].click()
            break
        case "play":
            // 暂停 / 播放
            document.getElementsByClassName("btnp f-cp")[0].click()
            break
        case "like":
            // 喜欢
            document.getElementsByClassName("icn icn-first f-cp")[0].click()
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
    ws = new WebSocket("ws://localhost:15155/ncm")
}
var oldPlaying = -1
var oldTime = -1
var oldPlay = true

var checkSong = function() {
    nowID = betterncm.ncm.getPlaying().id
    if (oldPlaying != nowID) {
        oldPlaying = nowID
        ws.send("change;"+nowID)
    }
    
    nowTime = betterncm.ncm.getPlayingSong().from.lastTime
    if (oldTime != nowTime) {
        oldTime = nowTime
        ws.send("time;"+nowTime)
    }

    nowPlay = !(document.getElementsByClassName("btnp f-cp")[0].className.indexOf("btnp-pause")==-1)
    if (oldPlay != nowPlay) {
        oldPlay = nowPlay
        ws.send("play;"+nowPlay)
    }
}


// 每 100ms 加载一遍歌
setInterval(() => {
    checkSong()
}, 500);