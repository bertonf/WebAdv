var express  = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DATABASE_01');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log("DB");
});

console.log("init");
/*
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
*/
console.log("app.configure");

var CitySchema = mongoose.Schema({
	name: String,
});
var City = mongoose.model('CITY', CitySchema, 'CITY');

app.get('/cities', function (req, res) {
	res.header("Access-Control-Allow-Origin", "http://localhost");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	console.log("app.get /cities");
	City.find({}, function(err, cities) {
		var cityMap = {};
		
		if( err || !cities) console.log("No cities found");
		  else 
		{
			res.writeHead(200, {'Content-Type': 'application/json'});
			str='[';
			cities.forEach( function(city) {
				str = str + '{ "name" : "' + city.name + '"},' +'\n';
			});
			str = str.trim();
			str = str.substring(0,str.length-1);
			str = str + ']';
			console.log(str);
			res.end( str);
		}
	});
});

app.get('/authenticate', function (req, res) {
});

app.post('/register', function (req, res) {
});

app.get('/searchtrip', function (req, res) {
});

app.post('/createtrip', function (req, res) {
});

app.listen(8080);