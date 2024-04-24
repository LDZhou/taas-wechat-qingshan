// pages/solution/retrospect/retrospect.js
import { throttle } from '../../../utils/util.js'

const app = getApp()
const { windowHeight } = wx.getSystemInfoSync()
const offset = 200

App.Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastProduct: {},
    chainDetail: {},
    scrollIndex: 0,
    indicatorIndex: 0,
    id: null,
    scan_code: null,
    showMask: false,
    currentLanguage: 'zh', // 默认语言是中文
    environmentIconSrc: '/assets/solution/retrospect/environment.png', // 默认图片路径
    processIconSrc: '/assets/solution/retrospect/process.png', // 默认路径
    carouselPhotos: [],
    saveImageButtonText: '',
    shareText: '', 
    recordTitle: '',
    weightTitle: '',
    quantityTitle: '',
    timeTitle: '',
    archiveTitle: '',
    whoIsTitle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id, scan_code }) {
    app.setNavBarTitle();
    this.setData({ id, scan_code });
    const content = wx.getStorageSync('content');
    this.setData({
      content: content,
    });
    this.updateLanguageSpecificContent();
    this.setLanguageSpecificImages();
    this.setLanguageSpecificText();
    this.setLanguageSpecificTe();
    this.setLanguageSpecificT();
    this.setLanguageSpecific();
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
    this.updateLanguageSpecificContent();
    this.setLanguageSpecificImages();
    this.setLanguageSpecificText();
    this.setLanguageSpecificTe();
    this.setLanguageSpecificT();
    this.setLanguageSpecific();
    app.setNavBarTitle();
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

  setLanguageSpecific: function() {
    const currentLanguage = wx.getStorageSync('language') || 'zh';
    // 根据 currentLanguage 设置所有文本的值
    this.setData({
      recordTitle: currentLanguage === 'en' ? 'Who is It' : 'TA是谁',
      weightTitle: currentLanguage === 'en' ? 'Weight' : '再生重量',
      quantityTitle: currentLanguage === 'en' ? 'Quantity' : '再生数量',
      timeTitle: currentLanguage === 'en' ? 'Time' : '再生时间',
      archiveTitle: currentLanguage === 'en' ? 'Recycling Archive' : '再生档案',
      whoIsTitle: currentLanguage === 'en' ? 'Who is it' : 'TA是谁',
      // ...其他文本...
    });
  },

  setLanguageSpecificT: function() {
    const currentLanguage = wx.getStorageSync('language') || 'zh';
    const shareText = currentLanguage === 'en' ? 'Generate image to share' : '生成图片分享到朋友圈';
    this.setData({ shareText });
  },

  setLanguageSpecificTe: function() {
    const currentLanguage = wx.getStorageSync('language') || 'zh';
    const saveImageButtonText = currentLanguage === 'en' ? 'Save Image' : '保存图片';
    this.setData({ saveImageButtonText });
  },

  updateLanguageSpecificContent: function() {
    const language = wx.getStorageSync('language') || 'zh'; // 获取语言设置
    let environmentIconSrc = '/assets/solution/retrospect/environment.png'; // 默认中文图片路径
    if (language === 'en') {
      environmentIconSrc = '/assets/solution/retrospect/environment_en.png'; // 英文图片路径
    }
    // 更新图片路径
    this.setData({
      environmentIconSrc: environmentIconSrc
    });
  },

  setLanguageSpecificImages: function() {
    const language = wx.getStorageSync('language') || 'zh'; // 假设你存储语言设置的方式如此
    let processIconSrc = '/assets/solution/retrospect/process.png'; // 中文图片路径
    if (language === 'en') {
      processIconSrc = '/assets/solution/retrospect/process_en.png'; // 英文图片路径
    }
    // 更新数据
    this.setData({
      processIconSrc: processIconSrc,
      // 也可以在这里设置其他语言特定的图片
    });
  },

  setLanguageSpecificText: function() {
    const currentLanguage = wx.getStorageSync('language') || 'zh';
    let carouselPhotos = this.getCarouselPhotosByLanguage(currentLanguage);
    this.setData({ carouselPhotos });
  },

  getCarouselPhotosByLanguage: function(language) {
    if (language === 'en') {
      return [
        {
          id: 0,
          url: '/assets/solution/retrospect/tree.png',
          des: 'Reduced \n CO2 Emissions',
          headerNum: 0,
          unit: 'kg',
          footer_1: 'Equivalent to a tree absorbing for ',
          footer_2: ' year',
          footerNum: 0,
          key: 'reduce_co2',
          compute: function (value) {
            return Math.ceil(value * 0.056)
          }
        },
        {
          id: 1,
          url: '/assets/solution/retrospect/power.png',
          des: 'Reduced \n Energy Usage',
          headerNum: 0,
          unit: 'kWh',
          footer_1: 'Equivalent to ',
          footer_2: ' months of electricity usage for a family of three',
          footerNum: 0,
          key: 'reduce_power',
          compute: function (value) {
            return Math.ceil(value * 0.0054)
          }
        },
        {
          id: 2,
          url: '/assets/solution/retrospect/bathtub.png',
          des: 'Reduced \n Landfill Volume',
          headerNum: 0,
          unit: 'm³',
          footer_1: 'Equivalent to the volume of ',
          footer_2: ' bathtubs',
          footerNum: 0,
          key: 'reduce_volume',
          compute: function (value) {
            return Math.ceil(value * 1.26)
          }
        }
      ];
    } else {
      return [
        {
          id: 0,
          url: '/assets/solution/retrospect/tree.png',
          des: '减少\n二氧化碳排放',
          headerNum: 0,
          unit: 'kg',
          footer_1: '相当于一棵树',
          footer_2: '年吸收的二氧化碳量',
          footerNum: 0,
          key: 'reduce_co2',
          compute: function (value) {
            return Math.ceil(value * 0.056)
          }
        },
        {
          id: 1,
          url: '/assets/solution/retrospect/power.png',
          des: '减少\n能源消耗',
          headerNum: 0,
          unit: 'kwh',
          footer_1: '相当于一家三口',
          footer_2: '个月的正常用电量',
          footerNum: 0,
          key: 'reduce_power',
          compute: function (value) {
            return Math.ceil(value * 0.0054)
          }
        },
        {
          id: 2,
          url: '/assets/solution/retrospect/bathtub.png',
          des: '减少\n填埋体积',
          headerNum: 0,
          unit: 'm³',
          footer_1: '相当于',
          footer_2: '个浴缸的体积',
          footerNum: 0,
          key: 'reduce_volume',
          compute: function (value) {
            return Math.ceil(value * 1.26)
          }
        }
      ];
    }
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

  onPageScroll: throttle(function (e) {
    // console.log('e', e)
    this.computedProduts()
  }, 200),

  // onPageScroll: function (e) {
  //   console.log('e', e)
  //   this.computedProduts()
  // },

  computedProduts: function () {
    const self = this
    const queryAll = wx.createSelectorQuery()
    queryAll.selectAll('.product-container').boundingClientRect()
    queryAll.selectViewport().scrollOffset()
    queryAll.exec(function ([res]) {
      console.log(res)
      for (let index = 0; index < res.length; index++) {
        const { height, top } = res[index]
        if (windowHeight - offset > top && top > offset) {
          console.log('=>', index)
          self.setData({ scrollIndex: index })
          break
        }
      }
    })
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

  posterSwiperChange: function ({ currentTarget, detail }) {
    const { current } = detail
    this.setData({ indicatorIndex: current })
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
    const { scan_code, carouselPhotos } = this.data
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
      const newCarouselPhotos = carouselPhotos.map(item => {
        item.headerNum = result.data[item.key] || 0
        item.footerNum = item.compute(item.headerNum)
        return item
      })
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
        const specialTitles = ["Recycling Plastic Food Containers", "Textile Production"];
        if (item.quantity && !specialTitles.includes(item.productTitle)) {
          item.showNumberContent = item.quantity + '个'
        } 
        else if(item.quantity && specialTitles.includes(item.productTitle)){
          item.showNumberContent = item.quantity
        }
        else {
          item.showNumberContent = item.weight ? item.weight + 'kg' : ''
        }
        if (item.manufactured_at) {
          // 解析日期字符串为Date对象
          const dateParts = item.manufactured_at.split('-').map(part => parseInt(part, 10));
          const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // 月份从0开始计算
          // 格式化日期
          item.manufactured_at = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
        } else {
          item.manufactured_at = '';
        }
        return item;
      })
      const lastProduct = result.data.products[result.data.products.length - 1] || {}
      lastProduct.photos = lastProduct.photos || []
      result.data.products.splice(result.data.products.length - 1, 1)
      wx.hideLoading()
      self.setData({ chainDetail: result.data, lastProduct, carouselPhotos: newCarouselPhotos })
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
            title: 'Error',
            icon: 'none'
          })
        }
      })
    })
  },

  posterSwiperChange: function ({ detail }) {
    const { current } = detail
    this.setData({ indicatorIndex: current })
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
        title: 'Error',
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
          title: 'Error',
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
                    title: '保存成功 \n Saved',
                    icon: 'none'
                  })
                }
              })
            },
            fail: function (e) {
              wx.hideLoading()
              wx.showToast({
                title: 'Error',
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