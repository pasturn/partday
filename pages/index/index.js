//index.js
//获取应用实例
const formatDate = require('../../utils/util.js').formatDate

var app = getApp()

Page({
  data: {
    expolist:[],
    totalCount: 10,
    loading: false
  },
  onLoad: function () {},
  onReady: function() {
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    this.getData()
  },
  onPullDownRefresh: function(){
    this.setData({totalCount: 10})
    this.getData()
  },
  onReachBottom: function () {
    const preTotalCount = this.data.totalCount
    if (preTotalCount <= this.data.expolist.length) {
        this.setData({
              loading: true,
              totalCount: preTotalCount + 5
        })
        setTimeout(() => {
          this.getData()
        }, 500)
    }
  },
  getData: function() {
    new app.AV.Query('Expo')
      .ascending('startDate')
      .greaterThanOrEqualTo('endDate',new Date())
      .limit(this.data.totalCount)
      .find()
      .then(expolist => {
        this.setData({ expolist: expolist.map(item => {
              const _item = item.toJSON()
              return {
                objectId: _item.objectId,
                imageSrc: _item.imageSrc || '',
                title: _item.title || '',
                province: _item.province || '',
                city: _item.city || '',
                address: _item.address || '',
                startDate: formatDate(_item.startDate) || '',
                endDate: formatDate(_item.endDate) || '',
                fee: _item.fee || '--'
              }
            }),
            loading: false
          })
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
      .catch((error) => {
        wx.showModal({
          title: '错误',
          content: '服务器繁忙，请重试',
          showCancel: false
        })
      });
  },
  bindViewTap: function(e) {
    const objectId = e.currentTarget.id
    wx.navigateTo({
      url: '../detail/detail?objectId=' + objectId
    })
  }
})
