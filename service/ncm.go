// 从网易云PC端插件获取信息
package service

import (
	"encoding/json"
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

var S map[string]string

func init() {
	S = make(map[string]string)
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
		data := <-NCM_List
		err := ws.WriteMessage(websocket.TextMessage, []byte(data))
		if err != nil {
			log.Println("write:", err)
			NCM_List <- data
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
			S["Playing"] = arr[1]
		default:
			S[arr[0]] = arr[1]
		}
		j, _ := json.Marshal(S)
		CLI_List <- string(j)
	}
}

// 写指令
func ws_writer(ws *websocket.Conn, list chan string) {

}
