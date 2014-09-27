var logger = require('tracer').console();
var express = require('express');
var connect = require('connect');
var http = require('http');
var path = require('path');

var MinoDB = require('minodb');
var db_address = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/minodb';
var mino = new MinoDB({
    api: true,
    ui: true,
    db_address: db_address
})

mino.add_field_type({
	name: "custom_field",
	display_name: "Custom Field",
	class: require('./custom_fields/MyCustomRuleField')
})

var server = express();
server.set('port', process.env.PORT || 5002);
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade')
server.use(express.static(path.join(__dirname, '../public')));;
server.use(express.errorHandler());

server.use('/api/', mino.api_server())
server.use('/ui/', mino.ui_server())

// mino.api.connect(function(){
// 	mino.api.call({username:"TestUser"},{
// 		"function": "get",
// 		parameters:{
// 			addresses:[
// 				"/TestUser/People/Marcus Longmuir",
// 				"person"
// 			]
// 		}
// 	},function(err,res){
// 		logger.log(err);
// 		logger.log(JSON.stringify(res,null,4));
// 	})
// })

server.get('/*', function(req, res) {
    res.render('index');
})

http.createServer(server).listen(server.get('port'), function() {
    console.log('Server started on port ' + server.get('port'));
});