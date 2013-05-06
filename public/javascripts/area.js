var Area = {
	R:RenderTemplate,
	init: function(areas,selected){
		var con = $('#j-areaList');
		Area.searchInput = $('#j-search');
		Area.searchBtn = $('#j-searchBtn'),
		Area.bindSearchEvent();
		// remove after combined
		c=0;
		// 用于创建节点的递归函数,如果以后要改成ajax的，删掉递归调用就可以了
		// 注意由于数据量比较大，这里的节点必须一次次的添加，不要把所有的节点全部拼好然后append，不然IE8会crash
		function create(tree,parent){
			for (var i=0; i < tree.length; i++) {
				// fake ids, remove after combined
				tree[i].id = c;
				c++;
				// real code
				var parentId = parent.attr('id').split('_')[2];
				tree[i].parentId = parentId || '';
				// 装载input和文字
				parent.append($(Area.R(Area.template,tree[i],'area')));
				var node = $('#area_'+tree[i].id);
				// 注册input事件
				Area.bindSelectEvent(node.find('input'));
				// 遍历children
				var children = tree[i].cities || tree[i].provinces;
				if (children && children.length) {
					// 装载trigger
					var trigger = $(Area.R(Area.triggerTemplate,tree[i],'area')).prependTo(node.find('.area'));
					// 注册trigger事件
					Area.bindTriggerEvent(trigger);
					// 创建用于容纳子节点的容器
					var childrenCon = $(Area.R(Area.childrenTemplate,tree[i],'area')).appendTo(node);
					// 递归调用，创建children
					create(children,childrenCon);
				}else{
					// 如果没有子节点，为了使节点排布整齐，放一个和trigger一样大小的容器在input前面
					$(Area.placeholderTemplate).prependTo(node.find('.area'));
				}
			};
		}
		// 创建试图
		create(areas,con);
		// 如果有回填数据，完全模拟实际情况走一遍，不再单独写代码
		if (selected) {
			$(selected).each(function(i,item){
				// check input
				var ele = $('#select_'+item);
				ele[0].checked = 'checked';
				// trigger event
				ele.trigger('change');
				// 展示该节点
				ele.parents('.children').each(function(i,item){
					$('#trigger_'+item.id.split('_')[2]).trigger('click');
				})
			});
		};
	},
	// 由于本地没有备份树结构，所以所有的数据都需要从DOM结构中读取，这个函数就是用来格式化area对象的
	formatArea: function(id){
		var parentsContent = $('#area_'+id).parents('.children').map(function(i,ele){
			return $(ele).prev().text();
		}).toArray();
		parentsContent.unshift($('#area_'+id+'>.area').text());
		return {
			title: $('#area_'+id).text(),
			id: id,
			parentId: $('#select_'+id).attr('data-parent'),
			rawTitle: parentsContent.join(',')
		};
	},
	bindTriggerEvent: function(ele){
		ele.click(function(){
			var id = this.id.split('_')[1],
			childrenCon = $('#child_of_'+id);
			if (childrenCon.css('display')!='none') {
				$(this).removeClass('extended').addClass('shrinked');
				childrenCon.slideUp();
			}else{
				
				$('#child_of_'+id+' .area').show();
				$(this).removeClass('shrinked').addClass('extended');
				childrenCon.slideDown();
			}
		});
	},
	bindSelectEvent: function(ele){
		ele.change(function(){
			var id = ele.attr('id').split('_')[1];
			this.checked ? Area.addSelect(id) : Area.removeSelect(id);
		});
	},
	bindSearchEvent: function(){
		var cb = function(){
			// 搜索逻辑
			var val = Area.searchInput.val();
			// 首先判断字符串是否为空
			if (val.replace(/\s/g,'')!='') {
				// 隐藏所有元素并把所有的trigger收起来
				$('.area').hide();
				$('.children').hide();
				$('.trigger').removeClass('extended').addClass('shrinked');
				// 设置状态为搜索状态
				this.searchMode = true;
				// 遍历所有含有关键字的节点
				$('.area:contains('+val+')').each(function(i,ele){
					
					var id = ele.id.split('_')[1],
					ele = $(ele);
					
					if (ele.text().indexOf(val) + 1) {
						// 如果文字中包涵搜索的关键字，首先将所有父层级显示出来，并把父层级的trigger设置成展开状态
						ele.parents('.children').show().each(function(j,item){
							$(item).prev().show();
							$('#trigger_'+item.id.split('_')[2]).removeClass('shrinked').addClass('extended');
						});
						// 再把自己显示出来
						ele.show();
					};
				}.bind(this));
			}else{
				// 如果关键字为空，重置界面
				if (this.searchMode) {
					// 关闭搜索状态
					this.searchMode = false;
					$('.area').show();
					$('.children').hide();
					$('.trigger').removeClass('extended').addClass('shrinked');
				};
			}
		};
		Area.searchBtn.click(cb)
		Area.searchInput.keyup(cb);
	},
	addSelect: function(id){
		/* 
			添加共有以下几种逻辑：
				首先如果自己有父节点，
			 		需要判断父节点下面一层是否全部选中了，如果是，选中父节点，在选中区域移除所有父节点下面选中的地区，并将父节点添加到选中列表中,然后触发change事件继续往上层处理
					如果并不是，那么将自己添加到选中区域，并删除所有子节点在选中区域的显示
				如果自己没有父节点
					添加自己到选中区域，并移除所有子节点在选中区域的显示
			
				合并以上代码逻辑，以下为代码实现
		*/
		// if ($('#selected_'+id).length) return;
		// 判断自己是否有父节点：
		var parent = $('#area_'+id).parents('.j-area-con:first');
		if (parent.length) {
			// 如果有，首先查看自己下层区域是否全部被选中了
			var parentId = parent.attr('id').split('_')[1];
			var inputs = parent.find('input[data-parent='+parentId+']:not(:checked)');
			if (!inputs.length) {
				//如果是，移除所有parent的子区域在选中区的显示
				var ids = parent.find('input').map(function(i,item){
					return item.id.split('_')[1];
				});
				$('#selected_'+ids.toArray().join(',#selected_')).remove();
				// 把parent放到选中区中
				$(Area.R(
					Area.selectedTemplate,
					Area.formatArea(parentId),
					'area'
				)).appendTo($('.selected-con > .con')).find('.remove').click(function(){
					var id = this.id.split('_')[1];
					$('#select_'+id)[0].checked = false;
					$('#select_'+id).trigger('change');
				});
				// 触发parent的change事件继续往上处理
				$('#select_'+parentId)[0].checked = 'checked';
				$('#select_'+parentId).trigger('change');
				return;
			};
		};
		// 如果没有父节点或者父节点下面的子区域并没有被全部选中
		
		// 删除自己所有的子区域在选中区的显示
		var ids = $('#area_'+id+' input').map(function(i,item){
			var id = item.id.split('_')[1]
			// 将子节点选中先
			$('#select_'+id)[0].checked = 'checked'
			return id;
		});
		$('#selected_'+ids.toArray().join(',#selected_')).remove();
		// 将自己添加进选中区域
		
		$(Area.R(
				Area.selectedTemplate,
				Area.formatArea(id),
				'area'
			)
		).appendTo($('.selected-con > .con')).find('.remove').click(function(){
			var id = this.id.split('_')[1];
			$('#select_'+id)[0].checked = false;
			$('#select_'+id).trigger('change');
		});
	},
	removeSelect: function(id){
		/*
			移除区域有以下逻辑
				首先判断自己是否有父节点
					如果有，则需要判断父节点是否是选中状态，
						如果是，将其选中状态去掉，移除他在选中区的显示，并将当前节点的所有兄弟节点添加到选中区，然后继续往上层parent走同样的逻辑,这个逻辑里面不能删除子节点，不然就错了
						如果不是，删除自己在选中区的显示,并删除自己子节点在选中区的显示
					如果没有，删除自己在选中区的显示,并删除自己子节点在选中区的显示
		*/
		// 判断自己是否有父节点
		var parent = $('#area_'+id).parents('.j-area-con:first');
		while (parent.length) {
			var parentId = parent.attr('id').split('_')[1];
			// 如果有,首先判断父节点是否被选中
			if ($('#select_'+parentId)[0].checked) {
				//如果是，首先去掉父节点的选中状态并删除父节点在选中区的显示
				$('#select_'+parentId)[0].checked = false;
				$('#selected_'+parentId).remove();
				// 然后把当前节点的兄弟节点添加到选中区
				$('input:checked[data-parent='+parentId+']').each(function(i,item){
					var id = item.id.split('_')[1];
					// 添加节点不要一次性添加，虽然性能比一个个要好，但是IE8扛不住
					$(
						Area.R(
							Area.selectedTemplate,
							Area.formatArea(id),
							'area'
						)
					).appendTo($('.selected-con > .con')).click(function(){
						var id = this.id.split('_')[1];
						$('#select_'+id)[0].checked = false;
						$('#select_'+id).trigger('change');
					});
				});
			};
			parent = parent.parents('.j-area-con:first');
		};
		// 如果没有parent或者parent没有被选中，删除自己和自己所有子节点在选中区的显示即可
		$('#selected_'+id).remove();
		var ids = $('#area_'+id+' input').map(function(i,item){
			var id = item.id.split('_')[1];
			$('#select_'+id)[0].checked = false;
			return id;
		});
		$('#selected_'+ids.toArray().join(',#selected_')).remove();
	},
	template:				'<div id="area_[#=area.id#]" class="j-area-con">'+
								'<div class="area">'+
									'<span><input type="checkbox" name="" data-parent="[#=area.parentId#]" id="select_[#=area.id#]"></span>'+
									'<span>[#=area.title#]</span>'+
								'</div>'+
							'</div>',
	triggerTemplate:		'<span class="trigger shrinked" id="trigger_[#=area.id#]"></span>',
	placeholderTemplate:	'<span class="placeholder"></span>',
	childrenTemplate:		'<div id="child_of_[#=area.id#]" class="children" style="display:none"></div>',
	selectedTemplate:		'<div class="selected" id="selected_[#=area.id#]">'+
								'<span>[#=area.rawTitle#]</span>'+
								'<span class="remove close-tag" id="remove_[#=area.id#]"></span>'+
							'</div>'
};