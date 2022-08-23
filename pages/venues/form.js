// pages/venues/form.js
const app = getApp();


Page({
  
  data: {
        latitude: 31.233442,
        longitude: 121.437512
  },

  bindStartTimeChange(e) {
      console.log(e)
      this.setData({'venue.start_time': e.detail.value})
  },

  chooseImg: function() {
    var that = this;
    wx.chooseImage({
             Count: 5, // Default 9 
             Siztype: ['Original', 'compressed'], // can be specified as the original image or a compressed map, the default is 
             SourceType: ['Album', 'Camera'], // You can specify the source is the album or the camera, the default is 
      success: function(res) {
        console.log(res)
        that.setData({
          img: res.tempFilePaths[0],
        })
      }
    })
  },

  bindEndTimeChange(e) {
    this.setData({'venue.end_time': e.detail.value})
  },

  createLesson: function () {
    const page = this;
    if (page.data.isEdit) {
      this.makeUpdateVenueRequest()
    } else {
      this.makeCreateVenueRequest()
    }
  },

  makeCreateLessonRequest() {
    const page = this;
    wx.request({
      url: `${app.globalData.baseUrl}/venues`,
      method: 'POST',
      header: app.globalData.header,
      data: page.data.venue,
      success: (res) => {
        console.log(page.data.venue)
        wx.switchTab({
          url: '/pages/venues/index',
        })
      }
    })
  },

  onShow() {
    const page = this;
    const data = {
      isEdit: false,
      venue: {
        user_id: app.globalData.user.id,
      },
      id: null,
    };
    if (app.globalData.venueId !== null && app.globalData.venueId !== undefined) {
      data.isEdit = true;
      data.venue = Object.assign(data.venue, app.globalData.venue);
      data.venue.start_date = page.getISODate(data.venue.start_date);
      data.id = app.globalData.venueId;
      app.globalData.venue = undefined;
      app.globalData.venueId = undefined;
    } 
    page.setData(data);

    page.setData({
      'venue.user_id': app.globalData.user.id
    })
  },
  goBack() {
    if (this.data.isEdit) {
      wx.redirectTo({
        url: `/pages/venue/show?id=${this.data.id}`,
      })
    } else {
      wx.switchTab({
        url: '/pages/venue/index'
      })
    }

  },
})


