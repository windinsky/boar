var Area = {
	init: function(areas,selected){
		this.areas = [];
		function combine(areas){
			Area.areas = Area.areas.concat(areas);
			for (var i=0; i < areas.length; i++) {
				var children = areas[i].cities || areas[i].provinces;
				if (children && children.length) {
					combine(children);
				};
			};
		}
		combine(areas);
		this.areas.find = function(id){
			for (var i=0; i < Area.areas.length; i++) {
				if(Area.areas[i].id == id){
					return Area.areas[i];
				}
			};
		}
		var con = $('#j-areaList'),
		searchInput = $('#j-search'),
		searchBtn = $('#j-searchBtn'),
		c=0;
		function create(tree,parent){
			for (var i=0; i < tree.length; i++) {
				// remove after combined
				tree[i].id = c;
				c++;
				parent.append($(RenderTemplate(Area.template,tree[i],'area')));
				var node = $('#area_'+tree[i].id);
				Area.bindSelectEvent(node.find('input'));
				var children = tree[i].cities || tree[i].provinces;
				if (children && children.length) {
					var trigger = $(RenderTemplate(Area.triggerTemplate,tree[i],'area')).prependTo(node.find('.area')),
					childrenCon = $(RenderTemplate(Area.childrenTemplate,tree[i],'area')).appendTo(node);
					Area.bindTriggerEvent(trigger);
					create(children,childrenCon);
				}else{
					$(Area.placeholderTemplate).prependTo(node);
				}
			};
		}
		create(areas,con);
	},
	bindTriggerEvent: function(ele){
		ele.click(function(){
			var id = this.id.split('_')[1],
			childrenCon = $('#child_of_'+id);
			if (childrenCon.css('display')!='none') {
				$(this).removeClass('extended').addClass('shrinked');
				childrenCon.slideUp();
			}else{
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
	addSelect: function(id){
		// 如果已经被选择了，直接返回
		if ($('#selected_'+id).length) return;
		// 如果已经被排除了，删除排除信息
		if ($('#removed_'+id).length) {
			$('#removed_'+id).remove();
		};
		var parentsId = $('#area_'+id).parents('.j-area-con').map(function(i,ele){
			return ele.id.split('_')[1];
		});
		for (var i=0; i < parentsId.length; i++) {
			var parentId = parentsId[i];
			// 如果父节点已经被选中。删除所有被排除的子节点，并把自己添加进排除列表
			if ($('#selected_'+parentId).length) {
				$('#child_of_'+id+' input').each(function(i,item){
					var id = item.id.split('_')[1];
					item.checked = 'checked';
					item.disabled = false;
				});
				return;
			};
		};
		$('#child_of_'+id+' input').each(function(i,item){
			var id = item.id.split('_')[1];
			$('#selected_'+id).remove();
		});
		// 如果既没有被删除，又没有被排除，则添加进现在已选择的列表中
		$(RenderTemplate(Area.selectedTemplate,Area.areas.find(id),'area')).appendTo($('.selected-con > .con'));
		$('#child_of_'+id).find('input').each(function(i,ele){
			ele.checked = 'checked';
		});
	},
	removeSelect: function(id){
		// 如果已经被选择了，删除
		if ($('#selected_'+id).length) {
			$('#selected_'+id).remove();
			$('#child_of_'+id+' input').each(function(i,ele){
				var id = ele.id.split('_')[1];
				$('#removed_'+id).remove();
				$('#select_'+id)[0].disabled = false;
				ele.checked = false;
			});
		}
		// 如果是已经被排除的
		if ($('#removed_'+id).length) {
			return;
		};
		// 查询父节点
		var parentsId = $('#area_'+id).parents('.j-area-con').map(function(i,ele){
			return ele.id.split('_')[1];
		});
		for (var i=0; i < parentsId.length; i++) {
			var parentId = parentsId[i];
			// 如果父节点已经被选中。删除所有被排除的子节点，并把自己添加进排除列表
			if ($('#selected_'+parentId).length) {
				$('#child_of_'+id+' input').each(function(i,item){
					var id = item.id.split('_')[1];
					item.checked = false;
					item.disabled = 'disabled';
					if ($('#removed_'+id).length) {
						$('#removed_'+id).remove();
					};
				});
				var siblings = $('#area_'+id).parent().find('input');
				var allUnselected = true;
				siblings.each(function(i,ele){
					if (ele.checked) {
						allUnselected = false;
					};
				});
				if (allUnselected) {
					var id = $('#area_'+id).parent().attr('id').split('_')[2];
					$('#select_'+id)[0].checked = false;
					$('#select_'+id).trigger('change');
				}else{
					$(RenderTemplate(Area.removedTemplate,Area.areas.find(id),'area')).insertAfter($('#selected_'+parentId));
				}
				
				break;
			};
		};
	},
	template:				'<div id="area_[#=area.id#]" class="j-area-con">'+
								'<div class="area">'+
									'<span><input type="checkbox" name="" id="select_[#=area.id#]"></span>'+
									'<span>[#=area.title#]</span>'+
								'</div>'+
							'</div>',
	triggerTemplate:		'<span class="shrinked" id="trigger_[#=area.id#]"></span>',
	placeholderTemplate:	'<span class="placeholder"></span>',
	childrenTemplate:		'<div id="child_of_[#=area.id#]" class="children" style="display:none"></div>',
	selectedTemplate:		'<div class="selected" id="selected_[#=area.id#]">'+
								'<span>[#=area.title#]</span>'+
								'<span class="remove close-tag" id="remove_[#=area.id#]"></span>'+
							'</div>',
	removedTemplate:		'<div class="removed" data-parent="[#=area.parentId#]" id="removed_[#=area.id#]">'+
								'<span class="area-selected"></span>'+
								'<span>[#=area.title#]</span>'+
								'<span class="reselect close-tag" id="reselect_[#=area.id#]"></span>'+
							'</div>'
}