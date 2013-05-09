
/**
 * Module dependencies.
 */
require('helper');
require('controller_helper').init();
var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "windinsky" }));
  app.use(express.methodOverride());
  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


function RoutesResource(resource){
	app.get('/'+resource,function(req,res){
		routes[resource].execute(req,res,'index');
	});
	app.post('/'+resource,function(req,res){
		routes[resource].execute(req,res,'create');
	});
	app.get('/'+resource+'/new',function(req,res){
		routes[resource].execute(req,res,'n');
	});
	app.get('/'+resource+'/\\d/edit',function(req,res){
		routes[resource].execute(req,res,'edit');
	});
	app.post('/'+resource+'/\\d',function(req,res){
		routes[resource].execute(req,res,'update');
	});
	app.post('/'+resource+'/\\d/del',function(req,res){
		routes[resource].execute(req,res,'del');
	});
	app.get('/'+resource+'/\\d',function(req,res){
		routes[resource].execute(req,res,'show');
	});
}

// RoutesResource('sessions',{
// 	beforeFilter: {
// 		func: checkSession,
// 		except:['new','create']
// 	}
// })



// Routes
app.get('/', function(req,res){
	routes.index.execute(req,res,'index');
});
app.get('/login', function(req,res){
	routes.sessions.execute(req,res,'n');
});
app.post('/users/check', function(req,res){
	routes.users.execute(req,res,'check');
});
RoutesResource('articles');
// RoutesResource('pictures');
RoutesResource('users');
RoutesResource('sessions');
RoutesResource('dailyreports');
// router();

// Initialize database and Model Classes
require('activeRecord').initDbClasses();

// Main

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});