# 使用chatgpt提供的接口，实现自己的微信聊天小程序
## 基础说明
java编写服务器，实现chatgpt接口的调用。微信小程序用于聊天。二者基于webSocket进行通信

## 运行说明
1. 能ping通外网的服务器，我选择的是阿里云的香港轻量级应用服务器
2. 安装mysql和jdk，将mychatgpt.sql导入到数据库
3. 更改application.yaml中的数据库连接的一些选项，将apiKey设置为自己的，代理可以根据自己的情况来进行设置（非必须）
4. 将java代码打包传到服务器上，运行程序
5. 打开微信小程序，将里面的url连接中的ip改为自己服务器的地址（默认是localhost:80）
6. 然后就可以进入微信小程序体验了
7. **帮我star一下~\(≥▽≤)/~~\(≥▽≤)/~**

我的博客的地址为 https://blog.csdn.net/m0_51545690  ，分享技术文章，大家也可以关注一波

# 遇见错误解决方法
* 检查jdk版本是否为8
* 检查maven里面的jar包是否全部导入成功
* 检查配置文件中的信息是否已经全部修改为自己的，并且修改正确

如果还报错，那么可以先在网上查询一下解决方法，如果还是不能解决，可以将错误的堆栈信息或者截图通过issues来进行提问，我尽量帮忙解决

## 更新说明
### 2023/5/13更新

重构了代码，提供了代理的支持，使用代理只需要在yaml中通过下面选项进行配置
```yaml
gpt:
  proxy:
    host: 127.0.0.1
    port: 7890
```

## 运行效果图展示
**终端测试**

![终端运行](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E7%BB%88%E7%AB%AF%E8%BF%90%E8%A1%8C.png)

**微信开发者工具**

![微信小程序1](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F1.png)
![微信小程序2](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F2.png)

**手机上通过微信小程序进行使用**

![登录](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E7%99%BB%E5%BD%95.PNG)

![首页](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E9%A6%96%E9%A1%B5.PNG)

![聊天界面2](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E8%81%8A%E5%A4%A92.PNG)
![聊天界面3](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E8%81%8A%E5%A4%A93.PNG)

![个人中心](https://github.com/c-ttpfx/chatgpt-java-wx/blob/main/%E6%95%88%E6%9E%9C%E5%9B%BE%E7%89%87/%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83.PNG)
