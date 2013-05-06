var methods = {
	n: function(req, res){
		var error = req.session.error || '';
		req.session.error = undefined;
		res.render('sessions/new.ejs',{layout:false,error:error});
	},
	create:function(req, res){
		var account = req.body.account,
		password = req.body.password;

		var f = User.findBy({
			account:account,
			password: sha1(password)
		});
		f.once('success',function(data){
			if (data.length) {
				req.session.user = account;
				req.session.user_id = data[0].id;
				req.session.flash = '登录成功！';
				this.redirect(req.session.url || '/');
			}else{
				req.session.flash = '用户名密码错误';
				this.redirect('/sessions/new');
			}
		}.bind(res));
		return 0;
	},
	//haha
	edit:function(req, res){
		
	},
	index:function(req, res){
		
	},
	update:function(req, res){
		
	},
	del:function(req, res){
		
	},
	show:function(req, res){
		
	}
};
exports.methods = methods;