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
        array: ["Bar", "Beauty", "Cafe", "Education", "Gym", "Hookah", "Museum", "Park","Restaurant", "Shopping", "Sports"],
    objectArray: [
      {
        id: 0,
        name: "Bar"
      },
      {
        id: 1,
        name: "Beauty"
      },
      {
        id: 2,
        name: "Cafe"
      },
      {
        id: 3,
        name: "Education"
      },
      {
        id: 4,
        name: "Gym"
      },
      {
        id: 5,
        name: "Hookah"
      },
      {
        id: 6,
        name: "Museum"
      },
      {
        id: 7,
        name: "Park"
      }
      ,
      {
        id: 8,
        name: "Restaurant"
      }
      ,
      {
        id: 9,
        name: "Shopping"
      }
      ,
      {
        id: 10,
        name: "Sports"
      }
    ],
    //     markers: [{
    //         latitude: 31.233442,
    //         longitude: 121.437512,
    //         name: 'Le Wagon',
    //     },{
    //         latitude: 31.234511,
    //         longitude: 121.45017,
    //         name: 'The Shed',
    //     },{
    //         latitude: 31.23508,
    //         longitude: 121.44653,
    //         name: 'The Grand Yard',
    //     },
    //     {
    //         latitude: 31.235167,
    //         longitude: 121.450486,
    //         name: 'Gin & Juice',
    //     },
    //     {
    //         latitude: 31.21586,
    //         longitude: 121.45579,
    //         name: 'Liquid Laundry',
    //     },
    //     {
    //         latitude: 31.216576,
    //         longitude: 121.456041,
    //         name: 'Beef & Liberty',
    //     },
    //     {
    //         latitude: 31.229142,
    //         longitude: 121.45579,
    //         name: 'Fat Cow',
    //     },
    //     {
    //         latitude: 31.20451,
    //         longitude: 121.4306,
    //         name: 'Pie Society',
    //     },
    //     {
    //         latitude: 31.229115,
    //         longitude: 121.45435,
    //         name: 'Brothers Kebab',
    //     },
    //     {
    //         latitude: 31.21085,
    //         longitude: 121.44313,
    //         name: 'Boxing Cat Brewery',
    //     },
    //     {
    //         latitude: 31.215026,
    //         longitude: 121.44168,
    //         name: 'New York Pizza',
    //     },
    //     {
    //         latitude: 31.239912,
    //         longitude: 121.466442,
    //         name: 'The Beer Lady',
    //     },
    // ]   
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
            const markers = venues;
            page.setData({
              venues: venues,
              markers: markers
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
        },
    
        
    goToShow(e) {
        const id = e.currentTarget.dataset.index;
        app.globalData.venue_id = id;
        wx.navigateTo({
          url: `/pages/venues/show?id=${e.currentTarget.dataset.id}`,
        })
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

    },

})