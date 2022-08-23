// pages/lessons/form.js
const app = getApp();
Page({
  
  data: {
    showIconPicker: false,
  },

  updateData(e) {
    let key = e.currentTarget.dataset.name; 
    let value = e.detail.value
    key = `lesson.${key}`
    this.setData({ [key]: value })
  },

  bindStartDateChange(e) {
    this.setData({'lesson.start_date': e.detail.value })
  },

  changeIcon(e) {
    this.setData({'lesson.icon_url': e.detail.icon, showIconPicker: false})
  },

  bindStartTimeChange(e) {
    this.setData({'lesson.start_time': e.detail.value,  })
  },

  bindEndTimeChange(e) {
    this.setData({'lesson.end_time': e.detail.value })
  },

  chooseIcon() {
    this.setData({
      showIconPicker: true
    })
  },


  closeIconPicker() {
    this.setData({
      showIconPicker: false
    })
  },

  createLesson: function () {

  // createLesson() {

    const page = this;
    if (page.data.isEdit) {
      this.makeUpdateLessonRequest()
    } else {
      this.makeCreateLessonRequest()
    }
  },

  makeUpdateLessonRequest() {
    const page = this;
    wx.request({
      url: `${app.globalData.baseUrl}/lessons/${page.data.id}`,
      method: 'PATCH',
      header: app.globalData.header,
      data: page.data.lesson,
      success: (res) => {
        // console.log(res);
        wx.switchTab({
          url: '/pages/lessons/index',
        })
      }
    })
  },

  makeCreateLessonRequest() {
    const page = this;
    wx.request({
      url: `${app.globalData.baseUrl}/lessons`,
      method: 'POST',
      header: app.globalData.header,
      data: page.data.lesson,
      success: (res) => {
        console.log(page.data.lesson)
        wx.switchTab({
          url: '/pages/lessons/index',
        })
      }
    })
  },

  onShow() {
    const page = this;
    const data = {
      isEdit: false,
      lesson: {
        user_id: app.globalData.user.id,
        start_date: page.getISODate(),
        start_time: "10:00",
        end_time: "11:00",
      },
      id: null,
    };
    if (app.globalData.lessonId !== null && app.globalData.lessonId !== undefined) {
      data.isEdit = true;
      data.lesson = Object.assign(data.lesson, app.globalData.lesson);
      data.lesson.start_date = page.getISODate(data.lesson.start_date);
      data.id = app.globalData.lessonId;
      app.globalData.lesson = undefined;
      app.globalData.lessonId = undefined;
    } 
    page.setData(data);

    page.setData({
      'lesson.user_id': app.globalData.user.id
    })
  },
  goBack() {
    if (this.data.isEdit) {
      wx.redirectTo({
        url: `/pages/lessons/show?id=${this.data.id}`,
      })
    } else {
      wx.switchTab({
        url: '/pages/lessons/index'
      })
    }

  },

  getISODate(str) {
    const date = str === undefined? new Date() : new Date(str);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const yearString = year.toString();
    const monthString = (month < 10 ? "0" : "") + month;
    const dayString = (day < 10 ? "0" : "") + day;
    return `${yearString}-${monthString}-${dayString}`;
  }
})


