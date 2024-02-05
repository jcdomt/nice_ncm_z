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
            document.getElementsByClassName("cmd-button cmd-button-surfacePri cmd-button-size-m cmd-button-surface-pri middleHover_mb8nb6p cmd-button-with-icon cmd-button-with-icon-only ButtonWrapper_bnw6rq5")[0].click()
            break
        case "next":
            // 下一首
            document.getElementsByClassName("cmd-button cmd-button-surfacePri cmd-button-size-m cmd-button-surface-pri middleHover_mb8nb6p cmd-button-with-icon cmd-button-with-icon-only ButtonWrapper_bnw6rq5")[1].click()
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
        case "search":
            document.getElementsByClassName("cmd-input cmd-input-default")[0].value = data[1]
            document.getElementsByClassName("cmd-input cmd-input-default")[0].dispatchEvent(new Event('input', { bubbles: true }));
            document.getElementsByClassName("cmd-icon cmd-icon-search icon IconStyle_icbceci")[0].click()
            setTimeout(() => {
                document.getElementById("cmdTab1").click()
                setTimeout(() => {
                    document.getElementsByClassName("cmd-button cmd-button-surfacePri cmd-button-size-m cmd-button-surface-pri play cmd-button-with-icon cmd-button-with-icon-only ButtonWrapper_bnw6rq5")[0].click()
                },500)
            },500)
            break
        case "order":
            document.getElementById("page_pc_mini_bar").getElementsByClassName("cmd-icon cmd-assignedColor-icon IconStyle_icbceci")[0].click()
            break
    }
    checkSong()
}
timer = 0
ws.onclose = function(e) {
    // 强制重连
        ws = new WebSocket("ws://localhost:2000/ncm")
}
ws.onopen = function(e) {
    clearInterval(timer)
}
var footer = document.getElementsByClassName("should-hide-under-vinyl-mode Container_c14l86ko")[0]


var oldPlaying = -1
var oldTime = -1
var oldPlay = true
var oldPic = ""
var oldLyric = ""
var oldUnix = 0
var oldLike = false
var oldTitle = ""
var oldOrder = ""

var checkSong = function() {
    // 尝试刷新愚蠢的网易云状态栏
    document.getElementsByClassName("cmd-button cmd-button-outlineSec cmd-button-size-custom cmd-button-outline-sec button ButtonWrapper_bnw6rq5")[0].dispatchEvent(new MouseEvent('mouseenter', {bubbles: true,cancelable: true,view: window}))


    //nowID = betterncm.ncm.getPlaying().id
    nowID = getIDv2()
    if (oldPlaying != nowID) {
        oldPlaying = nowID
        ws.send("change;"+nowID)
        onSongChange()
    }
    
    

    nowPlay = (document.getElementsByClassName("cmd-assignedColor-icon icon IconStyle_icbceci")[0].getAttribute('title').indexOf("播放")==-1)
    if (oldPlay != nowPlay) {
        oldPlay = nowPlay
        ws.send("Play;"+nowPlay)
    }

    nowTitle = document.getElementsByClassName("cmd-typography title cmd-typography-primary cmd-typography-normal cmd-typography-userselect TypographyWrapper_t17ti7xp")[0].getAttribute("title")
    if (nowTitle != oldTitle) {
        oldTitle = nowTitle
        ws.send("Title;"+nowTitle)
    }

    document.getElementsByClassName("cmd-icon cmd-icon-minimize icon IconStyle_icbceci")[0].dispatchEvent(new MouseEvent('mouseenter', {bubbles: true,cancelable: true,view: window}))
    document.getElementsByClassName("cmd-icon cmd-icon-minimize icon IconStyle_icbceci")[0].dispatchEvent(new MouseEvent('mouseover', {bubbles: true,cancelable: true,view: window}))
    nowPic = footer.firstElementChild.getElementsByClassName("cmd-image")[0].src
    if (nowPic != oldPic) {
        oldPic = nowPic
        ws.send("Pic;"+nowPic)

    }
    

    LikeHeartList = document.getElementsByClassName("cmd-icon cmd-icon-like")
    nowLike = LikeHeartList[LikeHeartList.length - 1].getAttribute("title") == "取消喜欢（Ctrl + L）"
    if (nowLike != oldLike) {
        oldLike = nowLike
        ws.send("Like;"+nowLike)
    }

    nowOrder = document.getElementById("page_pc_mini_bar").getElementsByClassName("cmd-icon cmd-assignedColor-icon IconStyle_icbceci")[0].getAttribute("title")
    if (nowOrder != oldOrder) {
        oldOrder = nowOrder
        ws.send("Order;"+nowOrder)
    }


    // 歌词太慢了，扔最后
    if (document.getElementsByClassName("NoLyricContainer_n1wmw8cp")[0] != undefined && document.getElementsByClassName("NoLyricContainer_n1wmw8cp")[0].innerHTML.indexOf("纯音乐，请欣赏") != -1) {
        nowLyric = "纯音乐，请欣赏"
    } else {
        if (document.getElementsByClassName("current")[0] == undefined && Date.now()-oldUnix>800) {
            onSongChange()
            oldUnix = Date.now()
        }
        nowLyric = document.getElementsByClassName("current")[0].innerHTML.split('="vpjX51">')[1]
    }
    nowLyric = nowLyric.replace("</p>","")
    nowLyric = nowLyric.replace(`<p class="cmd-typography cmd-typography-paragraph cmd-typography-primary cmd-typography-normal cmd-typography-userselect TypographyWrapper_t17ti7xp" _nk="vpjX52"></p>`,"")
    if (nowLyric != oldLyric) {
        oldLyric = nowLyric
        ws.send("Lyric;"+nowLyric)
    }

    //nowTime = betterncm.ncm.getPlayingSong().from.lastTime
    nowTime = getTimeV2()
    //console.log(nowTime)
    if (oldTime != nowTime) {
        oldTime = nowTime
        ws.send("Time;"+nowTime)
    }
}


// 每 100ms 加载一遍歌
setInterval(() => {
    checkSong()
}, 50);

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

function onSongChange() {
    document.getElementsByClassName("cmd-icon cmd-icon-lyric IconStyle_icbceci")[1].click()
    document.getElementsByClassName("cmd-icon cmd-icon-lyric IconStyle_icbceci")[1].click()
}







// 右键设置刷新
window.onload = function() {
    document.getElementsByClassName("cmd-icon cmd-icon-setting icon IconStyle_icbceci")[0].addEventListener("contextmenu",function() {
        location.reload()
    })
}
