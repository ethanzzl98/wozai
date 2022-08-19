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
        
        markers: [{
            latitude: 31.233442,
            longitude: 121.437512,
            name: 'Le Wagon',
            desc: '我现在的位置'
        },{
            latitude: 31.234511,
            longitude: 121.45017,
            name: 'The Shed',
            desc: '我现在的位置'
        },{
            latitude: 23.099994,
            longitude: 113.324520,
            name: 'T.I.T 创意园',
            desc: '我现在的位置'
        },
        {
            latitude: 23.099994,
            longitude: 113.324520,
            name: 'T.I.T 创意园',
            desc: '我现在的位置'
        },
        {
            latitude: 23.099994,
            longitude: 113.324520,
            name: 'T.I.T 创意园',
            desc: '我现在的位置'
        }
    ],
        covers: [{
            latitude: 31.233442,
            longitude: 121.437512,
            iconPath: '../../images/wechart.png',
            rotate: 10
        }, {
            latitude: 31.234511,
            longitude: 121.45017,
            iconPath: '../../images/wechart.png',
            rotate: 90
            }]
          
    },
    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
    
      
      
      setTimeout(function () {
        wx.hideLoading()
      }, 1500)

      this.mapContext = wx.createMapContext('myMap');

        var that = this
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
              console.log(res)
                var latitude = res.latitude; 
                var longitude = res.longitude; 
            }
        });
    
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
              markerId: 1,
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