//app.js
import Store from './utils/store.js';
import { formatTime, formatData, publicLogin } from './utils/util.js'
import { request, uploadFile, updateUserInfo } from './utils/api.js'
import { promisifyAll, promisify } from 'miniprogram-api-promise'
let store = new Store({
  state: {
    videoFullScreenPlaying: false, // 是否正在全屏播放
    userInfo: null,
    appLoaded: false, // app首次加载完毕
    isToLogined: false, //是否链条处跳转到过登陆页
    appInfo: {
      name: '青山计划'
    }
  },
  methods: {
    request,
    uploadFile,
    formatTime,
    publicLogin,
    updateUserInfo,
    shareApp: function (params) {
      // const pageTitles = {
      //   'my-page': '我的',
      //   'solution': '解决方案',
      //   'application': '合作申请'
      // }
      const allPages = getCurrentPages()
      const lastPage = allPages[allPages.length - 1] || {}
      let lastRoute = '/' + (lastPage.route || 'pages/home/home')
      if (params) {
        try {
          Object.keys(params).forEach((k, index) => {
            lastRoute += index > 0 ? '&' : '?'
            lastRoute += `${k}=${params[k]}`
          })
        } catch (e) { }
      }
      const title = store.getState().appInfo.name
      //pageTitles[lastRoute.slice(lastRoute.lastIndexOf('/') + 1)]
      const shareObj = {
        title: title,
        path: lastRoute
      }
      return shareObj
    }
  },
  pageLisener: {
    // onShareAppMessage: function (options) {
    // }
  }
})
App({
  onLaunch: function () {
    let wxp = {}
    promisifyAll(wx, wxp)
    // 获取用户信息
    this.globalData.userInfoPromise = new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.showLoading({
              title: 'Loading...',
              mask: true
            })
            wx.getUserInfo({
              success: ({ userInfo }) => {
                publicLogin(userInfo, request, store, () => {
                  wx.hideLoading()
                  resolve(userInfo)
                  console.log('初始化完成')
                })
                // const params = {
                //   url: 'users/1',
                //   method: 'GET',
                //   data: {
                //   }
                // }
                // request(params).then(result => {
                //   wx.hideLoading()
                //   store.setState({
                //     userInfo: formatData(result.data)
                //   })
                // })
              }
            })
          } else {
            reject('未授权')
          }
        }
      })
    })
  },
  onShow: function () {
    // if (store.$state.appLoaded) {
    //   wx.showLoading({
    //     title: 'Loading...',
    //     mask: true
    //   })
    //   updateUserInfo(() => { wx.hideLoading() })
    // }
  },
  globalData: {
    userInfoPromise: null
  },
  store: store
})
