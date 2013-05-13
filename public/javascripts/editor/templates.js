boarTmpls = {
	editor: '<iframe id="boar-editor"  frameborder="0" style="border: 1px solid #dadde1;"></iframe>',
	operatorsWrapper: '<div class="editor-operator-wrapper">'+
		'<ul class="clear operators">'+
		'</ul>'+
	'</div>',	
	operators: {
		backgroundColor: '<li data-name="backgroundColor">'+
			'<a class="operator" href="javascript:;"><span>背景</span></a>'+
			'<ul class="sub-item">'+
				'<li><a href="javascript:;" data-value="black">黑色</a></li>'+
				'<li><a href="javascript:;" data-value="blue">蓝色</a></li>'+
				'<li><a href="javascript:;" data-value="red">深红色</a></li>'+
			'</ul>'+
		'</li>',
		color: '<li data-name="color">'+
			'<a class="operator" href="javascript:;"><span>字体颜色</span></a>'+
			'<ul class="sub-item">'+
				'<li><a href="javascript:;" data-value="black">黑色</a></li>'+
				'<li><a href="javascript:;" data-value="blue">蓝色</a></li>'+
				'<li><a href="javascript:;" data-value="red">深红色</a></li>'+
			'</ul>'+
		'</li>',
		fontSize: '<li data-name="fontSize">'+
			'<a class="operator" href="javascript:;"><span>字体大小</span></a>'+
			'<ul class="sub-item">'+
				'<li><a href="javascript:;" data-value="16px">12px</a></li>'+
				'<li><a href="javascript:;" data-value="20px">14px</a></li>'+
				'<li><a href="javascript:;" data-value="24px">16px</a></li>'+
			'</ul>'+
		'</li>',
		fontWeight: '<li data-name="fontWeight">'+
			'<a class="operator" href="javascript:;"><span>加粗</span></a>'+
			'<ul class="sub-item">'+
				'<li><a href="javascript:;" data-value="bold">加粗</a></li>'+
				'<li><a href="javascript:;" data-value="normal">取消加粗</a></li>'+
			'</ul>'+
		'</li>'
	}
};