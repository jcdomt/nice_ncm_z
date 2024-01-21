package service

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func MORE_PICTURE(c *gin.Context) {
	base := c.PostForm("b")
	base = strings.Replace(base, "data:image/jpeg;base64,", "", 1)
	b, err := base64.StdEncoding.DecodeString(base)
	if err != nil {
		c.JSON(200, map[string]interface{}{
			"code": 1,
			"err":  err.Error(),
		})
		return
	}
	name := strconv.FormatInt(time.Now().Unix(), 10)
	err = ioutil.WriteFile("./pic/"+name+".jpg", b, 0666) //写入文件(字节数组)
	if err != nil {
		c.JSON(200, map[string]interface{}{
			"code": 2,
			"err":  err.Error(),
		})
		return
	}
	cmd := exec.Command("powershell", "/c", "./pic/"+name+".jpg")
	err = cmd.Run()
	if err != nil {
		fmt.Println(err.Error())
	}
	c.JSON(200, map[string]interface{}{
		"code": 0,
	})
}
