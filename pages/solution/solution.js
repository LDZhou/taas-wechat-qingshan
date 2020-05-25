// pages/solution/solution.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [
      {
        id: 0,
        url: '/assets/solution/solution1.png'
      },
      {
        id: 1,
        url: '/assets/solution/solution2.png'
      },
      {
        id: 2,
        url: '/assets/solution/solution3.jpg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  onShareAppMessage: function () {
    return this.shareApp()
  },
  
  toRetrospect: function ({ currentTarget }) {
    const { currentId } = currentTarget.dataset
    wx.navigateTo({
      url: './retrospect/retrospect?id=' + currentId,
    })
  }
})