package com.ttpfx.test;

import com.ttpfx.model.ChatModel;
import com.ttpfx.vo.chat.ChatRequestParameter;

/**
 * @author ttpfx
 * @date 2023/3/28
 */
public class Test {

    public static void main(String[] args) {
        ChatModel chatModel = new ChatModel();
        chatModel.setApiKey("xxx");
        ChatRequestParameter chatRequestParameter = new ChatRequestParameter();
        chatModel.printAnswer(chatRequestParameter,"你好啊");
    }
}
