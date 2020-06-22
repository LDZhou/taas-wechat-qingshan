import { formatData } from './util.js'

const baseUrl = 'https://api.trashaus.cn/api/'
const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhcHBfaWQiOjIsImV4cCI6NDc0NDMxNzY3M30.IOeVeqFY59RiSwt4q1Oaae36imewROD8PGifYFc2QFo'


function exceptionHandling({ err, reject }) {
  let errTitle = ''
  if (Object.prototype.toString.call(err) === '[object Error]') {
    errTitle = err.toString()
  } else {
    try {
      errTitle = err.em || '服务器异常'
    } catch (error) {
      errTitle = '服务器异常'
    }
  }
  wx.hideLoading()
  wx.showToast({
    title: errTitle,
    icon: 'none'
  })
  reject(err)
}


export function request(params) {
  const { userInfo } = getApp().store.$state
  return new Promise(function (resolve, reject) {
    let autoParams = {
      url: '',
      data: '',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Api-Key': apiKey
      },
      timeout: 30000,
      success(res) {
        console.log('result', res)
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          exceptionHandling({ err: res.data, reject })
        }
      },
      fail(err) {
        exceptionHandling({ err, reject })
      }
    }
    if (userInfo && userInfo.authentication_token) {
      autoParams.header['Authorization'] = userInfo.authentication_token
    }
    const autoUrl = baseUrl + (params.url || '')
    wx.request(Object.assign(autoParams, params, { url: autoUrl }))
  })
}

export function uploadFile(params) {
  const { userInfo } = getApp().store.$state
  return new Promise(function (resolve, reject) {
    let autoParams = {
      url: '',
      filePath: '',
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
        'Api-Key': apiKey
      },
      formData: {
      },
      timeout: 30000,
      success(res) {
        console.log('result', res.data)
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          exceptionHandling({ err: res.data, reject })
        }
      },
      fail(err) {
        exceptionHandling({ err, reject })
      }
    }
    if (userInfo && userInfo.authentication_token) {
      autoParams.header['Authorization'] = userInfo.authentication_token
    }
    const autoUrl = baseUrl + (params.url || '')
    // console.log('=>', Object.assign(autoParams, params, { url: autoUrl }))
    wx.uploadFile(Object.assign(autoParams, params, { url: autoUrl }))
  })
}

export function updateUserInfo(cbk) {
  const app = getApp()
  const { userInfo } = app.store.$state
  const params = {
    url: `users/${userInfo.id}`,
    method: 'GET',
    data: {
    }
  }
  request(params).then(result => {
    const newFormatData = formatData(result.data)
    app.store.setState({
      userInfo: newFormatData
    }, () => { cbk && cbk(newFormatData) })
  })
}
