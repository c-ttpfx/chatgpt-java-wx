package com.ttpfx.vo.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ttpfx
 * @date 2023/3/28
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestParameter {
    private String model = "gpt-3.5-turbo";

    private List<ChatMessage> messages = new ArrayList<>();

    private boolean stream = true;

     public void addMessages(ChatMessage message) {
        this.messages.add(message);
    }
}
