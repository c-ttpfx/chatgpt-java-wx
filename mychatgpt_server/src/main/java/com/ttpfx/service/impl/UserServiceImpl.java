package com.ttpfx.service.impl;

import com.ttpfx.entity.User;
import com.ttpfx.mapper.UserMapper;
import com.ttpfx.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserMapper userMapper;

    @Override
    public User queryByName(String username) {
        return userMapper.queryByName(username);
    }
}
