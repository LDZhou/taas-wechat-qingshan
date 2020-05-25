// pages/home/application/application.js
const app = getApp()
const brandType = {
  1: '商业品牌',
  2: '收运⽅',
  3: '打包站',
  4: '造粒⼚',
  5: '制品⼚',
  6: '设计公司',
  7: '认证机构',
  8: '咨询公司',
  9: 'NGO/NPO',
  10: '材料贸易商',
  11: '制品贸易商',
  12: '仓储',
  13: '废弃物管理',
  14: '物流公司',
  99: '其他'
}
const brandTypeLists = Object.values(brandType)
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    paddingTop: 0,
    rows: [
      {
        title: '您的公司',
        placeholder: '请输入您的公司',
        key: 'name',
        tag: 'input'
      },
      {
        title: '公司类型',
        placeholder: '请输入公司类型',
        key: 'brand_type',
        options: brandTypeLists,
        tag: 'picker'
      },
      {
        title: '公司地址',
        placeholder: '请输入公司地址',
        key: 'address',
        tag: 'input'
      },
      {
        title: '您的姓名',
        placeholder: '请输入您的姓名',
        key: 'contact_name',
        tag: 'input'
      },
      {
        title: '您的职位',
        placeholder: '请输入您的职位',
        key: 'contact_title',
        tag: 'input'
      },
      {
        title: '您的电话',
        placeholder: '请输入您的电话',
        key: 'contact_phone',
        tag: 'input',
        type: 'number',
        maxlength: 11
      },
      {
        title: '您的邮箱',
        placeholder: '请输入您的邮箱',
        key: 'contact_email',
        tag: 'input'
      }
    ],
    modelMessage: {
      title: '提交成功',
      content: '',
      confirmText: 'OK'
    },
    disabled: true,
    form: {
      name: '',
      brand_type: '',
      address: '',
      contact_name: '',
      contact_title: '',
      contact_phone: '',
      contact_email: '',
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
    this.model = this.selectComponent('#model')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  onShareAppMessage: function () {
    return this.shareApp()
  },

  bindinput: function (e) {
    let { form } = this.data
    const { key } = e.currentTarget.dataset
    form[key] = e.detail.value
    const disabled = Object.values(form).some(i => Boolean(i) === false)
    this.setData({ form, disabled })
  },

  bindInputBlur: function (e) {
  },

  bindSelectorChange: function ({ currentTarget, detail }) {
    const { key } = currentTarget.dataset
    let { form } = this.data
    form[key] = brandTypeLists[detail.value]
    this.setData({ form })
  },

  hideModel: function () {
    wx.navigateBack()
  },

  bindSubmit: function () {
    const { disabled, form } = this.data
    if (disabled) {
      return
    }
    form.brand_type = Object.keys(brandType).find(k => brandType[k] === form.brand_type)
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
      self.model.show()
      // this.setData({ disabled: true })
    })
  }
})
