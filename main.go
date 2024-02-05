package main

import (
	"net/http"
	"nnz/service"
	"os"

	"github.com/gin-gonic/gin"
	//"github.com/penndev/rtmp-go/rtmp"
)

func main() {
	g := gin.Default()
	//gin.SetMode(gin.DebugMode)
	g.Use(CrosHandler())
	args := os.Args
	if len(args) == 1 {
		args = append(args, ".")
	}
	loadRoute(g, args[1])

	g.Run(":2000")
	//rtmp.NewRtmp()

}

// 加载路由
func loadRoute(g *gin.Engine, root string) {
	if root == "" {
		root = "."
	}
	g.StaticFS("/static", http.Dir(root+"/static"))
	g.StaticFile("/", root+"/static/index.html")
	g.StaticFile("/js", root+"/static/ncm.js")
	g.StaticFile("/js_v2", root+"/static/ncm_v2.js")
	// 网易云端的ws
	g.GET("/ncm", service.NCM_WebSocket)
	// 副屏端的ws(已弃用)(又启用了)
	g.GET("/cli", service.CLI_WebSocket)

	// 获取信息
	g.GET("/s", service.CLI_S)
	// 切歌
	g.GET("/prev", service.CLI_PREV)
	g.GET("/next", service.CLI_NEXT)
	// 暂停
	g.GET("/play", service.CLI_PLAY)
	// 喜欢
	g.GET("/like", service.CLI_LIKE)
	// 前进
	g.GET("/less", service.CLI_LESS)
	g.GET("/more", service.CLI_MORE)
	// 搜索切歌
	g.GET("/search", service.CLI_SEARCH)
	// 更改播放顺序
	g.GET("/order", service.CLI_ORDER)

	// 副屏端上传图片
	g.POST("/picture", service.MORE_PICTURE)
}

func CrosHandler() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.Header("Access-Control-Allow-Origin", "*") // 设置允许访问所有域
		context.Header("Access-Control-Max-Age", "172800")
		context.Header("Cache-Control", "no-store")

		//处理请求
		context.Next()
	}
}
