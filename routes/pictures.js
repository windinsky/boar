var methods = {
	n: function(req, res){
		res.render('pictures/new.ejs',{
			layout:false
		})
	},
	create:function(req, res){
		var fs = require('fs');
		var tmp_path = req.files.picture.path;
		    // 指定文件上传后的目录 - 示例为"images"目录。 
		var target_path = './public/images/' + req.files.picture.name;
		// 移动文件
		fs.rename(tmp_path, target_path,function(err) {
		    if (err) throw err;
		    // 删除临时文件夹文件,
		    fs.unlink(tmp_path,function() {
				var gm = require('gm');
				gm(target_path).size(function(err,value){
					gm(target_path).resize(240,value.height*240/value.width).noProfile().write('temp.jpg',function(){});
				});
				res.end(target_path);
				// .resize(240, 240)
				// .noProfile()
				// .write('/path/to/resize.png', function (err) {
				//   if (!err) console.log('done');
				// });
		    });
		});
		// var userId = req.session.user_id;
		// var title = req.body.title;
		// var body = req.body.body;
		// var c = Article.create({
		// 	user_id: userId,
		// 	title: title,
		// 	body: body
		// });
		// c.once('success',function(data){
		// 	res.redirect('/articles');
		// });
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