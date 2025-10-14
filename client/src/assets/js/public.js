
  // 阿拉伯数字转换为大写字
  function switchNum(num) {
    var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
    var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');
    if (!num || isNaN(num)) {
      return "零";
    }
    var english = num.toString().split("")
    var result = "";
    for (var i = 0; i < english.length; i++) {
      var des_i = english.length - 1 - i;//倒序排列设值
      result = arr2[i] + result;
      var arr1_index = english[des_i];
      result = arr1[arr1_index] + result;
    }

    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
    result = result.replace(/零+/g, '零');
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    result = result.replace(/亿万/g, '亿');
    result = result.replace(/零+$/, '')
    result = result.replace(/^一十/g, '十');
    return result;
  };

  function getAllDate(day1, day2) {  //根据开始日期和结束日期获取所有日期的方法
    var getDate = function(str) {
        var tempDate = new Date();
        var list = str.split("-");
        tempDate.setFullYear(list[0]);
        tempDate.setMonth(list[1] - 1);
        tempDate.setDate(list[2]);
        return tempDate;
    }
    var date1 = getDate(day1);
    var date2 = getDate(day2);
    if (date1 > date2) {
        var tempDate = date1;
        date1 = date2;
        date2 = tempDate;
    }
    var dateArr = [];

    if (day1 == day2) {
        dateArr.push(day2);
        return dateArr;

    }else {
        date1.setDate(date1.getDate() + 1);
        var i = 0;
        while (!(date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() && date1.getDate() == date2
            .getDate())) {
        var dayStr = date1.getDate().toString();
        if (dayStr.length == 1) {
            dayStr = "0" + dayStr;
        }
        dateArr[i] = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + dayStr;
        i++;
        date1.setDate(date1.getDate() + 1);
        }
        dateArr.splice(0, 0, day1)
        dateArr.push(day2);
        return dateArr;
    }
};

function googleMap(queryString) {
    let reArr = [];
    const service = new google.maps.places.AutocompleteService(queryString);
    if (queryString) {
      return new Promise(function(resolve){
        service.getQueryPredictions({ input: queryString }, res => {
          res.map(item => {
            const obj = {
                value: item.description,
                address: item.description,
                uid: item.id
              };
              reArr.push(obj)
          });
          resolve(reArr);
        })
      })
    }
}

function baiduMap(queryString, city, jsonp) {
  const url = 'http://api.map.baidu.com/place/v2/suggestion?query=' + queryString +'&region='+city+'&city_limit=true&output=json&ak=xv71wg66TpeBB3gTdCXxic4MGwLTwqrm';
  if (queryString) {
    return new Promise(function(resolve){
      jsonp(url).then(res => {
        res.map(item => {
          item.value = item.name;
          item.address = item.name;
        })
        resolve(res);
      })
    })
  }
}

function getGoogleImg() {
  var img = new Image();  
  img.src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"; 
  
  return new Promise(function(resolve){
    img.onload = function() {
      resolve(true);
    }

    img.onerr = function() {
      resolve(false);
    }
  })
}

export {
    switchNum,
    getAllDate,
    googleMap,
    baiduMap,
    getGoogleImg
}