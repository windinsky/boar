function UserProfile(container,opts){
	// apply default options
	this.opt = $.extend(opts,{
		width:300,
		height:12,
		con:container
	});
	this.init();
}
UserProfile.prototype = {
	save: function(){
		var resultStr = '';
		var ids = $('.or-zone').map(function(i,item){
			var ids = $(item).find('.selected-attr').map(function(i,selected){
				return selected.id.split('_')[2];
			});
			if (ids.length > 1) {
				return '('+ids.toArray().join('|')+')'
			}else{
				return ids[0];
			}
		});
		return ids.toArray().join('&');
	},
	init: function(){
		this.initLoadingBar();
		// 创建基础模板
		this.opt.con.addClass('user-profile row-fluid').append(this.conTemplate);
		// 绑定drop事件
		this.opt.con.find('.and-zone').droppable({
			tolerance:"touch",
			accept:".draggable",
			activeClass:'active',
			hoverClass:'hover',
			// hoverClass:"focus",
			drop:function(e,ui){
				var ele = ui.draggable.context,
				id = ele.id.split("_")[2],
				val = $(ele).text();
				this.createSelectedArea(id,val);
			}.bind(this),
			activate:function(e,ui){
				// $(".tip").slideDown("fast");
			},
			deactivate:function(){
				// $(".tip").slideUp("fast");
			}
		});
		// 拉取根节点数据
		this.getFirstBatchData(function(data){
			for (var i=0; i < data.children.length; i++) {
				var d = data.children[i];
				
				$(RenderTemplate(
					this.rootNodeTemplate,
					d,
					'node'
				)).appendTo(this.opt.con.find('.root-label')).addClass('n'+i);

				$(RenderTemplate(
					this.childrenTemplate,
					d,
					'node'
				)).appendTo(this.opt.con.find('.attr-container')).hide();
				
				var node = $('#node_'+d.id);
				node.click(function(ele){
					var id = ele.attr('id').split('_')[1];
					$('.root-label>div').removeClass('hover');
					ele.addClass('hover');
					if ($('#children_of_'+id).css('display') != 'none') {
						return;
					};
					$('.attr-container>div').hide();
					if (this.loadedChildren.indexOf(parseInt(id))==-1) {
						this.getChildrenData(id,this.loadChild.bind(this));
					}else{
						$('#children_of_'+id).slideDown();
					}
				}.bind(this,node));
				if (d.children) {
					this.addChildren(d);
				};
			};
			
			// 初始化第一个根节点下的数据用于展示
			$('#node_'+data.children[0].id).trigger('click');
			// this.getChildrenData(data.children[0].id,this.loadChild.bind(this));
		}.bind(this));
	},
	addChildren: function(tree){
		function create(tree){
			this.loadedChildren.push(tree.id);
			for (var i=0; i < tree.children.length; i++) {
				var node = tree.children[i];
				node.draggable = this.undraggableAttrs.indexOf(node.value) == -1;
				$('#children_of_'+tree.id).append(RenderTemplate(this._template,node,'node'));

				if (!node.hasChildren && !node.children) {
					$('#node_'+node.id+'>.content').prepend(this.placeholderTemplate);
				}else{
					var content = $('#node_'+node.id+'>.content');
					// 如果有子节点，生成用于展开当前节点的图标
					content.prepend(RenderTemplate(this.triggerTemplate,node,'node'));
					// 生成用于容纳子节点的容器
					$(RenderTemplate(this.childrenTemplate,node,'node')).appendTo($('#node_'+node.id)).hide();
					var trigger = $('#trigger_'+node.id);
					// 为图标加上事件
					this.addTriggerEvent(trigger);
				}
				
				if(node.children && node.children.length){
					$('#children_of_'+node.id).show();
					$('#trigger_'+node.id).removeClass('shrinked').addClass('extended');
					// 如果没有子节点，在节点前添加一个占位符，保证节点整齐排列
					(create.bind(this,node))();
				}
				// 注册drag事件
				var valContent = $('#node_val_'+node.id)
				node.draggable && this.addNodeEvent(valContent);
			};
		}
		(create.bind(this,tree))();
	},
	// 获取某个节点下子节点接口，参数为节点id和回调函数
	getChildrenData: function(id,cb){
		$('#node_content_'+id).append($('#loading').show());
		$.ajax({
			url:'/userAttr/getChildren?id='+id,
			type:'get',
			dataType:'json',
			success:cb.bind(this)
		});
	},
	getFirstBatchData: function(cb){
		$.ajax({
			url:'/userAttr/getFirstBatch',
			type:'get',
			dataType:'json',
			success:cb.bind(this)
		});
	},
	createSelectedArea: function(id,val){
		var newZone = $(this.dropOrTemplate).appendTo('.and-zone');
		if ($('.or-zone').length>1) {
			$(this.andTemplate).insertBefore(newZone);
		};
		this.addSelectedAttr(id,val,newZone);
		newZone.droppable({
			tolerance:"intersect",
			accept:".draggable",
			greedy:true,
			activeClass: 'active',
			hoverClass:'hover',
			drop:function(con,e,ui){
				var ele = ui.draggable.context,
				id = ele.id.split("_")[2],
				val = $(ele).text();
				this.addSelectedAttr(id,val,con);
			}.bind(this,newZone),
			activate:function(e,ui){
				
			},
			deactivate:function(){
			}
		});
	},
	addSelectedAttr: function(id,val,con){
		if ($(con).find('#selected_attr_'+id).length) {
			return;
		};
		var selected = $(RenderTemplate(this.selectedAttrTemplate,{id:id,value:val},'node')).appendTo(con);
		selected.find('.remove-attr').click(function(){
			var orZone = $(this).parents('.or-zone');
			if (orZone.find('.selected-attr').length == 1) {
				if (orZone.next().hasClass('and')) {
					orZone.next().remove();
				}else if(orZone.prev().hasClass('and')){
					orZone.prev().remove();
				}
				orZone.remove();
			}else{
				$(this).parent().remove();
			}
		});
	},
	// 加载子节点之后的回调
	loadChild: function(data){
		$(document.body).append($('#loading').hide());
		// 将id缓存在实例中，避免重复拉取
		this.loadedChildren.push(data.id);
		
		var childrenCon = $('#children_of_'+data.id);
		// 遍历拉回来的子节点并逐一处理
		for (var i=0; i < data.children.length; i++) {
			var d = data.children[i];
			d.draggable = this.undraggableAttrs.indexOf(d.value) == -1;
			// 生成节点容器
			childrenCon.append(RenderTemplate(this._template,d,'node'));
			
			if (d.hasChildren) {
				var content = $('#node_'+d.id+'>.content');
				// 如果有子节点，生成用于展开当前节点的图标
				content.prepend(RenderTemplate(this.triggerTemplate,d,'node'));
				// 生成用于容纳子节点的容器
				$(RenderTemplate(this.childrenTemplate,d,'node')).appendTo($('#node_'+d.id)).hide();
				var trigger = $('#trigger_'+d.id);
				// 为图标加上事件
				this.addTriggerEvent(trigger);
			}else{
				// 如果没有子节点，在节点前添加一个占位符，保证节点整齐排列
				$('#node_'+d.id+'>.content').prepend(this.placeholderTemplate);
			}
			// 注册drag事件
			var valContent = $('#node_val_'+d.id)
			d.draggable && this.addNodeEvent(valContent);
		};
		try{
			$('#trigger_'+data.id).removeClass('shrinked').addClass('extended');
		}catch(e){
			
		}
		
		childrenCon.slideDown();
	},
	addTriggerEvent: function(trigger){
		trigger.click(function(ele,e){
			// 获取节点id
			var id = ele.attr('id').split('_')[1];
			if (ele.hasClass('shrinked')) {
				// 如果图标是收起状态，则点击应该将子节点显示出来
				// 首先判断是否子节点已经从服务器拉取过
				if (this.loadedChildren.indexOf(parseInt(id)) == -1) {
					// 如果没有缓存数据，向服务器发送请求拉取数据
					this.getChildrenData(id, this.loadChild);
				}else{
					// 反之直接展示数据
					ele.removeClass('shrinked').addClass('extended');
					$('#children_of_'+id).slideDown();
				}
			}else{
				// 如果是展开状态，则点击应该将子节点收起
				ele.removeClass('extended').addClass('shrinked');
				$('#children_of_'+id).slideUp();
			}
		}.bind(this,trigger));
	},
	addNodeEvent: function(valContent){
		valContent.draggable({
			helper: 'clone'
		});
	},
	initLoadingBar: function(){
		// 初始化进度条
		if (!window.LoadingBar) {
			alert('loadingBar is undefined,please load it in the page first.');
		};
		this.loadingBar = new LoadingBar(this.opt.con);
		this.loadingBar.init();
	},
	updateLoadingBar: function(percent){
		this.loadingBar.update(percent);
	},
	conTemplate:		'<div class="drag-area span5">'+
							'<div class="drag-note"></div>'+
							'<div class="root-label"></div>'+
							'<div class="attr-container"></div>'+
						'</div>'+
						'<div class="drop-area span5">'+
							'<div class="user-count">符合以下条件的共有<span id="selectedUserCount"></span>人</div>'+
							'<div class="drop-zone">'+
								'<div class="and-zone">'+
									// '<div class="tip">'+
									// 	'<span class="people-drag"></span>拖入这里可以增加‘<span class="fc-red">且</span>’的关系'+
									// '</div>'+
								'</div>'+
								'<div class="user-attr-submit">'+
									'<a href="javascript:;" class="btn btn-success span4">确定</a>'+
									'<a href="javascript:;" class="btn span3">取消</a>'+
								'</div>'+
							'</div>'+
						'</div>',
						
	dropOrTemplate:	'<div class="or-zone"></div>',	
	// 根节点模板
	rootNodeTemplate:	'<div id="node_[#=node.id#]">'+
							'<div class="content" id="node_content_[#=node.id#]">[#=node.value#]</div>'+
						'</div>',
	// 普通节点模板
	_template:			'<div id="node_[#=node.id#]" class="node">'+
							'<div class="content" id="node_content_[#=node.id#]">'+
								'<span class="node-val [#=node.draggable?\"draggable\":\"\"#]" id="node_val_[#=node.id#]">[#=node.value#]</span>'+
							'</div>'+
						'</div>',
	// 选中之后用于展示的模板
	selectedAttrTemplate:
						'<div class="selected-attr" id="selected_attr_[#=node.id#]">'+
							'<span class="remove-attr" id="remove_attr[#=node.id#]">x</span><span>[#=node.value#]</span>'+
						'</div>',
	// 用于容纳子节点的容器
	childrenTemplate:	'<div id="children_of_[#=node.id#]" style="overflow:hidden;" class="children"></div>',
	// 把手图标
	triggerTemplate:	'<span id="trigger_[#=node.id#]" class="shrinked"></span>',
	// 占位符
	placeholderTemplate: '<span class="placeholder"></span>',
	// '且'
	andTemplate: '<div class="and">且</div>',
	// 缓存
	loadedChildren: [],
	undraggableAttrs: "性别,年龄,月收入,身份职业,受教育程度,关键人生阶段,类型,品牌,价格,来源,租价,面积,户型,地区,人口属性,购买倾向,地域分布,个人关注".split(",")
};