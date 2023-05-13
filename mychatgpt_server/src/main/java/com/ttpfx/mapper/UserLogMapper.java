package com.ttpfx.mapper;

import com.ttpfx.entity.UserLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Mapper
public interface UserLogMapper {

    int insert(UserLog userLog);
}
