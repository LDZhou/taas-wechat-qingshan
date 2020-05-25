const formatTime = time => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

function formatData(data) {
  data.brand = data.brand || {}
  return data
}

function publicLogin(userInfo, request, store, cbk) {
  wx.login({
    success: ({ code }) => {
      const params = {
        url: 'users/login',
        method: 'POST',
        data: {
          user: {
            wechat_code: code,
            nickname: userInfo.nickName,
            city: userInfo.city,
            province: userInfo.province,
            gender: userInfo.gender,
            avatarUrl: userInfo.avatarUrl
          }
        }
      }
      request(params).then(result => {
        store.setState({
          userInfo: formatData(result.data),
          appLoaded: true
        })
        cbk && cbk()
      })
    }
  })
}

module.exports = {
  formatTime,
  formatData,
  publicLogin
}
