// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
  
  },

  onShow: function () {
    if(wx.getStorageSync('expireTime')==null ||wx.getStorageSync('expireTime') < Date.now()){
      console.log(wx.getStorageSync('expireTime')+"-->"+Date.now());
      wx.removeStorageSync('expireTime')
      let username = wx.getStorageSync('username')
      wx.removeStorageSync('username')
      wx.request({
        url: 'http://127.0.0.1:80/user/logout',
        method: "get",
        data: {
          "username": username,
        },
        success: ({
          data
        }) => {
          wx.showToast({
            icon: 'none',
            title: '身份验证到期，请重新登录',
            duration: 2500
          })
        }
      })

    }
    wx.request({
      url: 'http://127.0.0.1:80/user/checkUserKey',
      method: "get",
      data: {
        "username": wx.getStorageSync('username'),
        "key":wx.getStorageSync('key')
      },
      success: ({
        data
      }) => {
        console.log(data.code);
        if (data.code === 500) {
          wx.showToast({
            icon: 'none',
            title: data.message,
            duration: 2500
          })
          wx.removeStorageSync('username')
          wx.removeStorageSync('key')
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }
    })
    if (wx.getStorageSync('username') ==null || wx.getStorageSync('username')=== '') {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  }
})
