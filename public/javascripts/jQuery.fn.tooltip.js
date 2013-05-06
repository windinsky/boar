$.fn.tooltip = function(opt){
	if (!opt || !opt.msg) return;
	var defaultOpt = {
		direction: 'n',
		autoFade: !0,
		maxWidth: 300
	};
	opt = $.extend(defaultOpt,opt);
	var template = '<div style="font-size:12px;border-radius:5px;background:black;opacity:0.8;color:white;position:absolute;padding:5px 10px;">'+opt.msg+'</div>';
	this.each(function(i,e){
		var tooltip = $(template).appendTo($(document.body));
		if (tooltip.width()>opt.maxWidth) {
			tooltip.width(opt.maxWidth);
		};
		tooltip.css({
			top: $(e).offset().top - tooltip.height() - 15 + 'px',
			left: $(e).offset().left + 'px'
		});
		if (opt.autoFade) {
			setTimeout(function(){
				tooltip.fadeOut(function(){
					tooltip.remove();
				});
			},4e3);
		};
	});
};