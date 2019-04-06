function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function user_api(method, data, cbsucc, cbfail){
	app.wxRequest(
		app.getApiUrl(method),
		data,
		cbsucc,
		cbfail
	);
}

//时间戳转换时间
function getLocalTime(nS, fM) {
	var fM = fM || 'Y-m-d H:i:s';
	var date = new Date(parseInt(nS) * 1000),
        Y = date.getFullYear(),
        m = (Array(2).join(0) + (date.getMonth() + 1)).slice(-2),
        d = (Array(2).join(0) + date.getDate()).slice(-2),
        H = (Array(2).join(0) + date.getHours()).slice(-2),
        i = (Array(2).join(0) + date.getMinutes()).slice(-2),
        s = (Array(2).join(0) + date.getSeconds()).slice(-2);
	var fT = fM.replace(/Y/ig, Y);
	var fT = fT.replace(/m/ig, m);
	var fT = fT.replace(/d/ig, d);
	var fT = fT.replace(/H/ig, H);
	var fT = fT.replace(/i/ig, i);
	var fT = fT.replace(/s/ig, s);
	return fT;
}

//timeformat === false 不转换时间
//baseurl === false 不拼接URL
//将返回的对象时间戳转为正常的时间格式
function filterData(data, timeformat, baseurl){
	if(baseurl !== false)var baseurl = baseurl || '';
	if(timeformat !== false)var timeformat = timeformat || 'Y-m-d H:i:s';
	for(var i in data){
		if(typeof data[i] == 'object'){
			data[i] = filterData(data[i], timeformat, baseurl);
		}else{
			if(timeformat !== false && i.slice(-4) == 'time' && (data[i]+'').length == 10 && parseInt(data[i]) == data[i]){
				data[i] = getLocalTime(data[i], timeformat);
			}
			if(baseurl !== false && (data[i]+'').substr(0, 8).toLowerCase() == '/upload/'){
				data[i] = baseurl + data[i];
			}
		}
	}
	return data;
}

module.exports = {
  formatTime: formatTime,
  filterData: filterData,
  getLocalTime:getLocalTime
}
