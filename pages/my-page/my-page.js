// pages/my-page/my-page.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: [
      {
        title: '姓名',
        placeholder: '请输入姓名',
        key: 'nickname',
        tag: 'input'
      },
      {
        title: '性别',
        placeholder: '请选择性别',
        key: 'gender',
        tag: 'picker'
      },
      {
        title: '生日',
        placeholder: '请选择生日',
        key: 'date_of_birth',
        tag: 'datePicker'
      },
      {
        title: '电话',
        placeholder: '请输入电话',
        key: 'phone',
        tag: 'input',
        type: 'number',
        maxlength: 11
      }
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
    // const isTeacher = false
    // wx.setNavigationBarTitle({
    //   title: isTeacher ? '导师信息' : '学生信息'
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
    let { userInfo } = app.store.getState()
    userInfo = userInfo || {}
    let detail = {
      nickname: userInfo.nickname,
      date_of_birth: '',
      phone: userInfo.phone || ''
    }
    detail.gender = ['男', '女'][userInfo.gender] || ''
    if (userInfo.date_of_birth) {
      detail.date_of_birth = userInfo.date_of_birth.replace(/-/, '年').replace(/-/, '月') + '日'
    }
    this.setData({ detail })
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
    let { detail } = this.data
    detail.date_of_birth = e.detail.value.replace(/-/, '年').replace(/-/, '月') + '日'
    this.setData({ detail }, () => this.putUserInfo())
  },

  bindUnitFocus: function ({ currentTarget }) {
    const { key } = currentTarget.dataset
    const lists = ['男', '女']
    const self = this
    let { detail } = this.data
    wx.showActionSheet({
      itemList: lists,
      success(res) {
        detail.gender = lists[res.tapIndex]
        self.setData({ detail }, () => self.putUserInfo())
      }
    })
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
