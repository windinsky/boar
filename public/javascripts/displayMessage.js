function DisplayMessage(msg){
	if (!DisplayMessage.msgCon) {
		DisplayMessage.msgCon = $('<div style="opacity:0.8;width:100%;top:0;padding:15px 0;position:fixed;z-index:1000;background:black;text-align:center;color:white;"></div>').prependTo($(document.body));
	}
	showMessage(msg);
	function showMessage(msg){
		var ele = DisplayMessage.msgCon;
		ele.html(msg).fadeIn(function(){
			setTimeout(function(){
				ele.slideUp();
			},3000);
		});
	}
}