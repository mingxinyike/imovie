var movietest = [];
var returncount;
var currentPage = 1;//当前页数
var maxCount = 0;//最大页数
var n = 10; //单页显示电影数
var currentMax=0;

jQuery(function($){
    showTypeMovies();
    $('.movietypeSelect').click(movietypeClick);
    $('.movielanguageSelect').click(movieLanguageClick);
    $('.movietimeSelect').click(movietimeClick);
    $('.doubanstarSelect').click(doubanstarClick);
    //选择Li标签
    $('.movietype>ul>li').click(movietypeliClick);
    $('.movielanguage>ul>li').click(movielanguageliClick);
    $('.movietime>ul>li').click(movietimeliClick);
    $('.doubanstar>ul>li').click(doubanstarliClick);
    $('.submitlist').click(submitlistClick);
    //点击More
    $('.lovemore').click(lovemoreClick);
    $('.horrormore').click(horrormoreClick);
    $('.funnymore').click(funnymoreClick);
    $('.actionmore').click(actionmoreClick);
    $('.sciencemore').click(sciencemoreClick);
    $('.cartoonmore').click(cartoonmoreClick);
    $('.return').click(returnClick);//点击返回

});
function movietypeClick(){//类型span点击，list收缩
    $('.movietype').slideToggle();
}
function movieLanguageClick(){//language span点击，list收缩
    $('.movielanguage').slideToggle();
}
function movietimeClick(){//time span点击，list收缩
    $('.movietime').slideToggle();
}
function doubanstarClick(){//doubanstar span点击，list收缩
    $('.doubanstar').slideToggle();
}
function movietypeliClick(){//类型list点击，选中分数，并在span中显示
    $('.movietypeSelect>span').text($(this).text());
    $('.movietype').slideUp();
    $('.movietypeSelect>span').addClass("choosed");
}
function movielanguageliClick(){//电影语言list点击，选中分数，并在span中显示
    $('.movielanguageSelect>span').text($(this).text());
    $('.movielanguageSelect>span').addClass("choosed");
    $('.movielanguage').slideUp();
}
function movietimeliClick(){//时间list点击，选中分数，并在span中显示
    $('.movietimeSelect>span').text($(this).text());
    $('.movietimeSelect>span').addClass("choosed");
    $('.movietime').slideUp();
}
function doubanstarliClick(){//豆瓣评分list点击，选中分数，并在span中显示
    $('.doubanstarSelect>span').text($(this).text());
    $('.doubanstarSelect>span').addClass("choosed");
    $('.doubanstar').slideUp();
}
//点击More
function lovemoreClick(){
    getMoreMovies(100,'爱情');//读数据，并显示列表
}
function horrormoreClick(){
    getMoreMovies(100,'惊悚');
}
function funnymoreClick(){
    getMoreMovies(100,'喜剧');
}
function actionmoreClick(){
    getMoreMovies(100,'动作');
}
function sciencemoreClick(){
    getMoreMovies(100,'科幻');
}
function cartoonmoreClick(){
    getMoreMovies(100,'动画');
}
//点击返回
function returnClick(){
    $('.recommendlist').hide();
    $('#errorAlert').hide();
    $('.main').show();

}

function submitlistClick(){ //提交请求，发送主题参数
    $('#errorAlert').hide();
    if($('.choosed').length==4){
        var typeQ=  $('.movietypeSelect>span').text();
        var languageQ =  $('.movielanguageSelect>span').text();
        var timeQ =  $('.movietimeSelect>span').text();
        var doubanstarQ =  $('.doubanstarSelect>span').text();
        getAskMovies(100,typeQ,languageQ,timeQ,doubanstarQ);
    } else {//选择没有完全，提示继续选择
        $('#errorAlert>h1').html("请继续选择");
        $('#errorAlert').show();
        $('#errorAlert>.return').hide();
    }

}

function getAskMovies(n,typeQ,languageQ,timeQ,doubanstarQ){//根据参数返回主题推荐，并在回调函数中进行显示
    $.ajax({
        type: "get",
        url: "http://"+serverIp+":19931/theme?num="+n+"&myear="+timeQ+"&mtype="+typeQ+"&mlanguage="+languageQ+"&mscore="+doubanstarQ,
        async: false, // 设置为同步，true为异步
        success: function (data) {
            if(data.length>0){
                movietest = data;
                returncount = data.length;
                maxCount = Math.floor(returncount/10);
                if (data.length<10){
                    $('#MovieList>p:gt('+(data.length-1)+')').hide();
                    $('#MovieList>table:gt('+(data.length-1)+')').hide();

                }
                $('.main').hide();
                $('.recommendlist').show();
                showMoveList();//recommendlist显示推荐结果
            } else { //没有找到匹配的电影时
                $('#errorAlert>h1').html("没有找到匹配的电影");
                $('#errorAlert').show();
                $('#errorAlert>.return').show();
                $('.recommendlist').hide();
                $('.main').hide();
            }

        }
    });
}
function getMoreMovies(n,typeQ){//More标签点击出现更多的电影列表
    $.ajax({
        type: "get",
        url: "http://"+serverIp+":19931/themeone?num="+n+"&mtype="+typeQ,
        async: false, // 设置为同步，true为异步
        success: function (data) {
            movietest = data;
            returncount = data.length;
            maxCount = Math.floor(returncount/10);
            if (data.length<10){
                $('#MovieList>p:gt('+(data.length-1)+')').hide();
                $('#MovieList>table:gt('+(data.length-1)+')').hide();

            }
            $('.main').hide();
            $('.recommendlist').show();
            showMoveList();//recommendlist显示推荐结果

        }
    });
}
function showDiffTypeMovies(n,mtype,movieblocks){//获得随机n部电影
    $.ajax({
        type: "get",
        url: "http://"+serverIp+":19931/themeone?num="+n+"&mtype="+mtype,
        async: false, // 设置为同步，true为异步
        success: function (data) {
            var movies = data;
            var movieName = "";
            for (var i = 0; i < movies.length; i++ ){
                $(movieblocks[i]).empty();
                $(movieblocks[i]).append("<a href="+movies[i].douban_movie_url+"><img src="+movies[i].douban_movie_imgurl+" width='100px' height='150px'/></a>");
                movieName = movies[i].douban_movie_name;
                if (movieName.length > 33) {
                    movieName = movieName.substr(0, 30);
                    movieName += '...';
                }
                $(movieblocks[i]).append("<p><a href="+movies[i].douban_movie_url+">"+movieName+"</a></p>");
                $(movieblocks[i]).append("<a class='scoring'>"+movies[i].douban_movie_score+"</a>");
            }
        }
    });
}
function showTypeMovies(){ //显示一开始的三个类别，定义数据矩阵,然后分别初始化
    var movieblocks = $(".loveType>.line>.movieblock");
    showDiffTypeMovies(5,'爱情',movieblocks);
    var movieblocks = $(".horrorType>.line>.movieblock");
    showDiffTypeMovies(5,'惊悚',movieblocks);
    var movieblocks = $(".funnyType>.line>.movieblock");
    showDiffTypeMovies(5,'喜剧',movieblocks);
    var movieblocks = $(".actionType>.line>.movieblock");
    showDiffTypeMovies(5,'动作',movieblocks);
    var movieblocks = $(".scienceType>.line>.movieblock");
    showDiffTypeMovies(5,'科幻',movieblocks);
    var movieblocks = $(".cartoonType>.line>.movieblock");
    showDiffTypeMovies(5,'动画',movieblocks);


}
