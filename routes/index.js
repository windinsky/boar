function Controller(controller){
	this.filter = controller.filter;
	this.methods = controller.methods;
	this.execute = function(req,res,method){
		var filterList = [];
		if (this.filter && this.filter.beforeFilters) {
			var filters = this.filter.beforeFilters;
			for (var i=0; i < filters.length; i++) {
				var filter = filters[i];
				if (filter.only && filter.only.length && filter.only.indexOf(method) !== -1) {
					filterList.push(filter.func);
				}else if(filter.except && filter.except.length && filter.except.indexOf(method) === -1){
					filterList.push(filter.func);
				}
				if (!filter.only && !filter.except) {
					filterList.push(filter.func);
				};
			};
			var i = 0;
			function a(){
				if (i < filterList.length) {
					var result = filterList[i](req,res);
					if (result === false) {
						return ;
					}else if(result === true){
						i++;
						if(i < filterList.length) a();
						else controller.methods[method](req,res);
					}else{
						result.on('end',function(obj){
							if (obj == true) {
								if(i < filterList.length) a();
								else this.methods[method](req,res);
							};
						});
					}
				};
			}
			a();
		}else{
			this.methods[method](req,res);
		}
	};
}
function importControllers(ctrl_names){
	for (var i=0; i < ctrl_names.length; i++) {
		var ctrl_name = ctrl_names[i];
		exports[ctrl_name] = new Controller(require('./'+ctrl_name));
	};
}
importControllers([
	'articles',
	'users',
	'sessions',
	'dailyreports'
]);

exports.index = new Controller({
	methods:{
		index:function(req, res){
			res.render('index.ejs', { title: 'Express' , msg: "123" , articles: [] });
		}
	}
});