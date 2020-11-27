var API_BASE_URL = 'https://api.jisuapi.com'
var APP_KEY = '9c177fc8d50ef6d3'

var request = function request(url, method, data) {
  var _url = API_BASE_URL + url;
  var header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  data['appkey'] = APP_KEY
  return new Promise(function (resolve, reject) {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      success: function success(request) {
        resolve(request.data);
      },
      fail: function fail(error) {
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });
  });
};

module.exports = {
  requestCoachList: function(aStart, aEnd){
    return request('/bus/city2c', 'get', {start: aStart, end: aEnd})
  }
}