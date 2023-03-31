package com.ttpfx.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ttpfx.dao.UserLogDao;
import com.ttpfx.entity.UserLog;
import com.ttpfx.service.UserLogService;
import org.springframework.stereotype.Service;

/**
 * @author ttpfx
 * @date 2023/3/29
 */
@Service
public class UserLogServiceImpl extends ServiceImpl<UserLogDao, UserLog> implements UserLogService {
}
