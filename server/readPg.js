/*删除douban_movie_score字段为NULL的记录
DELETE FROM movie WHERE douban_movie_score='NULL'
选择好电影
select * from movie where douban_movie_lookedman>100000 and cast(douban_movie_score as real)>9

删除douban_movie_name重复的列（年份是连续的两个）
delete from movie where douban_movie_id in (select douban_movie_id from movie
where douban_movie_name in
(select douban_movie_name from movie
group by douban_movie_name having count(douban_movie_name) > 1) and cast(douban_movie_year as int)%2=1)*/

var pg = require('pg');
var http = require('http');
var url = require('url');
var config = require('./config');
var conString = "tcp://postgres:admin@"+config.serverIp+":5432/movie"; // 连接字符串="tcp:// 用户名 : 密码 @localhost:5432/ 库名";
var client = new pg.Client(conString);
var movies = null;
var individual = require('./individual');

// 连接数据库
client.connect(function (error, results) {
	if (error) {
		console.log('ClientConnectionReady Error: ' + error.message);
		client.end();
		return;
	}
	console.log('Connecting to postgres success...');
});


 var server= http.createServer(queryConnectionHandler);

function queryConnectionHandler(req, res) {
	res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8',
		'Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS',
		'Access-Control-Allow-Headers':'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',
		'Access-Control-Allow-Origin':'*'
	});
	var pathname = url.parse(req.url).pathname;
	var args = require('url').parse(req.url.toLowerCase(), true);

	if (pathname == '/random') { //
		var num = args.query.num || 0;//获得参数num
		// 查询数据库
		client.query("select * from \"movie\" where douban_movie_lookedman>100000 order by random() limit " + num, function (err, result) {
			movies = JSON.stringify(result.rows);
			res.end(movies);
		});
	}
	if (pathname == '/individuality') {
		var from = args.query.from || 0;//获得参数from
		var to = args.query.to || 0;//获得参数to
		if(req.method === 'POST') {
			var body = '';
			req.on('data', function (data) {
				body += data;
			});
			req.on('end', function () {
				//console.log("Body: " + body);
				var result = individual.getIndividualMoives(JSON.parse(body));
				//console.log(result);

				var sqlString = individual.getSql(result,0,150);
				console.log(sqlString);
				client.query(sqlString, function (err, result) {
					movies = JSON.stringify(result.rows);
					res.end(movies);
					//console.log(JSON.parse(movies));
				});
			});
		}
	}
	if (pathname == '/daily') { //
		var num = args.query.num || 0;//获得参数num
		var mood = args.query.mood || '开心';
		var sqlString = individual.getDailySql(mood,130);
		// 查询数据库
		client.query(sqlString, function (err, result) {
			movies = JSON.stringify(result.rows);
			res.end(movies);
			//console.log(JSON.parse(movies));
		});
	}
	if (pathname == '/theme') { //
		var num = args.query.num || 0;//获得参数num
		var myear = args.query.myear || '2014'; // 年代
		var mtype = args.query.mtype || '喜剧'; // 主题
		var mlanguage = args.query.mlanguage || '普通话';// 语言
		var mscore = args.query.mscore || '7';// 评分
		var sqlString = individual.getThemeSql(130,myear,mtype,mlanguage,mscore);
		// 查询数据库
		client.query(sqlString, function (err, result) {
			movies = JSON.stringify(result.rows);
			res.end(movies);
		});
	}
	if (pathname == '/themeone') { //
		var num = args.query.num || 0;//获得参数num
		var mtype = args.query.mtype || '喜剧'; // 主题
		var sqlString = individual.getThemeOneSql(num,mtype);
		// 查询数据库
		console.log(sqlString)
		client.query(sqlString, function (err, result) {
			movies = JSON.stringify(result.rows);
			res.end(movies);
		});
	}
}
server.listen(19931, config.serverIp);

console.log("Server running at http://"+config.serverIp+":19931/random?num=2");
