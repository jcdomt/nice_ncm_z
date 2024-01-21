// 从网易云PC端插件获取信息
package service

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	// 解决跨域问题
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// 指令队列
var NCM_List = make(chan string, 1)

type S_S struct {
	Playing string
	Time    string
	Play    string
	Pic     string
	Lyric   string
}

var S S_S

func init() {
	S.Playing = ""
	S.Time = ""
}

func NCM_WebSocket(c *gin.Context) {
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	go ws_reader(ws)
senderFor:
	for {
		err := ws.WriteMessage(websocket.TextMessage, []byte(<-NCM_List))
		if err != nil {
			log.Println("write:", err)
			break senderFor
		}
	}
}

// 读指令
func ws_reader(ws *websocket.Conn) {
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			break
		}
		arr := strings.Split(string(msg), ";")
		switch arr[0] {
		case "change":
			S.Playing = arr[1]
		case "time":
			S.Time = arr[1]
		case "play":
			S.Play = arr[1]
		case "pic":
			S.Pic = arr[1]
		case "lyric":
			S.Lyric = arr[1]
		}
	}
}

// 写指令
func ws_writer(ws *websocket.Conn, list chan string) {

}
