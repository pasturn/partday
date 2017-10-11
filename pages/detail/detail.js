const { formatDate, addressToLocation } = require('../../utils/util.js')

var app = getApp()
Page({
    data:{
        objectId: '',
        detail: {},
        isShowMap: false,
        markers: [{
          iconPath: "",
          id: 0,
          latitude: 23.099994,
          longitude: 113.324520,
          width: 50,
          height: 50
        }],
        polyline: [{
          points: [{
            longitude: 113.3245211,
            latitude: 23.10229
          }, {
            longitude: 113.324520,
            latitude: 23.21229
          }],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
        }],
        controls: [{
          id: 1,
          iconPath: '',
          position: {
            left: 0,
            top: 300 - 50,
            width: 50,
            height: 50
          },
          clickable: true
        }]
    },
    onPullDownRefresh: function(){
        this.getData(this.data.objectId)
    },
    onLoad: function(option){
        this.setData({objectId: option.objectId})
        
    },
    onReady: function() {
        wx.showLoading({
        title: "加载中",
        mask: true
        })
        this.getData(this.data.objectId)
   },
    getData: function(objectId){
        var query = new app.AV.Query('Expo');
        query.get(objectId)
            .then(detail => {
                const _detail = detail.toJSON();
                const addressInfo = addressToLocation(_detail.province + _detail.city + _detail.address)
                addressInfo.then((data) => {
                  const location = data.result.location
                  if (location) {
                    this.setData({
                      isShowMap: true,
                      detail: Object.assign({}, this.data.detail, {
                        lat: location.lat,
                        lng: location.lng,
                      }),
                      markers: [{
                        iconPath: "",
                        id: 0,
                        latitude: location.lat,
                        longitude: location.lng,
                        width: 50,
                        height: 50
                      }]
                    })
                  }
                }).catch ((err) => {
                  console.log(err)
                })
                this.setData({
                  detail: Object.assign({}, this.data.detail, {
                    objectId: _detail.objectId,
                    imageSrc: _detail.thumbnailUrl || _detail.thumbnilUrl || '',
                    title: _detail.title || '',
                    province: _detail.province || '',
                    city: _detail.city || '',
                    address: _detail.address || '',
                    startDate: formatDate(_detail.startDate) || '',
                    endDate: formatDate(_detail.endDate) || '',
                    fee: _detail.fee || '--',
                    content: _detail.content || '这家伙很懒，什么都没有留下'
                  }), objectId
                })
                wx.hideLoading()
            })
            .catch((error) => {
                wx.showModal({
                title: '错误',
                content: '服务器繁忙，请重试',
                showCancel: false
                })
            })
    }
})