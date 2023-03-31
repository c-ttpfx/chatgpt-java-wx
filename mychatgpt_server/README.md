# 使用说明
当前程序提供了聊天服务的接口，基于webSocket进行通信的，大家可以自行编写前端程序或者微信小程序来和后端打通，也可以使用我提供的微信小程序(有不少bug)来进行使用

**运行说明**
1. 将java程序中的apiKey(在src\main\java\com\ttpfx\model\ChatModel.java中)设置为自己的，然后更改application.yaml中的数据库连接的一些选项
2. 打包成jar
3. 放到服务器运行
