var SERVER = window.location.protocol
var pic = document.getElementById("pic")
var title = document.getElementById("title")
var lrc = document.getElementById("lrc")
var lrc1 = document.getElementById("lrc1")
var lrc2 = document.getElementById("lrc2")
var lrc3 = document.getElementById("lrc3")
var controller = document.getElementById("controller")
function SongChange(id) {
    lrcdata = new Array()
    // 获取歌
    $.get("https://api.injahow.cn/meting/?type=song",{id:id},function(data) {
        data = JSON.parse(data)
        var xhr = new XMLHttpRequest();
        xhr.open("GET", data[0].pic, true);
        xhr.onload = function () {
            // 加大像素量
            pic.src = xhr.responseURL.replace("90y90","500y500")
        };
        xhr.send(null);
        title.innerHTML = data[0].name
    })
    // 获取歌词
    $.get("https://api.injahow.cn/meting/?type=lrc",{id:id},function(data) {
        laodLrc(data)
    })
}

var lrcdata = new Array()
function laodLrc(data) {
    lrcs = data.split("\n")
    lrcs.forEach(e => {
        if(e != "") {
            t = e.substring(e.indexOf("[")+1,e.indexOf("]"))
            t = Math.round(t.substring(0, t.indexOf(":"))*60*100 + t.substring(t.indexOf(":")+1, t.length)*100)
            s = e.substring(e.indexOf("]")+1, e.length)
            lrcdata.push({"t":t,"s":s})
        }
    });
    showLrc()
}
var n = 0
function showLrc() {
    if(lrcdata == undefined) return
    time = Number(S.Time)*100+40
    nn = 0
    while (lrcdata[nn+1].t<=time || lrcdata[nn+1].t<=time) {
        nn++
    }
    if (nn==n) return
    n = nn
    lrc1.innerHTML = lrcdata[nn-1].s
    lrc2.innerHTML = lrcdata[nn].s
    lrc3.innerHTML = lrcdata[nn+1].s
}


t = setInterval(ticker,300)
var S = new Object()
S.Playing = ""
S.Time = 0
S.Play = "true"

function ticker() {
    $.get(SERVER+"/s",function(data) {
        if (data.Playing != S.Playing) {
            SongChange(data.Playing)
        }
        S = data
    })
}

ta = setInterval(aer, 30)
current = 0
function aer() {
    if (S.Play=="true") {
        current += 1
        pic.style.transform = 'translateX(-50%) translateY(-50%) rotate('+current+'deg)';
    }

    // 加载歌词
    showLrc()
}

var touchstartX, touchstartY, touchendX, touchendY
pic.addEventListener("touchstart", function(event) {
    touchstartX = event.changedTouches[0].pageX
    touchstartY = event.changedTouches[0].pageY
})
pic.addEventListener("touchend", function(event) {
    touchendX = event.changedTouches[0].pageX
    touchendY = event.changedTouches[0].pageY
    
    if ((touchendX - touchstartX) > 100) $.get(SERVER+"/prev")
    if ((touchstartX - touchendX) > 100) $.get(SERVER+"/next")

})
pic.addEventListener("dblclick", function(event) {
    // （不）喜欢
    $.get(SERVER+"/like")
})

title.addEventListener("click", function(event) {
    // 暂停
    $.get(SERVER+"/play")
})

var oldOffset = 0
pic.addEventListener("touchstart", function(event) {
    oldOffset = 0
    touchstartX = event.changedTouches[0].pageX
    touchstartY = event.changedTouches[0].pageY
})
pic.addEventListener("touchmove", function(event) {
    touchendX = event.changedTouches[0].pageX
    touchendY = event.changedTouches[0].pageY
    
    offset = -(touchendY - touchstartY)

    if (offset < 0) {
        if (offset < -400) offset = -400
        offset = (-offset)
        if (Math.abs(offset - oldOffset) > 30) $.get(SERVER+"/less",{o:offset})
        return
    }
    if (offset > 0) {
        if (offset > 400) offset = 400
        if (Math.abs(offset - oldOffset) > 30) $.get(SERVER+"/more",{o:offset})
    }
})


controller.addEventListener("dblclick", function(event) {
    window.location.reload()
})
controller.addEventListener("touchstart", function(event) {
    oldOffset = 0
    touchstartX = event.changedTouches[0].pageX
    touchstartY = event.changedTouches[0].pageY
})
controller.addEventListener("touchmove", function(event) {
    touchendX = event.changedTouches[0].pageX
    touchendY = event.changedTouches[0].pageY
    
    offset = -(touchendX - touchstartX)

    if (offset < 0) {
        window.history.back();
    }
    if (offset > 0) {
        /* if (offset > 400) offset = 400
        if (Math.abs(offset - oldOffset) > 30) $.get(SERVER+"/more",{o:offset}) */
    }
})