// pages/solution/solution.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [
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
    this.getChains()
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
  },

  getChains: function () {
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    const params = {
      url: 'chains/app_index',
      method: 'GET',
      data: {
      }
    }
    const self = this
    this.request(params).then(result => {
      console.log(111, result)
      if (!result.data) {
        return
      }
      const chains = result.data.map(item => {
        let i = {
          name: item.name,
          id: item.id,
          url: ''
        }
        if (item.products && item.products.length) {
          const lastProductPhotos = item.products[item.products.length - 1].photos
          lastProductPhotos && lastProductPhotos.length && (i.url = lastProductPhotos[0].url)
        }
        return i
      })
      wx.hideLoading()
      this.setData({ photos: chains })
    })
  }
})