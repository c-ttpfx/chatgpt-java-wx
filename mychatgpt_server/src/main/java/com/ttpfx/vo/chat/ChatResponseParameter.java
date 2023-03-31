package com.ttpfx.vo.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author ttpfx
 * @date 2023/3/28
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseParameter {
   private String id;
   private String object;
   private String created;
   private String model;

   private List<Choice> choices;
}
