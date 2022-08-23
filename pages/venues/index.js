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
        selectedCategory: 'All',
        latitude: 31.233442,
        longitude: 121.437512
    },
    
    getData() {
        let page = this;
        wx.request({
          url: `${app.globalData.baseUrl}/venues`,
          method: 'GET',
          header: app.globalData.header,
          success(res) {
            const {venues} = res.data;
            const markers = venues.map((venue) => {
                return {
                    latitude: venue.latitude,
                    longitude: venue.longitude,
                    width: '60rpx',
                    height: '90rpx',
                    id: venue.id
                }
            });
            page.setData({
              venues: venues,
              markers: markers,
              latitude: app.globalData.latitude,
              longitude: app.globalData.longitude,
            });
            console.log("All the venues from the database:",venues)
            page.displayVenuesByCategory();
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
        this.mapCtx = wx.createMapContext('myMap')
        this.mapCtx.moveToLocation();
    },
    
    goToShow(e) {
        const id = e.currentTarget.dataset.index;
        app.globalData.venue_id = id;
        wx.navigateTo({
          url: `/pages/venues/show?id=${id}`,
        })
    },
    
    bindPickerChange(e) {
        this.setData({
            selectedCategory: this.data.array[e.detail.value]
        });
        console.log("Change category:",e.detail.value);
        this.displayVenuesByCategory();
    },

    displayVenuesByCategory() {
        const page = this;
        this.setData({
            venuesFiltered: page.data.selectedCategory === 'All' ? page.data.venues : page.data.venues.filter(venue => venue.categories.includes(page.data.selectedCategory))
        })
        console.log("Venues displayed:", page.data);
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