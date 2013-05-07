
/*
 * GET home page.
 */
exports.articles = require('./articles').methods;
exports.users = require('./users').methods;
exports.sessions = require('./sessions').methods;
// exports.pictures = require('./pictures').methods;

exports.index = function(req, res){
	// var path = require('./path1.js').path;
	// var temp = {};
	// for(var i in path){
	// 	temp[path[i].name] = path[i];
	// 	temp[path[i].name].text = path[i].name;
	// 	temp[path[i].name].name = undefined;
	// 	// delete temp[path[i].name].name;
	// }
	// res.json(temp);
	
	// if (!checkSession.call(req,res)) return;
	// var msg = req.session.msg || '';
	// req.session.msg = undefined;
	// var f = Article.findBy([{
	// 	is_public:1
	// },{
	// 	user_id: req.session.user_id
	// }]);
	res.render('index.ejs', { title: 'Express' , msg: "123" , articles: [] });
	// f.once('success',function(data){
	// 	
	// });
};
exports.get = function(req,res){
	res.end('["http://g.163.com/r?site=netease&affiliate=homepage&cat=homepage&type=logo190x180&location=3","http://g.163.com/r?site=netease&affiliate=homepage&cat=homepage&type=column360x100&location=5"]');
}
exports.save = function(req,res){
	var fs = require("fs");
	var imgData = req.body.img;
    //过滤data:URL
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	var dataBuffer = new Buffer(base64Data, 'base64');
	fs.writeFile("out"+Math.random()+".png", dataBuffer, function(err) {
		if(err){
			
		}else{
			
		}
	});
	res.end('');
}