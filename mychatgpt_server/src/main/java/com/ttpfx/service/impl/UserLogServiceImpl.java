package com.ttpfx.service.impl;

import com.ttpfx.entity.UserLog;
import com.ttpfx.mapper.UserLogMapper;
import com.ttpfx.service.UserLogService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Service
public class UserLogServiceImpl implements UserLogService {
    @Resource
    private UserLogMapper userLogMapper;

    @Override
    public boolean save(UserLog userLog) {
       return userLogMapper.insert(userLog) > 0;
    }
}
