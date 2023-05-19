package com.ttpfx.test;

import com.ttpfx.App;
import com.ttpfx.model.ChatModel;
import com.ttpfx.vo.chat.ChatRequestParameter;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Scanner;

/**
 * @author ttpfx
 * @date 2023/3/28
 */
public class Test {

    public static void main(String[] args) throws InterruptedException{
        ConfigurableApplicationContext applicationContext = SpringApplication.run(App.class, args);
        ChatModel chatModel = applicationContext.getBean("chatModel", ChatModel.class);
        ChatRequestParameter chatRequestParameter = new ChatRequestParameter();
        System.out.println("\n\n\n\n");

        while (true) {
            Thread.sleep(1000);
            System.out.print("请输入问题(q退出)：");
            String question = new Scanner(System.in).nextLine();
            if ("q".equals(question.trim())) break;
            chatModel.getAnswer(System.out::print, chatRequestParameter, question);
        }

        applicationContext.close();
    }
}
