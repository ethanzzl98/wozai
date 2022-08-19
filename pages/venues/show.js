// pages/venues/show.js
const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
        leaders: [],
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: (options) => {

    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {
        const page = this;
        const id = app.globalData.venue_id;
        wx.request({
            url:`${app.globalData.baseUrl}/venues/${id}`,
            method: "GET",
            header: app.globalData.header,
            success(res) {
                console.log('res from getting restsurant information', res.data)
                page.setData({
                    venue: res.data,
                    leaders: res.data.leaders
                })
                // wx.request({
                //     url:`${app.globalData.baseUrl}/venues/${id}/checkins`,
                //     method: "GET",
                //     header: app.globalData.header,
                //     success(res) {
                //         page.setData({
                //             leaders: res.data.leaders
                //         })
                //         console.log(page.data.leaders)
                //     }
                // })
            }
        });
    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {

    },

    checkin() {
        const page = this;
        const id = page.data.venue.id;
        if (!app.globalData.user.nickname) {
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                  page.setData({
                      avatarUrl: res.userInfo.avatarUrl,
                      nickname: res.userInfo.nickName,
                      isLogin: true
                  })
                  app.globalData.user.avatar_url = page.data.avatarUrl;
                  app.globalData.user.nickname = page.data.nickname;
                  page.saveUserProfile();
                  page.actualCheckIn(id)
                }
            })
        } else {
            page.actualCheckIn(id)
        }
        
    },

    saveUserProfile() {
        const page = this;
        const body = {
            avatar_url: page.data.avatarUrl,
            nickname: page.data.nickname
        }
        console.log("body:", body)
        wx.request({
          url: `${app.globalData.baseUrl}/users/profile`,
          method: 'POST',
          header: app.globalData.header,
          data: body,
          success(res) {
              console.log("user profile updated")
          }
        })
    },

    actualCheckIn(id){
        let page = this
        wx.request({
            url:`${app.globalData.baseUrl}/venues/${id}/checkins`,
            method: "POST",
            header: app.globalData.header,
            success(res) {
                console.log('res data from check-in post ',res.data);
                page.setData({ leaders: res.data.leaders})
            }
        }),
        wx.showModal({
            title: "Check-in?",
            content: 'Would you like to check in here?',
            success (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
    },
    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom() {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() {

    }
})