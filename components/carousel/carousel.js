// components/carousel/carousel.js

const app = getApp()
App.Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    photos: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    posterSwiperChange: function ({ currentTarget, detail }) {
      const { current } = detail
      this.setData({ currentIndex: current })
    },

    previewHistoryImage: function (e) {
      const { currentIndex } = this.data
      const currentUrl = this.photos[currentIndex].url || ''
      const self = this
      wx.previewImage({
        current: currentUrl,
        urls: self.photos.map(item => item.url)
      })
    },
  }
})
