// pages/my-page/login/login.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      content: wx.getStorageSync('content')
    })
  },

  onShareAppMessage: function () {
    return this.shareApp()
  },

  getUserInfo: function (e) {
    const { userInfo } = e.detail
    if (userInfo) {
      // 获取用户信息
      wx.showLoading({
        title: 'Loading...',
        mask: true
      })
      app.globalData.userInfoPromise = new Promise((resolve, reject) => {
        this.publicLogin(userInfo, this.request, app.store, () => {
          resolve()
          wx.hideLoading()
          if (getCurrentPages().length > 1) {
            wx.navigateBack()
          } else {
            wx.reLaunch({
              url: '/pages/home/homes'
            })
          }
        })
      })
    }
  }

})