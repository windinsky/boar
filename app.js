
/**
 * Module dependencies.
 */


 // add by test

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
	app.get('/'+resource,routes[resource].index);
	app.post('/'+resource,routes[resource].create);
	app.get('/'+resource+'/new',routes[resource].n);
	app.get('/'+resource+'/\\d/edit',routes[resource].edit);
	app.post('/'+resource+'/\\d',routes[resource].update);
	app.post('/'+resource+'/\\d/del',routes[resource].del);
	app.get('/'+resource+'/\\d',routes[resource].show);
}

require('helper');

// Routes
app.get('/', routes.index);
app.get('/login', routes.sessions.n);
app.post('/users/check', routes.users.check);
RoutesResource('articles');
// RoutesResource('pictures');
RoutesResource('users');
RoutesResource('sessions');


// Initialize database and Model Classes
require('activeRecord').initDbClasses();

// Main

app.listen(3000, function(){
  // console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});