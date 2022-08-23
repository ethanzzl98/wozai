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
    data:{
        array: ["All","Bar", "Beauty", "Cafe", "Education", "Gym", "Hookah", "Museum", "Park","Restaurant", "Shopping", "Sports"],
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
        selectedCategory: 'All'
    },
    onLoad(options) {
      setTimeout(function () {
        wx.hideLoading()
      }, 1500)

      this.mapContext = wx.createMapContext('myMap');

        var that = this
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
              console.log('res from getting location -------> ', res)
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
            console.log(venues)
            page.displayVenuesByCategory();
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
    
    bindPickerChange(e) {
        this.setData({
            selectedCategory: this.data.array[e.detail.value]
        });
        console.log(e.detail)
        this.displayVenuesByCategory();
    },

    displayVenuesByCategory() {
        const page = this;
        
        this.setData({
            venuesFiltered: page.data.selectedCategory === 'All' ? page.data.venues : page.data.venues.filter(venue => venue.categories.includes(page.data.selectedCategory))
        })
        console.log(page.data);
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