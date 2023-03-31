package com.ttpfx.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ttpfx.entity.User;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
public interface UserService extends IService<User> {


    User queryByName(String username);
}
