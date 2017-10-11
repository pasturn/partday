const { lbsconfig } = require('../config/config.js')

function formatTime(date) {
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  date = new Date(date)

  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')

}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const addressToLocation = function(addr){
  return new Promise(function (resolve, reject) {
    wx.request({
      url: lbsconfig.url,
      data: {
        address: addr,
        key: lbsconfig.key
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.status === 347){
            reject(res.data)
          } else {
            resolve(res.data)
          }
        } else {
          reject(res.errMsg)
        }
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  addressToLocation: addressToLocation
}
