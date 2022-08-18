// pages/users/profile.js
const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    goToEdit() {
        wx.navigateTo({
          url: '/pages/users/edit',
        })
    },

    getUserProfile(e) {
        const page = this;
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            page.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickname: res.userInfo.nickName
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
          }
        })
    },
    
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log('show')
        this.setData({
            avatarUrl: app.globalData.user.avatar_url || defaultAvatarUrl,
            nickname: app.globalData.user.nickname || 'Wechat User'
        })
        console.log(this.data)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})