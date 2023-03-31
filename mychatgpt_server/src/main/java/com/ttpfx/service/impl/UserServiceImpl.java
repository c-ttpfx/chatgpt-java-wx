package com.ttpfx.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ttpfx.dao.UserDao;
import com.ttpfx.entity.User;
import com.ttpfx.service.UserService;
import org.springframework.stereotype.Service;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserDao, User> implements UserService {

    @Override
    public User queryByName(String username) {
        return this.getOne(new QueryWrapper<User>().eq("username", username));
    }
}
