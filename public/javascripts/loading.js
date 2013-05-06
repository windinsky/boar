function LoadingBar(container,options){
	if (!container) {
		throw 'LoadBar: container is not valid';
	};
	try{
		$('<div></div>').appendTo(container).remove();
	}catch(e){
		throw 'LoadBar: container is not valid';
	}
	var opt = $.extend(options,{
		w: 300,
		h: 10,
		className: 'bc-blue',
		con: container.css({
			position:'relative'
		})
	});
	
	this.init = function(){
		this.bar = $('<div class="loadingBar-out"><div class="'+opt.className+'"></div></div>').appendTo(opt.con);
		this.content = this.bar.find('div');
		this.bar.css({
			width:opt.w+'px',
			height:opt.h+'px'
		})
		this.content.width(0);
		var h=opt.con.height(),w=opt.con.width();
		this.bar.css({
			top:(h-opt.h)/3+'px',
			left:(w-opt.w)/2+'px'
		});
	};
	this.init();
	this.update = function(percent){
		this.content.stop(true);
		this.content.animate({
			width:percent+'%'
		});
	}
}