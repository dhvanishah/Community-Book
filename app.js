
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , home = require('./routes/home')
  , mysql = require('mysql')
  , http = require('http')
  , path = require('path');


var app = express();

app.use(express.bodyParser());
app.configure(function(){
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 3600000000 }}));
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.login);
app.get('/home', home.load);
app.get('/user', home.user);
app.post('/community', home.saveCommunity);
app.get('/communities', home.getCommunityList);
app.get('/posts/:current_community', home.getCommunityPost);
app.post('/post', home.saveNewPost);
app.post('/comment', home.saveNewComment);

app.del('/api/session',function(req,res){
	if(req.session.data){
		req.session.destroy();
		res.send(JSON.stringify({"response" : "Session Destroyed"}));
	}else{
		res.send(JSON.stringify({"response" : "No Session Data to DELETE"}));
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
