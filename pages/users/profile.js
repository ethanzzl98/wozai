// pages/users/profile.js
const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
const defaultNickname = 'Wechat User';
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    getUserProfile(e) {
        const page = this;
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
          }
        })
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
              page.getData()
          }
        })
    },

    // get recent vists and frequent visits
    getData () {
        let page = this;
        wx.request({
            url: `${app.globalData.baseUrl}/users/recent`,
            method: 'GET',
            header: app.globalData.header,
            success(res) {
                const recents = res.data.recents;
                page.setData({
                    recents: recents,
                });
                console.log(recents)
            }
        });
        wx.request({
            url: `${app.globalData.baseUrl}/users/frequent`,
            method: 'GET',
            header: app.globalData.header,
            success(res) {
                const frequents = res.data.frequents;
                page.setData({
                    frequents: frequents
                });
                console.log("frequents:",frequents)
            }
        })
    },

    onShow() {
        console.log('show')    
        this.setData({
            avatarUrl: app.globalData.user.avatar_url || defaultAvatarUrl,
            nickname: app.globalData.user.nickname || defaultNickname,
        })
        const defaultNotLogin = false;
        if (defaultNotLogin) {
            this.setData({
                avatarUrl: defaultAvatarUrl,
                nickname: defaultNickname,
            })
        }
        this.setData({
            isLogin: this.data.nickname !== defaultNickname
        })
        console.log(this.data)
        this.getData()
    },
    goToShow(e) {
        const id = e.currentTarget.dataset.index;
        app.globalData.venue_id = id;
        wx.navigateTo({
          url: `/pages/venues/show?id=${id}`,
        })
    },
})