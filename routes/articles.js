var methods = {
	n: function(req, res){
		// if (!checkSession.call(req,res)) return;
		res.render('articles/new.ejs',{
			title:'Create new article'
		});
	},
	create:function(req, res){
		var userId = req.session.user_id;
		var title = req.body.title;
		var body = req.body.body;
		var c = Article.create({
			user_id: userId,
			title: title,
			body: body
		});
		c.once('success',function(data){
			res.redirect('/articles');
		});
	},
	//haha
	edit:function(req, res){
		if (!checkSession.call(req,res)) return;
		var id = req.url.match(/\/articles\/(\d)/);
		if (!id) {
			return res.end('url error');
		}else{
			id = parseInt(id[1]);
			var f = Article.findBy({
				id:id,
				user_id: req.session.user_id
			});
			f.once('success',function(data){
				if (!data || !data.length) {
					return res.render('articles/404.ejs',{
						title:'出错咯~'
					});
				}else{
					return res.render('articles/edit.ejs',{
						title: data[0].title,
						article: data[0],
						author: req.session.user
					});
				}
			});
		}
	},
	index:function(req, res){
		if (!checkSession.call(req,res)) return;
		var f = Article.findByUserId(req.session.user_id);
		f.once('success',function(data){
			res.render('articles/index.ejs',{
				title:'我的文章',
				articles: data
			});
		});
	},
	update:function(req, res){
		if (!checkSession.call(req,res)) return;
		var id = req.url.match(/\/articles\/(\d)/);
		if (!id) {
			return res.end('url error');
		}else{
			id = parseInt(id[1]);
			var f = Article.findBy({
				id:id,
				user_id: req.session.user_id
			});
			f.once('success',function(data){
				if (!data || !data.length) {
					return res.render('articles/404.ejs',{
						title:'出错咯~'
					});
				}else{
					return res.render('articles/edit.ejs',{
						title: data[0].title,
						article: data[0],
						author: req.session.user
					});
				}
			});
		}
	},
	del:function(req, res){
		
	},
	show:function(req, res){
		if (!checkSession.call(req,res)) return;
		var id = req.url.match(/\/articles\/(\d)/);
		if (!id) {
			return res.end('url error');
		}else{
			id = parseInt(id[1]);
			var f = Article.findBy([{
				id:id,
				user_id: req.session.user_id
			},{
				id:id,
				is_public: 1
			}]);
			f.once('success',function(data){
				if (!data || !data.length) {
					return res.render('articles/404.ejs',{
						title:'出错咯~'
					});
				}else{
					return res.render('articles/show.ejs',{
						title: data[0].title,
						article: data[0],
						author: req.session.user
					});
				}
			});
		}
	}
};
// beforeFilter(checkMsg)
exports.methods = methods;
exports.filter={
	beforeFilters:[{
		func: checkSession,
		// only:['n'],
		except:['show']
	},{
		func: function(req,res){
			console.log('haha'),
			res.end('鬼啊！！');
			return false;
		}
	}]
};