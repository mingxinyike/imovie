var movieList=[];
var lovedList = [];
var choosedCount = 0;


var movietest = [];
var returncount;
var currentPage = 1;//当前页数
var maxCount = 0;//最大页数
var n = 10; //单页显示电影数
var currentMax=0;

$(document).ready(function(){
	$('.headList span[data-list="1"]').addClass('clickColor');
})

jQuery(function($){
    getOriginMovies(15);
    showMovies();
    $('#reset').click(resetClick);
    $('a.heartclick').click(heartClick);
    $('#submitLove').click(submitLoveClick);

});

function getOriginMovies(n){//获得随机15部电影
  $.ajax({
   type: "get",
   url: "http://"+serverIp+":19931/random?num="+n,
   async: false, // 设置为同步，true为异步
   success: function (data) {
    movieList=data;
   }
  });
}

function showMovies(){ //初始化15部电影，文字，图片，未选中的心心
  var movieblocks = $(".movieblock");
  var movieName = "";
  for (var i = 0; i < movieblocks.length; i++ ){
   movieblocks[i].id = i;
   $(movieblocks[i]).empty();
   $(movieblocks[i]).append("<img src="+movieList[i].douban_movie_imgurl+" width='100px' height='150px'/>");
   movieName = movieList[i].douban_movie_name;
   if (movieName.length > 33) {
    movieName = movieName.substr(0, 30);
    movieName += '...'
   }
   $(movieblocks[i]).append("<p>"+movieName+"</p>");
   $(movieblocks[i]).append("<a class='heartclick'><img class='unlove' src='../img/iconfont-unlove.png' width='30'/></a>");
  }
}
function heartClick() {
  var img = $(this).children()[0];
  if (img.className == "unlove"){
    $(img).removeClass();
    img.className = "loved";
    img.src = "../img/iconfont-love.png";
  } else {
   $(img).removeClass();
   img.className = "unlove";
    img.src = "../img/iconfont-unlove.png";
  }
 var loveCount = $('#loveCount');
 var count=updataLovedCount();
 loveCount.html(count);
}
function submitLoveClick(){//点击提交，发数据返回后提交给后台并获得预测数据
 addLovedMovies();
 submitLovedMovies(JSON.stringify(lovedList));

}

function resetClick(){//点击重置按钮 重新获得15部电影，并记录下已经喜欢的电影idList
  addLovedMovies();
  choosedCount=updataLovedCount();
  getOriginMovies(15);
  showMovies();
  $('a').click(heartClick);
}

function submitLovedMovies(dataPost){//将选中的电影信息提交给后台
 $.ajax({
  type: "post",
  url: "http://"+serverIp+":19931/individuality",
  data: dataPost,
  success: function(data) {
   console.log(data.length);
   console.log(data);
   movietest = data;
   returncount = data.length;
   maxCount = Math.floor(returncount/10);
   showMoveList();
   $('#choose_movie').hide();
   $('#MovieList').show();
   $('#h1').html("你可能会喜欢它们呦~");
   $('#h2').html("");
  }
 });
}

function addLovedMovies(){ //更新喜欢电影list
  var choosed = $('.loved');
  for (var i = 0; i < choosed.length; i++){
   lovedList.push(movieList[$(choosed[i]).parent().parent().attr("id")]);
  }
}
function updataLovedCount(){//返回当前喜欢电影的数目
 var count = choosedCount+$('.loved').length;
 return count;
}