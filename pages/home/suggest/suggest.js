// pages/home/suggest/suggest.js

const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: [
      {
        title: '您的姓名',
        placeholder: '请输入...',
        key: 'name',
        tag: 'input'
      },
      {
        title: '您的邮箱',
        placeholder: '请输入...',
        key: 'email',
        tag: 'input'
      },
      {
        title: '您想说的',
        placeholder: '请输入...',
        key: 'notes',
        tag: 'input'
      }
    ],
    disabled: true,
    form: {
      name: '',
      email: '',
      notes: ''
    },
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
    const { disabled, form } = this.data
    const { userInfo } = app.store.getState()
    if (disabled) {
      return
    }
    const params = {
      url: `users/${userInfo.id}`,
      method: 'PUT',
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
    this.request(params).then(result => {
      self.updateUserInfo(() => {
        wx.hideLoading()
        self.setData({ disabled: true })
      })
    })
  }
})