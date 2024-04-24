// pages/my-page/my-page.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: [
      {
        key: 'nickname',
        tag: 'input'
      },
      {
        key: 'gender',
        tag: 'picker'
      },
      {
        key: 'date_of_birth',
        tag: 'datePicker'
      },
      {
        key: 'phone',
        tag: 'input',
        type: 'number',
        maxlength: 11
      },
    ],
    detail: {
      nickname: '',
      gender: '',
      date_of_birth: '',
      phone: ''
    },
    endDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const content = wx.getStorageSync('content');
    this.setData({ content: content });
    this.updateRows();
  },
  
  updateRows: function() {
    const content = this.data.content;
    // Map from row keys to specific text indices
    const keyToTextMapping = {
      nickname: { title: 'text1', placeholder: 'text1' }, // 映射到姓名
      gender: { title: 'text2', placeholder: 'text2' }, // 映射到性别
      date_of_birth: { title: 'text3', placeholder: 'text3' }, // 映射到生日
      phone: { title: 'text4', placeholder: 'text4' } // 映射到电话
    };
  
    this.setData({
      rows: this.data.rows.map(row => ({
        ...row,
        title: content[keyToTextMapping[row.key].title] || 'Default Title',
        placeholder: content[keyToTextMapping[row.key].placeholder] || 'Default Placeholder'
      }))
    });
  },  

  onReady: function () {
    const date = new Date()
    const endDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    this.setData({ endDate })
  },

  onShareAppMessage: function () {
    return this.shareApp()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const content = this.data.content; // 包含所有本地化文本的对象
    let { userInfo } = app.store.getState();
    userInfo = userInfo || {};
    let detail = {
      nickname: userInfo.nickname || '',
      date_of_birth: userInfo.date_of_birth ? this.formatDate(userInfo.date_of_birth) : '',
      phone: userInfo.phone || ''
    };
    detail.gender = userInfo.gender != null ? content.genderOptions[userInfo.gender] : '';
    
    this.setData({ detail });
    this.setDynamicNavigationBarTitle();
  },

  setDynamicNavigationBarTitle: function() {
    const currentLanguage = this.getCurrentLanguage();
    console.log('Setting title for language: ' + currentLanguage); // 确认这个日志已打印
  
    let title = '我的'; // 默认标题
    if (currentLanguage === 'en') {
      title = 'Profile'; // 英文标题
    }

    wx.setNavigationBarTitle({
      title: title
    });
  },

  getCurrentLanguage: function() {
    const language = wx.getStorageSync('language') || 'zh';
    console.log('Current language is: ' + language); // 这应该显示 'en' 或 'zh'
    return language;
  },
  

  formatDate: function(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`; // 使用斜线分隔的国际标准日期格式
  },

  bindinput: function (e) {
    let { detail } = this.data
    const { key } = e.currentTarget.dataset
    detail[key] = e.detail.value
    this.setData({ detail })
  },

  bindInputBlur: function (e) {
    setTimeout(() => {
      this.putUserInfo()
    }, 0)
  },

  bindDateChange: function (e) {
  let { detail } = this.data;
  // 直接使用 formatDate 格式化用户选择的日期，无需考虑语言环境
  detail.date_of_birth = this.formatDate(e.detail.value);
  this.setData({ detail }, () => this.putUserInfo());
},

  // 更新性别选项时的处理
bindUnitFocus: function ({ currentTarget }) {
  const { key } = currentTarget.dataset;
  const content = this.data.content; // 包含所有本地化文本的对象
  const self = this;
  let { detail } = this.data;
  if (key === 'gender') {
    wx.showActionSheet({
      itemList: content.genderOptions, // 使用本地化的性别选项
      success(res) {
        detail.gender = content.genderOptions[res.tapIndex];
        self.setData({ detail }, () => self.putUserInfo());
      }
    });
  }
},

  bindSelectorChange: function ({ currentTarget, detail }) {
    const { key } = currentTarget.dataset
    let { detail: form } = this.data
    form[key] = options[key][detail.value]
    this.setData({ detail: form }, () => this.putUserInfo())
  },

  putUserInfo() {
    const self = this
    let detail = Object.assign({}, this.data.detail)
    detail.gender = detail.gender ? { '男': 0, '女': 1 }[detail.gender] : ''
    if (detail.date_of_birth) {
      detail.date_of_birth = detail.date_of_birth.replace(/年|月/g, '-').replace(/日/, '')
    }
    const { userInfo } = app.store.getState()
    const params = {
      url: `users/${userInfo.id}`,
      method: 'PUT',
      data: {
        user: {
          ...detail
        }
      }
    }
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    this.request(params).then(result => {
      self.updateUserInfo(() => {
        wx.hideLoading()
      })
    })
  },

  onLoginBtnTapped: function () {
    wx.navigateTo({
      url: '/pages/my-page/login/login'
    })
  }
})
