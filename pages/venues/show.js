// pages/venues/show.js
const app = getApp();
const key = app.globalData.key;
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let qqmapsdk;
const allowCheckinDistance = 100;
Page({

    /**
     * Page initial data
     */
    data: {
        leaders: [],
        active: true,
        isLogin: false,
        latitude: 31.23515,
        longitude: 121.43956
    },

    today() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const monthString = month < 10 ? '0' + month : month.toString();
        const day = today.getDate();
        const dayString = day < 10 ? '0' + day : day.toString();
        return `${year}-${monthString}-${dayString}`;
    },
    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        qqmapsdk = new QQMapWX({
            key: key
        });
        const page = this;
        page.setData({
            todayDate: page.today()
        });
        app.globalData.venue_id = options.id;
        if (app.globalData.header) {
            page.getData()
        } else {
            wx.event.on('loginFinish', page, page.getData)
        }
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    getData() {
        const page = this;
        const id = app.globalData.venue_id;
        wx.request({
            url: `${app.globalData.baseUrl}/venues/${id}`,
            method: "GET",
            header: app.globalData.header,
            success(res) {
                console.log('res from getting restsurant information', res.data)
                page.setData({
                    venue: res.data,
                    leaders: res.data.leaders,
                    user: app.globalData.user,
                    isLogin: app.globalData.user.avatar_url !== null,
                    active: page.data.todayDate !== res.data.last_visit
                    // orderOfVisit: ......
                })
            }
        });
    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {

    },

    checkin() {
        const page = this;
        if (!app.globalData.user.nickname) {
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    page.setData({
                        avatarUrl: res.userInfo.avatarUrl,
                        nickname: res.userInfo.nickName,
                        isLogin: true
                    })
                    app.globalData.user.avatar_url = page.data.avatarUrl;
                    app.globalData.user.nickname = page.data.nickname;
                    page.saveUserProfile();
                    page.validateCheckin();
                }
            })
        } else {
            page.validateCheckin();
        }

    },

    saveUserProfile() {
        const page = this;
        const body = {
            avatar_url: page.data.avatarUrl,
            nickname: page.data.nickname
        }
        console.log("Request body:", body)
        wx.request({
            url: `${app.globalData.baseUrl}/users/profile`,
            method: 'POST',
            header: app.globalData.header,
            data: body,
            success(res) {
                console.log("User profile updated")
            }
        })
    },

    askForCheckin(allowed) {
        let page = this
        if (allowed) {
            wx.showModal({
                title: "Check in?",
                content: 'Would you like to check in here?',
                cancelText: 'No',
                cancelColor: '#14274E',
                confirmText: 'Yes',
                confirmColor: '#14274E',
                success(res) {
                    if (res.confirm) {
                        page.actualCheckin(res);
                    }
                }
            })
        } else {
            wx.showModal({
                showCancel: false,
                title: "You are too far away to check-in",
                content: "Please go to the venue to check-in.",
                confirmText: 'OK',
                confirmColor: '#14274E'
            })
        }
    },

    validateCheckin() {
        const page = this;
        let allowed = false;
        console.log("page.data:", page.data);
        const location = [{
            latitude: page.data.venue.latitude,
            longitude: page.data.venue.longitude
        }];
        console.log("location:",location)
        if (page.data.distance === undefined) {
            qqmapsdk.calculateDistance({
                from: {
                    longitude: page.data.longitude,
                    latitude: page.data.latitude
                },
                to: location,
                sig: 'MsAdpInZqYv5wgssFi7ZmLXuM6LnYatr',
                success: function(res) {//成功后的回调
                    const distance = res.result.elements[0].distance;
                    console.log("distance:", distance);
                    page.setData({
                        distance: distance
                    })
                    if (distance < allowCheckinDistance) {
                        allowed = true;
                    }
                },
                fail: function(error) {
                    console.error(error);
                },
                complete: function() {
                    page.askForCheckin(allowed);
                }
            })
        } else {
            page.askForCheckin(page.data.distance < allowCheckinDistance);
        }

    },

    actualCheckin(res) {
        const page = this;
        const id = page.data.venue.id;
        if (res.confirm) {
            wx.request({
                url: `${app.globalData.baseUrl}/venues/${id}/checkins`,
                method: "POST",
                header: app.globalData.header,
                success(res) {
                    console.log('res data from check-in post ', res.data);
                    page.setData({
                        leaders: res.data.leaders,
                        active: false
                    })
                    wx.showToast({
                        title: 'Checked in!',
                        duration: 2000,
                        icon: 'success'
                    })
                    page.getData();
                }
            })
        }
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
        const id = this.data.venue.id;
        console.log("Venue id:", id)
        return {
            title: this.data.venue.name,
            imgaUrl: this.data.venue.photo_url,
            path: `pages/venues/show?id=${id}`
        }
    },

    makeCall(e) {
        const phoneNumber = this.data.venue.phone
        wx.makePhoneCall({
            phoneNumber
        })
    },

    goToMap(e) {
        const latitude = this.data.venue.latitude
        const longitude = this.data.venue.longitude
        const name = this.data.venue.name
        wx.openLocation({
            latitude,
            longitude,
            name
        })
    },
})