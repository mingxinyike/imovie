function showMoveList(){
    pagingReady(maxCount);//根据最大页数生成分页栏
    //getOriginMoviestest(returncount);//获取n个数据
    addInfo(0,n);//页面显示
    $("li>a").bind("click",function(){
        currentPage = parseInt($(this).text());
        refreshView();
        $('li>a').removeClass("active");
        $(this).addClass("active");
        updatepaging();
    });
    $("#Previous").bind("click",function(){
        currentPage = currentPage-1;
        refreshView();
        var activeNode = $('.active')
        activeNode.removeClass('active');
        activeNode.parent().prev().children().addClass("active");
        updatepaging();
        judgingdot();

    });
    $("#Next").bind("click",function(){
        currentPage = currentPage+1;
        refreshView();
        var activeNode = $('.active')
        activeNode.removeClass('active');
        activeNode.parent().next().children().addClass("active");
        updatepaging();
        judgingdot();
    });
    $("#First").bind("click",function(){
        currentPage = 1;
        refreshView();
        var activeNode = $('.active')
        activeNode.removeClass('active');
        $('li>a:first').addClass("active");
        $('li>a').hide();
        $('li>a').filter(':lt(9)').show();
        if (maxCount >= 9){
            currentMax = 9;
        }else{
            currentMax = maxCount;
        }
        judgingdot();
    });
    $("#Last").bind("click",function(){
        currentPage = maxCount;
        refreshView();
        var activeNode = $('.active')
        activeNode.removeClass('active');
        $('li>a:last').addClass("active");

        currentMax = maxCount;
        if(maxCount>9){
            $('li>a').hide();
            $('li>a:gt('+(maxCount-10)+')').filter(':lt(9)').show();
            judgingdot();
        }


    });
}

function refreshView(){ //get
    $('li').removeClass("disabled");
    if (currentPage==1){
        $('#Previous').addClass("disabled");
    }else if (currentPage==maxCount){
        $('#Next').addClass("disabled");
    }
    addInfo((currentPage-1)*n,n);
    $('html,body').animate({scrollTop: '0px'}, 500);
}
function judgingdot(){
    if($('li>a:first').css("display")=="none")
        $('#morefirst').show();
    else
        $('#morefirst').hide();
    if($('li>a:last').css("display")=="none")
        $('#morelast').show();
    else
        $('#morelast').hide();
}
function pagingReady(count){ //生成分页栏，传入参数count最大页数
    var pagination = $(".paginations");
	pagination.html("");
    $("<li id='First' href='#' aria-label='Previous'><span aria-hidden='true'>首页</span></li>").appendTo(pagination);
    $("<li id='Previous' href='#' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></li>").appendTo(pagination);
    $("<li id='morefirst' herf='#' style='display:none'><span>&nbsp;...&nbsp;</span></li>").appendTo(pagination);

    for (var i = 1; i <= count; i++){
        $("<li><a herf='#'>&nbsp;"+i+"&nbsp;</a></li>").appendTo(pagination);
    }
    $("<li id='morelast' herf='#' style='display:none'><span>&nbsp;...&nbsp;</span></li>").appendTo(pagination);
    currentMax = count;
    if (count>=9){
        $('li>a:gt(8)').css("display","none");
        $('#morelast').css("display","inline");
        currentMax = 9;
    }
    $("<li id='Next' href='#' aria-label='Next'><span aria-hidden='true'>&raquo;</span></li>").appendTo(pagination);
    $("<li id='Last' href='#' aria-label='Previous'><span aria-hidden='true'>尾页</span></li>").appendTo(pagination);
    $('#Previous').addClass("disabled ");
    $('li>a:first').addClass("active");
}
function updatepaging(){ // 更新分页栏
    if(maxCount>9){
        if (currentPage == currentMax){//当点击当前页面最大的分页时
            if (maxCount-currentPage>=5){
                move(5)
            }else if(currentPage>maxCount-5){
                $('li>a').hide();
                $('li>a:gt('+(maxCount-10)+')').filter(':lt(9)').show();
                currentPage = maxCount;
                currentMax = maxCount;
            }
        }
        if(currentPage ==(currentMax-8)){ // 当点击当前页面最小的分页时
            if (currentPage-5>1){
                move(-5)
            }else if(currentPage<9){
                $('li>a').hide();
                $('li>a').filter(':lt(9)').show();
                if (maxCount >= 9){
                    currentMax = 9;
                }else{
                    currentMax = maxCount;
                }
            }
        }
    }
    judgingdot();

}
function move(step){ //分页栏移动step个单位
    var projectCount = currentMax-10+step;
    if(projectCount>=0 && projectCount<=maxCount-10){
        $('li>a').hide();
        $('li>a:gt('+(currentMax-10+step)+')').filter(':lt(9)').show();
        currentMax = currentMax+step;
    }

}
function getOriginMoviestest(n){//获得随机n部电影
    $.ajax({
        type: "get",
        url: "http://"+serverIp+":19931/random?num="+n,
        async: false, // 设置为同步，true为异步
        success: function (data) {
            movietest=data;
        }
    });
}
function addInfo(origin,n){//n是每页显示的电影数，从origin开始
    var moviepic = $('.moviepic');
    var title = $('.title');
    var douban = $('.douban');
    var imdb = $('.imdb');
    var content = $('.content');
    var rating = $('.rating');
    var evaluation = $('.evaluation');
    var rateStar = $('.rateStar');
    var y = -110;
    for (var i = origin,j=0; i < origin+n; i++,j++){
        moviepic[j].src=movietest[i].douban_movie_imgurl;
        title[j].innerHTML=movietest[i].douban_movie_name;
        douban[j].setAttribute("href",movietest[i].douban_movie_url);
        imdb[j].setAttribute("href",movietest[i].imdb_movie_url);
        var actors = movietest[i].douban_movie_actor.split('/');
        var movieActors="";
        if (actors.length>=2)
            movieActors = actors.slice(0,2).join('/');
        else
            movieActors = actors[0];
        var movieLanguage = movietest[i].douban_movie_language.split('/')[0];
        var movieRelease = movietest[i].douban_movie_releasetime.split('/')[0];
        var movieContent = movietest[i].douban_movie_abstract;
        if (movieContent.length>79)
            movieContent = movieContent.slice(0,76)+"...";
        content[j].innerHTML="<span>导演：</span>"+movietest[i].douban_movie_director+"<span>主演：</span>"+movieActors+"</br>"+movietest[i].douban_movie_class+movieRelease+movietest[i].douban_movie_time+movieLanguage+"</br>"+"<span>剧情简介</span>:"+movieContent;
        rating[j].innerHTML=movietest[i].douban_movie_score;
        evaluation[j].innerHTML="("+movietest[i].douban_movie_scorepeople+"人评价)";
        y = (10-Math.floor(movietest[i].douban_movie_score))*(-11);
        $(rateStar[j]).css("background-position-y",y+"px");
    }

}
