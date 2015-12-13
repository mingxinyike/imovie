var mood = '开心';
$(document).ready(function(){
	// 路径配置
	require.config({
		paths: {
			echarts: 'http://echarts.baidu.com/build/dist'
		}
	});
	// 使用
	require(
		[
			'echarts',
			'echarts/chart/wordCloud' // 使用柱状图就加载bar模块，按需加载
		],
		function (ec) {
			// 基于准备好的dom，初始化echarts图表
			var myChart = ec.init(document.getElementById('mood'));
			var moodWord = ['幸福','希望','犹豫','快乐','矛盾','痛苦','平和','坚定','忧郁','烦恼','开心','失落','恐惧','彷徨','伤心','绝望','龌龊','不爽','愁闷','贪婪','懒惰','淫欲','骄傲','嫉妒','愤怒'];
			//var moodWord = ["幸福","愤怒"];
			var moodData = [];
			for(var i = 0; i < moodWord.length; i++){
				var oneWord = {};
				oneWord.name = moodWord[i];
				oneWord.value = (moodWord.length + 1 - i) * 100;
				oneWord.itemStyle = createRandomItemStyle();
				moodData.push(oneWord);
			}
			var option = {
				title: {
					text: ''
				},
				tooltip: {
					show: true
				},
				series: [{
					name: '您此刻的心情',
					type: 'wordCloud',
					size: ['98%', '98%'],
					textRotation : [0, 15,30,45,60,75, 90,-15,-30 -45],
					textPadding: 0,
					autoSize: {
						enable: true,
						minSize: 14
					},
					data: moodData

				}]
			};

			// 为echarts对象加载数据
			myChart.setOption(option);

			// 事件
			var ecConfig = require('echarts/config');
			myChart.on(ecConfig.EVENT.CLICK, function(param){
				var currentMood = param.data.name;
				$('.listHead .mood').html("" + currentMood);
				mood = currentMood;
				getOriginMoviestest(returncount);
				maxCount = Math.floor(returncount/10);
				$('.paginations').html("");
				showMoveList();
			});
		}
	);
});

$(document).ready(function(){
	$('.headList span[data-list="2"]').addClass('clickColor');
})

$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
	var city = remote_ip_info.city;
	$('.listHead .city').html("" + city);
	var s = document.createElement("script");
	s.src = "https://jsonp.afeld.me/?callback=hello&url=http%3A%2F%2Fapistore.baidu.com%2Fmicroservice%2Fweather%3Fcitypinyin%3D" + pinyin.getFullChars(city);
	document.body.appendChild(s);
});
function hello(data) {
	$('.listHead .weather').html("" + data.retData.weather );
}
function createRandomItemStyle() {
	return {
		normal: {
			color: 'rgb(' + [
				Math.round(Math.random() * 160),
				Math.round(Math.random() * 160),
				Math.round(Math.random() * 160)
			].join(',') + ')',
			fontFamily:'Axure Handwriting'
		}
	};
}