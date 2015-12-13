$(document).ready(function(){
	$('.headList span').click(function(e){
		var type = $(e.target).attr('data-list');
		setHeadListStyle($(e.target));
		switch(type){
			case '1':
				self.location='guess.html';
				break;
			case '2':
				self.location='daily.html';
				break;
			case '3':
				self.location='search.html';
				break;
			case '4':
				self.location='about.html';
				break;
		}
	})
});

var setHeadListStyle = function(dom){ // 设置标题的样式
	$(dom).addClass('clickColor');
	dom.siblings().removeClass('clickColor')
};
