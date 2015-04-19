var express  = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DATABASE_01');
var db = mongoose.connection;
var session = require('client-sessions');

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
app.use(session({
  cookieName: 'session',
  secret: 'the_cake_is_a_lie',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(session({
  cookieName: 'session',
  secret: 'the_cake_is_a_lie',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
console.log("app.configure");

var CitySchema = mongoose.Schema({
	name: String,
});
var City = mongoose.model('CITY', CitySchema, 'CITY');

app.get('/cities', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	console.log("app.get /cities");
	City.find({}, function(err, cities) {
		
		if( err || !cities) console.log("No cities found");
		  else 
		{
			res.writeHead(200, {'Content-Type': 'application/json'});
			str='[';
			cities.forEach( function(city) {
				str = str + '{ "name" : "' + city.name;
				str = str + '", "_id" : "' + city._id;
				str = str + '"},' +'\n';
			});
			str = str.trim();
			str = str.substring(0,str.length-1);
			str = str + ']';
			console.log(str);
			res.end(str);
		}
	});
});

app.post('/login', function(req, res) {
  User.findOne({ name: req.body.name }, function(err, user) {
    if (!user) {
      res.render('login.jade', { error: 'Invalid name or password.' });
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.redirect('/index');
      } else {
        res.render('login.jade', { error: 'Invalid name or password.' });
      }
    }
  });
});

app.get('/index', requireLogin, function(req, res) {
  if (req.session && req.session.user) { // Check if session exists
    // lookup the user in the DB by pulling their name from the session
    User.findOne({ name: req.session.user.name }, function (err, user) {
      if (!user) {
        // if the user isn't found in the DB, reset the session info and
        // redirect the user to the login page
        req.session.reset();
        res.redirect('/login');
      } else {
        // expose the user to the template
        res.locals.user = user;

        // render the index page
        res.render('index.jade');
      }
    });
  } else {
    res.redirect('/login');
  }
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/login');

});
app.post('/register', function (req, res) {
});

var tripSchema = mongoose.Schema({
	trip_owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'USER', required: true}],
	trip_start: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CITY', required: true}],
	trip_end: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CITY', required: true}],
	trip_date: [{ type: Date, required: true }],
	nb: [{ type: Number, required: true }],
	nb_max: [{ type: Number, required: true }]
});
var Trip = mongoose.model('TRIP', tripSchema, 'TRIP');

app.get('/searchtrip', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST");
	console.log("app.get /searchtrip");

	City.find({}, function(err, trips) {
		if( err || !trips) console.log("No trips found");
		  else 
		{
			res.writeHead(200, {'Content-Type': 'application/json'});
			str='[';
			cities.forEach( function(trip) {
				str = str + '{ "trip_owner" : "' + trip.trip_owner;
				str = str + '", "trip_start" : "' + trip.trip_start;
				str = str + '", "trip_end" : "' + trip.trip_end;
				str = str + '", "trip_date" : "' + trip.trip_date;
				str = str + '", "nb" : "' + trip.nb;
				str = str + '", "nb_max" : "' + trip.nb_max;
				str = str + '", "_id" : "' + trip._id;
				str = str + '"},' +'\n';
			});
			str = str.trim();
			str = str.substring(0,str.length-1);
			str = str + ']';
			console.log(str);
			res.end(str);
		}
	});
});

app.post('/createtrip', function (req, res) {
	var formContents = req.body.formContents,
    newTrip = new Trip();

	newTrip.trip_owner = id;
	newTrip.trip_start = id;
	newTrip.trip_end = id;
	newTrip.trip_date = new Date(strdate);
	newTrip.nb = 0;
	newTrip.nb_max = nb;
	
	newTrip.save(function(err){
        if(err){ throw err; }
        console.log('saved');
    })
	res.send('Trip saved');
});

app.listen(8080);