const app = getApp();
import { zh } from '/zh';
import { en } from '/en';

Component({
  data: {
    languageSwitchIcon: '', // 初始化语言切换图标路径
  },
  lifetimes: {
    attached() {
      this.updateContent();
    },
  },
  methods: {
    /* get content from language */
    updateContent() {
      const lastLanguage = wx.getStorageSync('language') || 'zh'; // 默认为'zh'
      const content = lastLanguage === 'en' ? en : zh;
      app.globalData.content = content;
      wx.setStorageSync('content', content);
      wx.setStorageSync('language', lastLanguage);

      this.setData({
        content: content,
        languageSwitchIcon: content.languageSwitchIcon, // 更新图片路径
      });
    },

    /* change language and update content */
    changeLanguage() {
      const currentLanguage = wx.getStorageSync('language');
      const newLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
      wx.setStorageSync('language', newLanguage);
      const content = newLanguage === 'en' ? en : zh;
      app.globalData.content = content;
      wx.setStorageSync('content', content);

      this.updateContent(); // 使用最新内容更新组件

      // 重启到当前页面
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const url = `/${currentPage.route}`;

      const options = currentPage.options;
      const queryString = Object.keys(options).map(key => `${key}=${options[key]}`).join('&');

      wx.reLaunch({
        url: queryString ? `${url}?${queryString}` : url,
      });
    },
  },
});
