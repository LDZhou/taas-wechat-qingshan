// pages/home/home.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const content = wx.getStorageSync('content');
    app.setNavBarTitle();
    this.setData({
      content: content,
      images: { // 设置图片路径
        bg1: content.homeBg1,
        bg2: content.homeBg2,
        bg3: content.homeBg3,
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.setNavBarTitle();
  },

  onShareAppMessage: function () {
    return this.shareApp()
  },
  
  bindSuggest: function () {
    wx.navigateTo({
      url: './suggest/suggest'
    })
  }
})