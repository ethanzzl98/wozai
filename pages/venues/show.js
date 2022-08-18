// pages/venues/show.js
const app = getApp();
Page({

    /**
     * Page initial data
     */
    data: {
        leaders: []
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
        const page = this;
        const id = app.globalData.venue_id;
        wx.request({
            url:`${app.globalData.baseUrl}/venues/${id}`,
            method: "GET",
            header: app.globalData.header,
            success(res) {
                page.setData({
                    venue: res.data
                })
                wx.request({
                    url:`${app.globalData.baseUrl}/venues/${id}/checkins`,
                    method: "GET",
                    header: app.globalData.header,
                    success(res) {
                        page.setData({
                            leaders: res.data.leaders
                        })
                        console.log(page.data.leaders)
                    }
                })
            }
        });
        
    },

    checkin() {
        const page = this;
        const id = page.data.venue.id;
        wx.request({
            url:`${app.globalData.baseUrl}/venues/${id}/checkins`,
            method: "POST",
            header: app.globalData.header,
            success(res) {
                console.log(res.data);
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