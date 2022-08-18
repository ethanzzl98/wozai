// pages/landing/index.js

const app = getApp()
Page({

    /**
     * Page initial data
     */

    data: {

    },

    enterIndex() {
       

      wx.switchTab({
        url: '/pages/venues/index',
      })
    },

    

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
    },
    
    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {
        
    },
    
    /**
     * Lifecycle function--Called when page show
     */
    onShow() {
        // console.log("i'm here")
        // wx.getLocation({
        //     type: 'wgs84',
        //     success (res) {
        //         const latitude = res.latitude
        //         const longitude = res.longitude
        //         app.globalData['mylocation'] ={latitude, longitude}
        //     }
        // })

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