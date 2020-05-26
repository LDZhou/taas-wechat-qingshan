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
    previewImage: {
      type: Boolean,
      value: false
    },
    showSwiperBtn: {
      type: Boolean,
      value: false
    },
    properties: {
      type: Object,
      value: {}
    }
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
      const { currentIndex, photos, previewImage } = this.data
      if (previewImage) {
        const currentUrl = photos[currentIndex].url || ''
        wx.previewImage({
          current: currentUrl,
          urls: photos.map(item => item.url)
        })
      }
    },

    swiperItemTap: function () {
      const { currentIndex } = this.data
      this.triggerEvent('swiperItemTap', { currentIndex })
    }
  }
})
