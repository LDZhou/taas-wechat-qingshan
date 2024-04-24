// pages/home/suggest/suggest.js

const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: [
      {
        key: 'name',
        tag: 'input'
      },
      {
        key: 'email',
        tag: 'input'
      },
      // {
      //   title: '您想说的',
      //   placeholder: '请输入...',
      //   key: 'notes',
      //   tag: 'input'
      // }
    ],
    disabled: true,
    form: {
      name: '',
      email: '',
      notes: ''
    },
    modelMessage: {
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavBarTitle();
    const content = wx.getStorageSync('content'); // 直接从全局数据中获取内容
    this.model = this.selectComponent('#model')
    // this.model.show()
    this.setData({
      content: content,
      modelMessage: {
        title: content.text13,
        content: content.text14,
        confirmText: content.text15,
        iconPath: '/assets/component/success.png'
      }
    })
    // 更新 rows 数据
    this.updateRows();
  },
  updateRows: function() {
    const content = this.data.content;
    const updatedRows = this.data.rows.map(row => ({
      ...row,
      title: content[row.key + 'Title'] || content['text' + (row.key === 'name' ? '9' : '11')], // 通过 key 获取 title
      placeholder: content[row.key + 'Placeholder'] || content['text' + (row.key === 'name' ? '10' : '12')] // 通过 key 获取 placeholder
    }));

    this.setData({ rows: updatedRows });
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
  
  bindInputBlur: function (e) {
  },

  // bindSelectorChange: function ({ currentTarget, detail }) {
  //   const { key } = currentTarget.dataset
  //   let { form } = this.data
  //   form[key] = brandTypeLists[detail.value]
  //   this.setData({ form })
  // },

  bindinput: function (e) {
    let { form } = this.data
    const { key } = e.currentTarget.dataset
    form[key] = e.detail.value
    const disabled = !Object.values(form).every(i => Boolean(i))
    this.setData({ form, disabled })
  },

  bindSubmit: function () {
    app.globalData.userInfoPromise
      .then(() => {
        this.requestSuggest()
      })
      .catch(() => {
        wx.navigateTo({
          url: '/pages/my-page/login/login',
        })
      })
  },

  requestSuggest () {
    const { disabled, form } = this.data
    const { userInfo } = app.store.getState()
    if (disabled) {
      return
    }
    const params = {
      url: `users/review`,
      method: 'POST',
      data: {
        user: {
          ...form
        }
      }
    }
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    const self = this
    this.request(params)
    .then(result => {
      self.model.show()
      self.updateUserInfo(() => {
        wx.hideLoading()
        self.setData({ disabled: true })
      })
    })
  },

  confirmModel: function () {
    wx.navigateBack()
  },
})