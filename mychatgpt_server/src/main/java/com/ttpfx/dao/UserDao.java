package com.ttpfx.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ttpfx.entity.User;
import com.ttpfx.entity.UserLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.mybatis.spring.annotation.MapperScan;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Mapper
public interface UserDao extends BaseMapper<User> {

    @Override
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
}
