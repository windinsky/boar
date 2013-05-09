module.exports = {
	index: function(req, res) {
		var find = DailyReport.findByUserId(req.session['user_id']);
		
		find.once('success', function(items) {
			res.render('dailyreports/index.ejs', {title: '日报列表', dailyreports: items});
		});
	},
	n: function(req, res){
		res.render('dailyreports/new.ejs', {title: '添加日报'});
	},
	create:function(req, res){
		
	},
	edit:function(req, res){
		
	},
	update:function(req, res){
		
	},
	show:function(req, res){
		
	},
	check: function(req,res){
		res.end("0");
	}
};