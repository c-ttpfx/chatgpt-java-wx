package com.ttpfx.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLog {

    private Integer logId;
    private Integer userId;
    private String username;
    private Integer preLogId;
    private String question;
    private String answer;
    private LocalDateTime dateTime;
    private Long consumeTime;
}
