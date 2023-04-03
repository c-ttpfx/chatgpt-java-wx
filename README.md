# 使用chatgpt提供的接口，实现自己的微信聊天小程序
java编写服务器，实现chatgpt接口的调用。微信小程序用于聊天。二者基于webSocket进行通信

**运行说明**
1. 购买一个外网服务器（只需要能ping通外网即可），我选择的是阿里云的香港轻量级应用服务器
2. 安装mysql和jdk，将mychatgpt.sql导入到数据库
3. 将java程序中的apiKey(在src\main\java\com\ttpfx\model\ChatModel.java中)设置为自己的，然后更改application.yaml中的数据库连接的一些选项
4. 将java代码打包传到服务器上，运行程序
5. 打开微信小程序，将里面的url连接中的ip改为自己服务器的地址
6. 然后就可以进入微信小程序体验了
7. **帮我star一下~\(≥▽≤)/~~\(≥▽≤)/~**

我的博客的地址为 https://blog.csdn.net/m0_51545690  ，分享技术文章，大家也可以关注一波


**2033/4/3 大家测试尽量不要使用clash for windows这个软件，很不稳定，反正我用这个直接不能访问**
