// pages/home/suggest/suggest.js

const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: [
      {
        title: '您的公司',
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
        key: 'content',
        tag: 'input'
      }
    ],
    disabled: true,
    form: {
      name: '',
      email: '',
      content: ''
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
    const disabled = Object.values(form).some(i => Boolean(i) === false)
    this.setData({ form, disabled })
  },

  bindSubmit: function () {
    const { disabled, form } = this.data
    if (disabled) {
      return
    }
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    const params = {
      url: 'brands',
      method: 'POST',
      data: {
        brand: form
      }
    }
    const self = this
    this.request(params).then(result => {
      wx.hideLoading()
      // this.setData({ disabled: true })
    })
  }
})