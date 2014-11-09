var logger = require('tracer').console();
var express = require('express');
var connect = require('connect');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var mustacheExpress = require('mustache-express');

var MinoDB = require('minodb');
var db_address = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/minodb';
var mino = new MinoDB({
    api: true,
    ui: true,
    db_address: db_address
})
var MinoSDK = require('minosdk');
var sdk = new MinoSDK("testuser");
sdk.set_local_api(mino.api);

mino.add_field_type({
	name: "custom_field",
	display_name: "Custom Field",
	class: require('./custom_fields/MyCustomRuleField')
})

var server = express();
server.set('port', process.env.PORT || 5002);
var mustache_engine = mustacheExpress();
delete mustache_engine.cache;
server.engine('mustache', mustache_engine);
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'mustache');
server.use(errorHandler());
server.use(bodyParser());
server.use('/mino/', mino.server())

server.use('/get', function(req, res){
	sdk.get([
    	"/testuser/",
    	"/testuser/another/2"
    ],function(api_err, api_res){
	    res.json(api_res);
	})
})

server.get('/*', function(req, res) {
    // res.render('index');
    sdk.search([
    	"/testuser/"
    ],function(api_err, api_res){
	    res.json(api_res);
	})
})

http.createServer(server).listen(server.get('port'), function() {
    console.log('Server started on port ' + server.get('port'));
});