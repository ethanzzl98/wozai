// pages/venues/index.js
const category = '生活服务,娱乐休闲';
const app = getApp();
const key = app.globalData.key;
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let qqmapsdk;
const defaultIcon = '../../images/markerIcon.png';
const activeIcon = '../../images/activeMarkerIcon.png';
Page({

    /**
     * Page initial data
     */
    data: {
        array: ["All", "Bar", "Beauty", "Cafe", "Education", "Gym", "Hookah", "Museum", "Park", "Restaurant", "Shopping", "Sports"],
        selectedCategory: 'All',
        hasSelected: false,
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
                console.log('res grom GET venues: ', res.data)
                page.storeData(res.data);
            }
        })
    },

    storeData(data) {
        const page = this;
        const { venues } = data;
        const markers = page.getMarkersFromVenues(venues);
        page.setDistances(venues);
        page.setData({
            markers: markers,
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude,
        });
        console.log("All the venues from the database:", venues)
    },

    setDistances(venues) {
        const page = this;
        const locations = venues.map((venue) => {
            return {
                latitude: venue.latitude,
                longitude: venue.longitude
            };
        });
        qqmapsdk.calculateDistance({
            to: locations,
            sig: 'MsAdpInZqYv5wgssFi7ZmLXuM6LnYatr',
            success: function(res) {//成功后的回调
                console.log("qqmapsdk calculate:", res.result);
                res = res.result;
                for (let i = 0; i < res.elements.length; i++) {
                    const dist = res.elements[i].distance
                  venues[i].distance = dist;
                  venues[i].distanceString = (dist < 1000 ?
                    dist + ' m' : Math.floor(dist / 100) / 10 + ' km'); 
                }
                console.log(`Distance to ${venues[0].name} is ${venues[0].distance}`);
                venues.sort((a,b) => a.distance - b.distance);
                page.setData({
                    venues: venues
                })
            },
            fail: function(error) {
                console.error(error);
            },
            complete: function() {
                page.displayVenuesByCategory();
            }
        })
    },

    getMarkersFromVenues(venues) {
        return venues.map((venue) => {
            return {
                latitude: venue.latitude,
                longitude: venue.longitude,
                width: '90rpx',
                height: '90rpx',
                id: venue.id,
                iconPath: defaultIcon,
                venue: venue,
                customCallout: {
                    display: 'BYCLICK',
                    content: venue.name,
                }
            }
        })
    },

    onLoad() {
        qqmapsdk = new QQMapWX({
            key: key
        });
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

    // If I have time, I will fix this function
    bindmarkertap(e) {
        console.log(e)
        const markerIndex = this.data.markers.findIndex((marker) => marker.id === e.markerId);
        console.log(markerIndex);
        // this.cleanMarkerStyle();
        const markers = this.data.markers;
        markers[markerIndex].iconPath = activeIcon;
        // this.setData({
        //     markers: markers
        // })
    },

    cleanMarkerStyle() {
        const markers = this.data.markers;
        for (let marker in markers) {
            marker.iconPath = defaultIcon;
        }
        this.setData({
            markers: markers
        })
    },

    bindcallouttap(e) {
        this.navigateToShow(e.detail.markerId);
    },

    goToShow(e) {
        const id = e.currentTarget.dataset.index;
        app.globalData.venue_id = id;
        this.navigateToShow(id);
    },

    navigateToShow(id) {
        wx.navigateTo({
            url: `/pages/venues/show?id=${id}`,
        })
    },

    bindPickerChange(e) {
        this.setData({
            selectedCategory: this.data.array[e.detail.value],
            hasSelected: true
        });
        console.log("Change category:", e.detail.value);
        this.displayVenuesByCategory();
    },

    displayVenuesByCategory() {
        const page = this;
        this.setData({
            venuesFiltered: page.data.selectedCategory === 'All' ? page.data.venues : page.data.venues.filter(venue => venue.categories.includes(page.data.selectedCategory))
        })
        console.log("Venues displayed:", page.data);
    }
})