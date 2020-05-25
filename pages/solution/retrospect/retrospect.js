// pages/solution/retrospect/retrospect.js
const app = getApp()
App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastProduct: {},
    chainDetail: {},
    currentIndex: 0,
    id: null,
    scan_code: null,
    showMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id, scan_code }) {
    this.setData({ id, scan_code })
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
    const { id } = this.data
    app.globalData.userInfoPromise
      .then(() => {
        this.getChainDetail(id)
      })
      .catch(() => {
        const { isToLogined } = app.store.getState()
        if (isToLogined) {
          this.getChainDetail(id)
        } else {
          app.store.setState({
            isToLogined: true
          })
          wx.navigateTo({
            url: '/pages/my-page/login/login',
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { id, scan_code } = this.data
    let params = {
      id
    }
    scan_code && (params.scan_code = scan_code)
    return this.shareApp(params)
  },

  getChainDetail: function (id) {
    this.getPosition()
    .then((position) => {
      this.detailInit(id, position)
    })
    .catch((err) => {
      this.detailInit(id)
    })
  },

  detailInit: function (id, position) {
    const { scan_code } = this.data
    let apiParams = {}
    if (position) {
      apiParams.latitude = position.latitude
      apiParams.longitude = position.longitude
    }
    if (scan_code) {
      apiParams.scan_code = 'true'
    }
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    const params = {
      url: 'chains/' + id,
      method: 'GET',
      data: {
        ...apiParams
      }
    }
    const self = this
    // const productNames = ['废料回收', '破碎清洗', '再生造粒', '产品制造']
    this.request(params).then(result => {
      result.data.products = result.data.products || []
      result.data.products = result.data.products.map((item, index) => {
        item.name = item.name || ''
        // item.productTitle = productNames[index] || item.name || ''
        item.productTitle = item.title || ''
        // item.showBackgroundImg = `/assets/solution/product-${index + 1}.jpg`
        item.showBackgroundImg = item.photos && item.photos[0] ? item.photos[0].url : ''
        item.quantity = item.quantity || ''
        item.weight = item.weight || ''
        item.brand_name = item.brand_name || ''
        item.sender_address = item.sender_address || ''
        if (item.quantity) {
          item.showNumberContent = item.quantity + '个'
        } else {
          item.showNumberContent = item.weight ? item.weight + 'kg' : ''
        }
        if (item.manufactured_at) {
          item.manufactured_at = item.manufactured_at.replace(/-/, '年').replace(/-/, '月') + '日'
        } else {
          item.manufactured_at = ''
        }
        return item
      })
      const lastProduct = result.data.products[result.data.products.length - 1] || {}
      lastProduct.photos = lastProduct.photos || []
      result.data.products.splice(result.data.products.length - 1, 1)
      wx.hideLoading()
      self.setData({ chainDetail: result.data, lastProduct })
    })
  },

  getPosition: function () {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject()
          wx.showToast({
            title: '位置信息获取失败，请手动授权',
            icon: 'none'
          })
        }
      })
    })
  },

  previewImage: function (e) {
    const { currentIndex } = e.currentTarget.dataset
    const { photos } = this.data
    wx.previewImage({
      current: photos[currentIndex] ? photos[currentIndex].url : '',
      urls: photos.map(item => item.url)
    })
  },

  posterSwiperChange: function ({ detail }) {
    const { current: currentIndex } = detail
    this.setData({ currentIndex })
  },

  bindShowMask: function () {
    this.setData({ showMask: true })
  },

  bindHideMask: function () {
    this.setData({ showMask: false })
  },

  catchShareTap: function () { },
  
  catchMaskMove: function () {},

  bindShare: function () {
    const { share_photo } = this.data.chainDetail
    const self = this
    if (!share_photo) {
      wx.showToast({
        title: '缺少分享图',
        icon: 'none'
      })
      return
    }

    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        self.saveImage()
      },
      fail() {
        wx.showToast({
          title: '权限获取失败，请手动授权',
          icon: 'none'
        })
      }
    })
  },

  saveImage: function () {
    const { share_photo } = this.data.chainDetail
    const self = this
    wx.getSetting({
      success: getSettingRes => {
        if (getSettingRes.authSetting['scope.writePhotosAlbum']) {
          wx.showLoading({
            title: 'Loading...',
            mask: true
          })
          wx.getImageInfo({
            src: share_photo.url,
            success: function (getImageRes) {
              wx.saveImageToPhotosAlbum({
                filePath: getImageRes.path,
                success: function (saveRes) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                }
              })
            },
            fail: function (e) {
              wx.hideLoading()
              wx.showToast({
                title: '获取图片失败',
                icon: 'none'
              })
            },
            complete: function () {
              self.setData({ showMask: false })
            }
          })
        }
      }
    })
  }

})