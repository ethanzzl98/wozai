// pages/venues/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    getData() {
      let page = this;
      wx.request({
        url: `${app.globalData.baseUrl}/venues`,
        method: 'GET',
        header: app.globalData.header,
        success(res) {
          const {venues} = res.data;
          page.setData({
            venues: venues,
          });
          console.log(page.data)
        }
      })
    },
    onShow() {
      const page = this;
      if (app.globalData.header) {
        page.getData()
      } else {
        wx.event.on('loginFinish', page, page.getData)
      }
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