require.config({
	paths: {
		echarts: 'http://echarts.baidu.com/build/dist'
	}
});
require(
	[
		'echarts',
		'echarts/chart/radar' // 使用柱状图就加载bar模块，按需加载
	],
	function (ec) {
		// 基于准备好的dom，初始化echarts图表
		var myChart = ec.init(document.getElementById('echarts'));

		var option = {
			title : {
				text: 'iMovie',
				subtext: '开发技术'
			},
			tooltip : {
				trigger: 'axis'
			},
			legend: {
				x : 'center',
				y: '1px',
				data:['刘小婧','杨龙龙']
			},
			calculable : false,
			polar : [
				{
					indicator : [
						{text : 'NodeJS(后台)', max  : 100},
						{text : 'Java(爬虫)', max  : 100},
						{text : 'Jade(HTML)', max  : 100},
						{text : 'Sass(CSS)', max  : 100},
						{text : 'JQuery(JS)', max  : 100},
						{text : 'Git', max  : 100}
					],
					radius : 95
				}
			],
			series : [
				{
					name: '完全实况球员数据',
					type: 'radar',
					itemStyle: {
						normal: {
							areaStyle: {
								type: 'default'
							}
						}
					},
					data : [
						{
							value :[60, 60, 95, 95, 92, 85],
							name : '刘小婧'
						},
						{
							value :  [97, 80, 75, 65, 83, 93],
							name : '杨龙龙'
						}
					]
				}
			]
		};
		myChart.setOption(option);
	}
);