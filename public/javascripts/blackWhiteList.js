var CATEGORY_TEMPLATE = '<div class="category" id="[#=category.pre()#]"><p><span class="closed trigger" id="[#=category.pre()#]_handle"></span></p><input type="checkbox" class="category_checkbox" id="[#=category.pre()#]_checkbox"/><label for="[#=category.pre()#]_checkbox">[#=category.name#]</label></div>';
var DOMAIN_TEMPLATE = '<div class="domain" id="[#=domain.pre()#]"><input type="checkbox" class="domain_checkbox" id="[#=domain.pre()#]_checkbox"/><label for="[#=domain.pre()#]_checkbox">[#=domain.name#]</label></div>';
var DISPLAY_DOMAIN_TEMPLATE = '<div class="display" id="display_[#=domain.pre()#]">[[#=domain.category.exchange#]][[#=domain.category.name#]][#=domain.name#]<p><span class="remove_domain" id="remove_[#=domain.pre()#]"></span></p></div>';
var DISPLAY_CATEGORY_TEMPLATE = '<div class="display" id="display_[#=category.pre()#]">[[#=category.exchange#]][#=category.name#]<p><span class="remove_category" id="remove_[#=category.pre()#]"></span></p></div>';

var DATAS = {
	tanx:{}
};
// classes
function Category(category,exchange){
	this.name = category;
	this.exchange = exchange;
	this.domains = [];
}
function Domain(domain,category){
	this.selected = false;
	this.name = domain;
	this.category = category;
}
Category.prototype = {
	insertDomain: function(domain){
		var d = new Domain(domain,this);
		this.domains.push(d);
		return d;
	},
	find:function(domain){
		for (var i=0; i < this.domains.length; i++) {
			if(this.domains[i].name === domain){
				return this.domains[i];
			}
		};
		return null;
	},
	pre: function(){
		return this.exchange + '_' + this.name;
	}
}
Domain.prototype = {
	pre: function(){
		return this.category.exchange + '_' + this.category.name + '_' + this.name;
	}
}
// DOM related
var views = {
	createCategory: function(category){
		$('#domainList').append(renderTemplate(CATEGORY_TEMPLATE,category,'category'));
	},
	createDomain: function(domain){
		var pre = domain.category.pre();
		var con = $('#'+pre+'_domains');
		if (!con.length) {
			$('<div id="'+pre+'_domains" class="domains"></div>').insertAfter($('#'+pre));
			con = $('#'+pre+'_domains');
			// console.log(con);
		}
		con.append(renderTemplate(DOMAIN_TEMPLATE,domain,'domain'));
	},
	createDisplay: function(domain){
		$('#selectedDomain').append(renderTemplate(DISPLAY_DOMAIN_TEMPLATE,domain,'domain'));
	},
	createCategoryDisplay: function(category){
		$('#selectedDomain').append(renderTemplate(DISPLAY_CATEGORY_TEMPLATE,category,'category'));
	}
}
// date related
var datas = {
	loadDomain: function(category){
		var c = $('<div style="margin-left:40px;">正在加载</div>').insertAfter($('#'+category.pre()));
		$.ajax({
			url:'/blackWhiteList/getDomains?category='+category.name+'&exchange='+category.exchange,
			type:'get',
			dataType:'json',
			success:function(domains){
				c.remove();
				$('#'+category.pre()+'_handle').removeClass('closed').addClass('open');
				for (var i=0; i < domains.length; i++) {
					var domain = category.insertDomain(domains[i]);
					views.createDomain(domain);
				};
				if ($('#'+category.pre()+'_checkbox').attr('checked')) {
					$('#'+category.pre()+'_checkbox').trigger('change');
				};
				category.loaded = true;
			}
		})
	},
	loadCategory: function(exchange){
		$.ajax({
			url:'/blackWhiteList/getCategory?id='+exchange,
			type:'get',
			dataType:'json',
			success:function(data){
				for (var i=0; i < data.length; i++) {
					var category = new Category(data[i],'tanx');
					DATAS.tanx[data[i]] = category;
					views.createCategory(category);
				};
			}
		});
	},
	select: function(domainInfo){
		var exchange = domainInfo.split('_')[0],
		category = domainInfo.split('_')[1],
		domain = domainInfo.split('_').splice(2).join('_'),
		d = DATAS[exchange][category].find(domain);
		_(domainInfo).attr('checked','checked');
		!_('display_'+domainInfo).length && views.createDisplay(d);
		d.selected = true;
	},
	unselect: function(domainInfo){
		var exchange = domainInfo.split('_')[0],
		category = domainInfo.split('_')[1],
		domain = domainInfo.split('_').splice(2).join('_')
		_(''+domainInfo+'_checkbox').attr('checked',false);
		_('display_'+domainInfo).remove();
		DATAS[exchange][category].find(domain).selected = false;
	},
	selectCategory:function(categoryInfo){
		var exchange = categoryInfo.split('_')[0],
		category = categoryInfo.split('_')[1];
		var c = DATAS[exchange][category];
		_(''+categoryInfo+'_checkbox').attr('checked',true);
		!_('display_'+categoryInfo).length && views.createCategoryDisplay(c);
		c.selected = true;
	},
	unselectCategory: function(categoryInfo){
		var exchange = categoryInfo.split('_')[0],
		category = categoryInfo.split('_')[1];
		_(''+categoryInfo+'_checkbox').attr('checked',false);
		_('display_'+categoryInfo).remove();
		DATAS[exchange][category].selected = false;
	}
}
function _(id){
	return $(document.getElementById(id));
}
$(function(){
	resize();
	datas.loadCategory('tanx');
	$('.trigger').live('click',function(e){
		var exchange = this.id.split('_')[0],category = this.id.split('_')[1];
		var categoryObj = DATAS[exchange][category];
		if (!categoryObj.loaded) {
			datas.loadDomain(categoryObj);
			return ;
		};
		if ($(this).hasClass('closed')) {
			$(this).removeClass('closed').addClass('open');
			$('#'+exchange+'_'+category+'_domains').show();
		}else{
			$(this).addClass('closed').removeClass('open');
			$('#'+exchange+'_'+category+'_domains').hide();
		}
	});
	$('.category_checkbox').live('change',function(){
		var exchange = this.id.split('_')[0],category = this.id.split('_')[1];
		var domainListInput = $('#'+exchange+'_'+category+'_domains input')
		domainListInput.attr({
			checked:false,
			disabled:this.checked
		});
		domainListInput.trigger('change');
		this.checked ? datas.selectCategory(this.id.replace('_checkbox','')) : datas.unselectCategory(this.id.replace('_checkbox',''));
	});
	$('.domain_checkbox').live('change',function(){
		this.checked ? datas.select(this.id.replace('_checkbox','')) : datas.unselect(this.id.replace('_checkbox',''));
	});
	$('.display').live('mouseover',function(){
		$(this).css({
			background:'#ecf6ff'
		});
		$(this).find('span').addClass('remove_hover');
	}).live('mouseout',function(){
		$(this).css({
			background:'none'
		});
		$(this).find('span').removeClass('remove_hover');
	});
	$('.remove_domain').live('click',function(){
		datas.unselect(this.id.replace('remove_',''));
	});
	$('.remove_category').live('click',function(){
		datas.unselectCategory(this.id.replace('remove_',''));
	})
})

