// pages/venues/index.js
const key = 'LF7BZ-EFY3X-EKR46-TQDA2-CJE43-5BBXH'; //使用在腾讯位置服务申请的key
const referer = 'Wozai'; //调用插件的app的名称
// const location = JSON.stringify({
//   latitude: 31.233827538484224, 
//   longitude: 121.43734040846482
// });
const category = '生活服务,娱乐休闲';
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
    
      wx.showLoading({
        title: 'Loading',
      })
      
      setTimeout(function () {
        wx.hideLoading()
      }, 1500)

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
            // console.log(page.data)
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

    onReady() {
            // Use wx.createMapContext to obtain the map context
           this.mapCtx = wx.createMapContext('myMap')

            this.mapCtx.getCenterLocation({
              success: function(res){
                console.log({res})
                // console.log(res.latitude)
              }
            })

            this.mapCtx.moveToLocation()
          
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
            // wx.navigateTo({
            //     url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
            //   });
        },
    
        
    goToShow(e) {
        const id = e.currentTarget.dataset.index;
        app.globalData.venue_id = id;
        wx.navigateTo({
          url: `/pages/venues/show?id=${e.currentTarget.dataset.id}`,
        })
        // const id = e.currentTarget.dataset.index;
        // app.globalData.venue_id = id;
        // wx.switchTab({
        //   url: '/pages/venues/show',
        // })
    },
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