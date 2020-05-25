import { formatData } from './util.js'

const baseUrl = 'https://api.trashaus.cn/api/'
// const apiKey = '?api_key=test'
const apiKey = 'test'

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
      success (res) {
        console.log('result', res.data)
        res.data && resolve(res.data)
      },
      fail(err) {
        wx.hideLoading()
        reject(err)
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
        res.data && resolve(res.data)
      },
      fail(err) {
        wx.hideLoading()
        reject(err)
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
