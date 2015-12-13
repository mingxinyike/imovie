var http = require('http');

var factor = { // 影像因子
	directors: [],
	actors: [],
	types: [],
	language: [],
	address: []
};
module.exports.getIndividualMoives = function(data){
	for(var i in data){
		factor.directors.push(processString(data[i].douban_movie_director));
		factor.actors.push(processString(data[i].douban_movie_actor).replace('更多...',''));
		factor.types.push(processString(data[i].douban_movie_class));
		factor.language.push(processString(data[i].douban_movie_language));
		factor.address.push(processString(data[i].douban_movie_place));

	}
	factor.directors = factor.directors.toString().split(',');
	factor.actors = factor.actors.toString().replace(/,+/g,',').split(',');
	factor.types = factor.types.toString().split(',');
	factor.language = factor.language.toString().split(',');
	factor.address = factor.address.toString().split(',');
	// console.log(staticArray1(factor.address));
	var result = {};
	result.directors = (maxArray(staticArray(factor.directors)));
	result.actors = (maxArray(staticArray(factor.actors)));
	result.types = (maxArray(staticArray(factor.types)));
	result.language = (maxArray(staticArray(factor.language)));
	result.address = (maxArray(staticArray(factor.address)));
	return result;
};

module.exports.getSql = function(myObj, from, to){
	var summaryNum = Number.parseInt(to) - Number.parseInt(from) + 1;
	var sqlString = "select * from \"movie\" where douban_movie_lookedman > 5000  and (";
	for(var i in myObj.directors){
		sqlString += "douban_movie_director like \'%"+ myObj.directors[i] +"%\' or \n";
	}
	sqlString = sqlString.substr(0,sqlString.length-4) + " or "
	for(var i in myObj.actors){
		sqlString += "douban_movie_actor like \'%"+ myObj.actors[i] +"%\' or \n";
	}
	sqlString = sqlString.substr(0,sqlString.length-4) + ") and ("
	for(var i in myObj.types){
		sqlString += "douban_movie_class like \'%"+ myObj.types[i] +"%\' or \n";
	}
	sqlString = sqlString.substr(0,sqlString.length-4) + ") and ("
	for(var i in myObj.language){
		sqlString += "douban_movie_language like \'%"+ myObj.language[i] +"%\' or \n";
	}
	sqlString = sqlString.substr(0,sqlString.length-4) + ") and ("
	for(var i in myObj.address){
		sqlString += "douban_movie_place like \'%"+ myObj.address[i] +"%\' or \n";
	}
	sqlString = sqlString.substr(0,sqlString.length-4) + ") order by douban_movie_lookedman desc  limit " + summaryNum + " offset  " + from;
	return sqlString;
};

var processString = function(myString){
	return myString.toString().replace(/\r/g,'').replace('/ [1,]/g ','').split('/').toString().replace(/\s/g, "");
};

var staticArray = function(arrayObj){  // 统计数组中各个元素的数量，速度比方法1快三倍
	var tempArray = {};
	for( var i in arrayObj){
		if(tempArray.hasOwnProperty(arrayObj[i])){
			tempArray[arrayObj[i]]++;
		}else{
			tempArray[arrayObj[i]] = 1;
		}
	}
	return tempArray;
};

var maxArray = function(myArray){ // 取得最大值
	var intArray = [];
	var sum = 0;
	for(var i in myArray){
		intArray.push(Number.parseInt(myArray[i]));
		sum += Number.parseInt(myArray[i]);
	}
	intArray.sort(function(a,b){return a<b?1:-1});
	var result = [];
	for(var i in myArray){
		if(myArray[i] == intArray[0]){
			result.push(i);
		}
		else if (myArray[i] == intArray[1]){
			result.push(i);
		}
		//else if (myArray[i] == intArray[2]){
		//	result.push(i);
		//}
		//else if (myArray[i] == intArray[3]){
		//	result.push(i);
		//}
	}
	return result;
};

function unique(arr){  // 去重
	var result = [], hash = {};
	for (var i = 0, elem; (elem = arr[i]) != null; i++) {
		if (!hash[elem]) {
			result.push(elem);
			hash[elem] = true;
		}
	}
	return result;
}
//
//http.get('http://"+serverIp+":19931/random?num=100',function(res){
//	if (res.statusCode === 200) {
//		var size = 0;
//		var chunks = [];
//		res.on('data', function(chunk){
//			size += chunk.length;
//			chunks.push(chunk);
//		});
//		res.on('end', function(){
//			var data = Buffer.concat(chunks, size);
//			var result = getIndividualMoives(JSON.parse(data));
//			var sqlString = getSql(result,1,20);
//		}).on('error', function(e) {
//			console.log("Got error: " + e.message);
//		});
//	}
//});

module.exports.getDailySql = function(mood,num){
//var getDailySql = function(mood,num){
	if(mood == "开心" || mood == "幸福" || mood == "快乐"){
		mood = "晴阳美亮好漂丽佳谐富兴愉喜悦福"
	} else if(mood == "犹豫" || mood == "忧郁" || mood == "彷徨" || mood == "伤心" || mood == "矛盾"){
		mood = "雾霾阴忧郁销魂挠苦愁痛撕裂叹哎闷伤犹豫彷徨伤心"
	} else if(mood == "痛苦" || mood == "烦恼" || mood == "失落" || mood == "不爽" || mood == "愁闷" || mood == "嫉妒"){
		mood = "雾雨泪血风淋浴痛苦烦恼愁闷嫉妒"
	}else if(mood == "恐惧" || mood =="龌龊" || mood == "贪婪"){
		mood = "鬼魂恐惧黑暗尸鞭蜈蚣虫怖"
	}else if(mood =="懒惰" || mood =="淫欲" || mood =="愤怒" || mood =="绝望"){
		mood = "害怕淫欲色情黄裸女虐杀抢"
	}else if(mood == "平和" || mood =="坚定"  || mood =="骄傲" ){
		mood = "平和鸽坚定骄傲持久笃"
	}else{
		mood = "美好"
	}
	var moodArray = mood.split('');
	var sqlString = "select * from \"movie\" where douban_movie_lookedman > 1000  and (";
	for(var i = 0; i < moodArray.length; i++){
		sqlString += "douban_movie_name like \'%"+ moodArray[i] +"%\' or \n";
	}
	sqlString = sqlString.substr(0,sqlString.length-4) + ") order by douban_movie_lookedman desc  limit " + num + " offset 0";
	return sqlString;
};

module.exports.getThemeSql = function(num,myear,mtype,mlanguage,mscore){
	var sqlString = "select * from \"movie\" where douban_movie_lookedman > 10  and ";
	sqlString += "douban_movie_year like \'%"+ myear +"%\' and ";
	sqlString += "douban_movie_class like \'%"+ mtype +"%\' and ";
	sqlString += "douban_movie_language like \'%"+ mlanguage +"%\' and ";
	sqlString += "CAST(douban_movie_score AS double precision) > "+ mscore ;
	sqlString += " order by douban_movie_lookedman desc  limit " + num + " offset 0";
	return sqlString;
};
module.exports.getThemeOneSql = function(num,mtype){
	var sqlString = "select * from \"movie\" where douban_movie_lookedman > 10  and ";
	sqlString += "douban_movie_class like \'%"+ mtype +"%\' ";
	sqlString += " order by douban_movie_lookedman desc  limit " + num + " offset 0";
	return sqlString;
};