// 从副屏端插件获取信息
package service

import (
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// 指令队列
var CLI_List = make(chan string, 1)
var CLI_ONLY = true

func CLI_WebSocket(c *gin.Context) {
	// if CLI_ONLY {
	// 	c.String(200, "<h1>同个网易云只支持一个副屏哦</h1>")
	// }
	// CLI_ONLY = false
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	go cli_ws_reader(ws)
senderFor:
	for {
		err := ws.WriteMessage(websocket.TextMessage, []byte(<-CLI_List))
		if err != nil {
			log.Println("write:", err)
			break senderFor
		}
	}
}

// 读指令
func cli_ws_reader(ws *websocket.Conn) {
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			break
		}
		arr := strings.Split(string(msg), ";")
		switch arr[0] {
		case "change":
			// 换歌
		}
	}
}

func CLI_S(c *gin.Context) {
	c.JSON(200, S)
}
func CLI_PREV(c *gin.Context) {
	// 上一首
	NCM_List <- "prev"
}
func CLI_NEXT(c *gin.Context) {
	// 下一首
	NCM_List <- "next"
}
func CLI_PLAY(c *gin.Context) {
	// 下一首
	NCM_List <- "play"
}
func CLI_LIKE(c *gin.Context) {
	// 下一首
	NCM_List <- "like"
}
func CLI_LESS(c *gin.Context) {
	offset := c.Query("o")
	NCM_List <- "less;" + offset
}
func CLI_MORE(c *gin.Context) {
	offset := c.Query("o")
	NCM_List <- "more;" + offset
}
func CLI_SEARCH(c *gin.Context) {
	NCM_List <- "search;" + c.Query("t")
}
func CLI_ORDER(c *gin.Context) {
	NCM_List <- "order"
}
