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

function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

module.exports = {
  formatTime,
  formatData,
  publicLogin,
  throttle
}
