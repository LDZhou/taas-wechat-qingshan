// pages/solution/solution.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [
      {
        id: 32,
        url: '/assets/solution/solution1.png'
      },
      {
        id: 32,
        url: '/assets/solution/solution2.png'
      },
      {
        id: 32,
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

  swiperItemTap: function ({ detail }) {
    const { photos } = this.data
    const { currentIndex } = detail
    const currentId = photos[currentIndex].id
    wx.navigateTo({
      url: './retrospect/retrospect?id=' + currentId,
    })
  }
})