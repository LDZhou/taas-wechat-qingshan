// components/carousel/carousel.js
const app = getApp();

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },

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
    containerStyle: {
      type: String,
      value: ''
    },
    indicatorStyle: {
      type: String,
      value: ''
    },
    imageStyle: {
      type: String,
      value: ''
    },
  },

  data: {
    currentIndex: 0,
    content: {} // 存储本地化内容
  },

  attached: function() {
    this.loadContent();  // 调用方法从methods加载内容
  },

  methods: {
    loadContent: function() {
      const currentLanguage = this.getCurrentLanguage();
      this.setData({
        content: this.getContentByLanguage(currentLanguage)
      });
    },

    getCurrentLanguage: function() {
      return wx.getStorageSync('language') || 'zh';  // 从本地存储获取当前语言设置
    },

    getContentByLanguage: function(language) {
      // 根据语言获取内容，这里可以扩展更多语言
      return language === 'en' ? { text23: 'View now' } : { text23: '立即查看' };
    },

    posterSwiperChange: function(e) {
      this.setData({ currentIndex: e.detail.current });
    },

    previewHistoryImage: function(e) {
      const { currentIndex, photos, previewImage } = this.data;
      if (previewImage) {
        wx.previewImage({
          current: photos[currentIndex].url,
          urls: photos.map(item => item.url)
        });
      }
    },

    swiperItemTap: function() {
      this.triggerEvent('swiperItemTap', { currentIndex: this.data.currentIndex });
    }
  }
});