package com.ttpfx.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
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
@TableName("user_log")
public class UserLog {

    @TableId(type = IdType.AUTO)
    private Integer logId;
    private Integer userId;
    private String username;
    private Integer preLogId;
    private String question;
    private String answer;
    private LocalDateTime dateTime;
    private Long consumeTime;
}