function resize(){
	var h = $(window).height();
	$('#container').css({
		height:h-20+'px',
		marginTop:'10px'
	});
	$('#content').height(h-20+'px');
	$('#domainList').height($('#content').height()-($('#search').offset().top+$('#search').height()-10));
	$('#selectedDomain').height($('#content').height()-($('#search').offset().top))
}

function renderTemplate(template,obj,obj_name){
	//render [#=something#]
	function __(template,obj,obj_name){
		eval("var "+obj_name+"=obj");
		var m,t = template;
		while(m = t.match(/\[#\=(.*?)#\]/)){
			t = t.replace(m[0],eval(m[1]));
		}
		return t;
	};
	//blablabla
	var m,t = template,frags=[],commands=[],p=0;
	//divide the template
	while(m = t.match(/\[#([^\=].*?)#\]/)){
		frags.push(t.substr(0,t.indexOf(m[0])));
		commands.push(m[1]);
		t = t.substr(t.indexOf(m[0])+m[0].length);
	}
	frags.push(t);
	//combine the frags
	var result="",str="";
	for (var _=0; _ < commands.length; _++) {
		if (frags[_].trim() != "") 
			str+="result+=__('"+frags[_]+"',obj,obj_name);";
		str+=commands[_];
	};
	str+="result+=__('"+frags[_]+"',obj,obj_name);";
	//execute
	eval(str);
	return result;
}
$(window).resize(resize);