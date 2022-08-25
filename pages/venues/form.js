// pages/venues/form.js
const app = getApp();

Page({

  data: {
      address: "",
      items: [
          {value: "bar", name: "Bar"},
          {value: "beauty", name: "Beauty"},
          {value: "cafe", name: "Cafe"},
          {value: "education", name: "Education"},
          {value: "gym", name: "Gym"},
          {value: "hookah", name: "Hookah"},
          {value: "museum", name: "Museum"},
          {value: "park", name: "Park"},
          {value: "restaurant", name: "Restaurant"},
          {value: "shopping", name: "Shopping"},
          {value: "sports", name: "Sports"}
      ],
      form: {},
      photoPath: ''
  },

  addData(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type
    const form = this.data.form
    form[type] = e.detail.value
    this.setData({form})
  },

  toPosition: function (e) {
    let page = this;
    const form = this.data.form;
    wx.chooseLocation({
        success(res) {
            if(res.address!=''){
                form['address'] = res.address
                form['latitude'] = res.latitude
                form['longitude'] = res.longitude
                page.setData({
                    form
                })
            }
        }
    })
  },

  checkboxChange (e) {
    console.log(e.detail.value);
    const items = this.data.items;
    const values = e.detail.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
        items
      })
    },

  bindOpenTimeChange(e) {
      console.log(e.detail.value)
    const form = this.data.form
    form['open_time'] = e.detail.value
      this.setData({form})
    },
    
    bindCloseTimeChange(e) {
        console.log(e.detail.value)
        const form = this.data.form
        form['close_time'] = e.detail.value
          this.setData({form})
    },
    
    chooseImg: function() {
      var that = this;
      const form = that.data.form
      wx.chooseImage({
               Count: 5, // Default 9 
               Siztype: ['Original', 'compressed'], // can be specified as the original image or a compressed map, the default is 
               SourceType: ['Album', 'Camera'], // You can specify the source is the album or the camera, the default is 
        success: function(res) {
          console.log(res)
        //   form['photo'] = res.tempFilePaths[0]
          that.setData({
            photoPath: res.tempFilePaths[0]
          })
        }
      })
    },

  save: function (e) {
      let page = this;
      let categories = []
      let { items, form } = page.data
    //   console.log({e});
    items.forEach((item) => {
        if (item.checked) {
            categories = [ ...categories, item.name ]
        }
    })
      const url = app.globalData.baseUrl;
      const id = e.currentTarget.dataset.id;
      const d = this.data;
    //   console.log(d);
      let data = e.detail.value;
      wx.request({
        url: `${app.globalData.baseUrl}/venues`,
        method: "POST",
        header: app.globalData.header,
        data: {
           venue: form,
           categories: categories
        },
        success(res) {
            console.log(res)
            wx.uploadFile({
              filePath: page.data.photoPath,
              name: 'file',
              url: `${app.globalData.baseUrl}/venues/${res.data.id}/upload`,
              header: app.globalData.header,
              success(res) {
                console.log('this is uploaded successfully', res)
                wx.setStorageSync('new', true)
                // wx.navigateTo({
                //   url: `/pages/venues/show?id=${res.data.id}`,
                // })
                wx.switchTab({
                  url: '/pages/venues/index',
                })
              }
            })
        }
      })
  },

  onShow(){
      if (wx.getStorageSync('new')) this.setData({form: {}})
      wx.setStorageSync('new', false)
      
  },

//   onShow() {
//     const page = this;
//     const data = {
//       isEdit: false,
//       venue: {
//         user_id: app.globalData.user.id,
//       },
//       id: null,
//     };
//     if (app.globalData.venueId !== null && app.globalData.venueId !== undefined) {
//       data.isEdit = true;
//       data.venue = Object.assign(data.venue, app.globalData.venue);
//       data.venue.start_date = page.getISODate(data.venue.start_date);
//       data.id = app.globalData.venueId;
//       app.globalData.venue = undefined;
//       app.globalData.venueId = undefined;
//     } 
//     page.setData(data);

//     page.setData({
//       'venue.user_id': app.globalData.user.id
//     })
//   }
})


