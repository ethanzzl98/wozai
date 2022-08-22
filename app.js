// app.js
import event from './utils/event'
wx.event = event
App({
  onLaunch() {
    // 展示本地存储能力
    const app = this;
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: `${app.globalData.baseUrl}/login`,
          method: 'post',
          data: { code: res.code }, // pass code in request body
          success(loginRes) {
            // console.log(loginRes) // { data: { headers: { "X-USER-TOKEN": <User Token> }, user: <User Object> }, ... }
            app.globalData.user = loginRes.data.user // save in globalData, so we can use them throughout the MP
            app.globalData.header = loginRes.data.headers
            console.log('login success')
            wx.event.emit('loginFinish')
          }
        })
      }
    })
  },
  globalData: {
    header: null,
    // baseUrl: 'https://wozai.wogengapp.cn/api/v1',
    baseUrl: 'http://localhost:3000/api/v1',
    user: null
  }
})
