var DayParting = {
	init: function(con,selected){
		this.addEvent(con);
		//回填
		if (selected) {
			var arr = this.StringUtils.hexToBinary(selected);
			for (var i=0; i < arr.length; i++) {
				for(var j = 0 ; j < arr[i].length;j++){
					if (arr[i] == '1') {
						$('tr:nth('+(i+1)+') span:nth('+(24-str.length+j)+')').trigger('click');
					};
				}
			};
		};
		this.spans = $('tr:gt(0) span');
	},
	StringUtils:{
		/*
			将一个字符串分割为长度为n的多个字符串，并对每个字符串进行filter处理
			例：
				DayParting.StringUtils.splitMap('1122334411223',2,function(str){
					return parseInt(str).toString(2);
				});
				// => ["1011", "10110", "100001", "101100", "1011", "10110", "11"]
		*/
		splitMap: function(str,n,filter) {
			if(typeof str == 'string'){
				var p = 0,result = [];
				for (var i=0; i < str.length/n; i++) {
					var s = str.substr(i*n,n);
					result.push($.isFunction(filter) ? filter(s) : s);
				};
				return result;
			}
		},
		binaryToHex: function(data) {
			return this.splitMap(data,24,function(d){
				return this.fill(parseInt(d,2).toString(16),6,'0');
			}.bind(this)).join('');
		},
		hexToBinary: function(str){
			return this.splitMap(str,6,function(str){
				return parseInt(str,16).toString(2);
			});
		},
		/*
			在字符串前面补充字符，直到长度达到n
			例如：
				DayParting.StringUtils.fill('A',10,'0');	//=> "000000000A"
		*/
		fill: function(str,n,fillWith){
			var l = str.length,s = str;
			while(l < n){
				s = fillWith+s;
				l++;
			}
			return s;
		}
	},
	//将取所有选中的时段格式化为二进制字串
	getData: function(){
		return this.spans.map(function(i,span){
			return $(span).hasClass('selected')? '1':'0';
		}).toArray().join('');
	},
	addEvent: function(con) {
		//全天选择
		$('.select').change(function(){
			var method = this.checked ? 'addClass' : 'removeClass';
			$(this).parents('tr').find('span')[method]('selected');
		}).mouseover(function(){
			$(this).parents('tr').find('td:gt(1)').addClass('hover');
		}).mouseout(function(){
			$(this).parents('tr').find('td:gt(1)').removeClass('hover');
		});
		//全选按钮
		$('#selectAll').change(function(){
			var c = this.checked,method = c ? 'addClass' : 'removeClass';
			$('tr:gt(0) span')[method]('selected');
			$('input:checkbox').attr('checked',c);
		}).mouseover(function(){
			$('tr').find('td:gt(1)').addClass('hover');
		}).mouseout(function(){
			$('tr').find('td:gt(1)').removeClass('hover');
		});
		//时段00:00-5:00,6:00-11:00,12:00-17:00,18:00-23:00 mouseover与mouseout
		$('#selectBeforeDawn,#selectMorning,#selectAfternoon,#selectNight').mouseover(function(){
			$('tr').find('td:nth('+this.getAttribute('data-index')+')').addClass('hover');
		}).mouseout(function(){
			$('tr').find('td:nth('+this.getAttribute('data-index')+')').removeClass('hover');
		}).change(function(){
			var c = this.checked;
			var eles = $('tr').find('td:nth('+this.getAttribute('data-index')+') span');
			c ? eles.addClass('selected') : eles.removeClass('selected');
		});
		//单选某天
		$(con).find('td>span').click(function(){
			var method = $(this).hasClass('selected') ? 'removeClass' : 'addClass';
			$(this)[method]('selected');
		});
		//确定保存
		$('#confirm').click(function(){
			var selected = this.getData();
			var formated = this.format(selected);
			this.emit('change',[this.StringUtils.binaryToHex(selected),formated]);
		}.bind(this));

		new Drag($(document), {
			onBeforeDrag: function(){
				// 记录自己当前状态，在拖拽过程中用来判断怎么切换选中状态
				this.spans.each(function(i,item){
					$(item).data('status',$(item).hasClass('selected') ? 1 : 0);
				});
			}.bind(this),
			onDragging:function(start, stop) {
				// 手动拖拽出来的矩形
				var r1 = new Rectangle(start.x, start.y ,stop.x, stop.y);

				this.spans.each(function(index, span) {
					var self = $(span),
					o = self.offset(),
					// SPAN的BOX
					r2 = new Rectangle(
						o.left,						// x1
						o.top,						// y1
						o.left+self.outerWidth(),	// x2
						o.top+self.outerHeight()	// y2
					);
					// 根据是否被框选到 来切换选中状态
					if (r2.cross(r1) == (self.data('status') == '0')) {
						self.addClass('selected');
					}else{
						self.removeClass('selected');
					}
				}.bind(this));
			}.bind(this)
		});
		$(window).unload(this.release.bind(this));
	},
	/*
		格式化数据，方便页面显示，比如下面的序列
			111111000000111111000000
			111111111011110011111111
			111111000000111111000000
			111111111111111111111111
			111111000000110011000000
			111111000000100111000011
			111111000000111111000000
		格式化之后的格式为：
			[
				//周一
				[
					[0,5],[12,17]
				],
				//周二
				[
					[0,8],[10,13],[16,23]
				],
				//周三
				[
					[0,5],[12,17]
				],
				//周四
				[
					[0,23]
				],
				//周五
				[
					[0,13],[16,17]
				],
				//周六
				[
					[0,12],[15,17],[22,23]
				],
				//周日
				[
					[0,5],[12,17]
				]
			]
	*/
	format: function(selected){
		var result = [];
		
		if (selected.indexOf('1') + 1 && selected.indexOf('0') + 1) {
			selected = this.StringUtils.splitMap(selected,24);
			for (var i=0; i < selected.length; i++) {
				var str = selected[i],index = 0,r = null,arr = [],temp = str;
				while(r = temp.match(/[1]+/)){
					var start = r.index+index,end = start + r[0].length - 1;
					arr.push([start,end]);
					index += end + 1;
					temp = str.substr(index);
				}
				result.push(arr);
			};
		}
		return result;
	},
	release: function(){
		this.spans = null;
		delete this.spans;
		$('input').unbind('click').unbind('mouseover').unbind('mouseout');
	}
};
EventEmitter.call(DayParting);