var methods = {
	n: function(req, res){
		// for(var i in req){
		// 	console.log(i);
		// }
		res.render('users/new.ejs', {
			title:'Create new user',
			layout: false
		});
	},
	create:function(req, res){
		var account = req.body.account,
		password = req.body.password;
		var c = User.create({
			account: account,
			password: sha1(password)
		});
		// shasum.digest('hex')
		c.once('success',function(data){
			return res.redirect('/sessions/new');
		});
	},
	edit:function(req, res){
		
	},
	index:function(req, res){
		
	},
	update:function(req, res){
		
	},
	show:function(req, res){
		
	},
	check: function(req,res){
		res.end("0");
	}
};
exports.methods = methods;