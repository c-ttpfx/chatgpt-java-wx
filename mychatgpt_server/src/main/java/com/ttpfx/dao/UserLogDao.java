package com.ttpfx.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ttpfx.entity.UserLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Mapper
public interface UserLogDao extends BaseMapper<UserLog> {

    @Override
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UserLog userLog);
}
