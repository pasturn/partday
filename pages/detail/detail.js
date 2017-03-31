const formatDate = require('../../utils/util.js').formatDate

var app = getApp()
Page({
    data:{
        objectId: '',
        detail: {}
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
                this.setData({
                    detail:{
                        objectId: _detail.objectId,
                        imageSrc: _detail.imageSrc  || '',
                        title: _detail.title  || '',
                        province: _detail.province  || '',
                        city: _detail.city  || '',
                        address: _detail.address  || '',
                        startDate: formatDate(_detail.startDate)  || '',
                        endDate: formatDate(_detail.endDate)  || '',
                        fee: _detail.fee  || '--',
                        content: _detail.content  || '这家伙很懒，什么都没有留下'
                    },objectId})
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