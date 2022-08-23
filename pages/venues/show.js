// pages/venues/show.js
const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
        leaders: [],
        active: true,
        isLogin: false
    },
    
    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        const page = this;
        app.globalData.venue_id = options.id;
        if (app.globalData.header) {
            page.getData()
        } else {
            wx.event.on('loginFinish', page, page.getData)
        }
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    getData() {
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
                    leaders: res.data.leaders,
                    user: app.globalData.user,
                    isLogin: true
                })
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
        wx.showModal({
            title: "Check in?",
            content: 'Would you like to check in here?',
            cancelText: 'No',
            cancelColor: 'red',
            confirmText: 'Yes',
            confirmColor: 'green',
            success (res) {
              if (res.confirm) {
                wx.request({
                    url:`${app.globalData.baseUrl}/venues/${id}/checkins`,
                    method: "POST",
                    header: app.globalData.header,
                    success(res) {
                        console.log('res data from check-in post ',res.data);
                        page.setData({ 
                            leaders: res.data.leaders,
                            active: false
                        })
                        
                        wx.showToast({
                          title: 'Checked in!',
                          duration: 2000,
                          icon: 'success'
                        })
                        page.getData();
                    }
                })

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
        const id = this.data.venue.id;
        console.log(id)
        return {
          title: this.data.venue.name,
          imgaUrl: this.data.venue.photo_url,
          path: `pages/venues/show?id=${id}`
        }
      },
})