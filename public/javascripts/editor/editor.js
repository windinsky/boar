/**
 * @param wrapper 页面放置编辑器的节点
 * @param opt
 *  	opt.operators  初始化编辑器时，配置有哪些操作。有 backgroundColor（背景）, color（字体颜色）, fontSize（字体大小）, fontWeight（加粗）
 * 		opt.content 编辑器中的默认内容
 */
function BoarEditor(wrapper, opt) {
	if(wrapper && typeof wrapper == 'string') wrapper = $('#' + wrapper);

	var dftOpt = {};

	$.extend(dftOpt, opt);

	this.opt = opt;
	this.wrapper = wrapper;

	// 编辑器的iFrame
	this.editor = $(boarTmpls.editor);
	wrapper.append(boarTmpls.operatorsWrapper);
	wrapper.append(this.editor);

	this.init();
}

BoarEditor.prototype = {
	init: function() {
		var self = this;

		this.wrapper.css('position', 'relative')

		// 拿到iframe的document，将其designMode和contentEditable开启即可对一个iframe内容进行编辑
		var doc = this.doc = self.editor[0].contentWindow.document;

		doc.designMode = 'on';
		doc.contentEditable = true;

		doc.open();

		if(self.opt.content) doc.write(self.opt.content);

		doc.close();

		var stylelink = '<link rel="stylesheet" href="/javascripts/editor/editor.css" />';
		$(doc).find('head').append(stylelink);
		$(document).find('head').append(stylelink);

		this.wrapper.css('height', this.editor.height() + 40);

		this.fillOperators();
	},
	hide: function() {
		this.wrapper.hide();
	},
	show: function() {
		this.wrapper.show();
	},
	fillOperators: function() {
		var operators = this.opt.operators,
			opes = this.wrapper.find('.operators');

		operators.forEach(function(name) {
			var o = new Operator(name, this.doc);
			opes.append(o.node);
		}.bind(this));
	}
};

function Operator(name, doc) {
	this.node = $(boarTmpls.operators[name]);
	this.doc = doc;
	this.addEvents();
}

Operator.prototype = {
	addEvents: function() {
		var operator = this;

		// 阻止冒泡
		operator.node.click(function(e) {
			if(e.stopPropagation) 
				e.stopPropagation();
			else
				e.cancelBubble = true;
		});

		operator.node.find('.operator').click(function(e) {
			var self = $(this);
			self.next().toggle();
		});


		operator.node.find('.sub-item li a').click(function(e) {
			var self = $(this);
			operator.node.find('.sub-item').hide();
			operator.node.find('.operator').children().first().html(self.text());

			// 取得选区，如果选区中有内容，对选区中的内容添加相应操作的样式
			var range, selection = operator.doc.getSelection();
			if(selection.rangeCount) {
				range = selection.getRangeAt(0);
				var span = operator.doc.createElement('span');
				$(span).css(operator.node.data('name'), self.data('value'));

				range.surroundContents(span);
			}
		});
	}
};

$(document).click(function(e) {
	$('.sub-item').hide();
});



