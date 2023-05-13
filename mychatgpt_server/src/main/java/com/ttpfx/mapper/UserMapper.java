package com.ttpfx.mapper;

import com.ttpfx.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Mapper
public interface UserMapper {


    int insert(User user);

    User queryByName(String username);
}
