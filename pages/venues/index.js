// pages/venues/index.js
const app = getApp()
Page({

    /**
     * Page initial data
     */
    data: {

    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {

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
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: {
        function (e) {
            // Use wx.createMapContext to obtain the map context
            this.mapCtx = wx.createMapContext('myMap')
        },
        getCenterLocation: function () {
            this.mapCtx.getCenterLocation({
              success: function(res){
                console.log(res.longitude)
                console.log(res.latitude)
              }
            })
          },
          moveToLocation: function () {
            this.mapCtx.moveToLocation()
          },
          translateMarker: function() {
            this.mapCtx.translateMarker({
              markerId: 0,
              autoRotate: true,
              duration: 1000,
              destination: {
                
              },
              animationEnd() {
                console.log('animation end')
              }
            })
          },
          includePoints: function() {
            this.mapCtx.includePoints({
              padding: [10],
            //   points: [{
            //     latitude:23.10229,
            //     longitude:113.3345211,
            //   }, {
            //     latitude:23.00229,
            //     longitude:113.3345211,
            //   }]
            })
          }
        },

    /**
     * Lifecycle function--Called when page show
     */

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