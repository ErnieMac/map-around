///////////////////////
// APP CONFIGURATION //
///////////////////////

// All the libraries (modules) that we use
var express 	= require('express'),
	sass        = require('node-sass'),
	fs          = require('fs'),
	Common 		= require('./common.js'),
	Route 		= require('./route.js'),
	Model 		= require('./model.js');

// Compile our sass files into _style.css
sass.render({
	file: __dirname + '/public/sass/base.scss',
	success: function(css){
		// After compiling the SASS to CSS, write it to _app.css
		fs.writeFile(__dirname + '/public/css/_app.css', css, function (err) {

			if (!err) console.log("Main CSS compiled");
			else console.log(err)
		});
	},
	error: function(err) {
		console.log(err);
	}
});

// Path to the public directory for serving js/css/img files
var pub = __dirname + '/public';

// Setup express framework
var app = express();
app.use(express.static(pub));
app.use(express.errorHandler());


// Sets the path to our views (jade files)
app.set('views', __dirname + '/views');

// Set our default template engine to "jade"
app.set('view engine', 'jade');

// Default Configuration
app.configure(function(){
	app.locals.google_api_key = Common.conf.google.api_key;
	app.use(express.bodyParser());
	app.use(app.router);
})

// Development Configuration
app.configure('development', function(){
	// FOR ANALYTICS LATER app.locals.mixpanel_token = "81b544afb31fc029dfd9fd7979772e87";
	Common.mongoose.set('debug', true);
	console.log("Dev development");
});

// Production Configuration
app.configure('production', function(){
	// FOR ANALYTICS LATER app.locals.mixpanel_token = "d2b671edd9621cac1fe73490086f920d";
	console.log("Prod development")
});

console.log('mongodb://' + Common.conf.mongo_config.auth.name + ':' + Common.conf.mongo_config.auth.pass + '@' + Common.conf.mongo_config.host + ':' + Common.conf.mongo_config.port + '/' + Common.conf.mongo_config.dbname);

// Connect to our mongodb database
Common.mongoose.connect('mongodb://' + Common.conf.mongo_config.auth.name + ':' + Common.conf.mongo_config.auth.pass + '@' + Common.conf.mongo_config.host + ':' + Common.conf.mongo_config.port + '/' + Common.conf.mongo_config.dbname, {db: {safe:true}});

//
//
//
//
//

/////////////////////////
// Start up the server //
/////////////////////////

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

////////////////////////////////////
// GET AND POST REQUESTS (Routes) //
////////////////////////////////////

// Load the home page
app.get('/', Route.index.landing);

// For loading our partial views
app.get('/partials/:name', Route.index.partials);

// Party requests
app.post('/api/createParty', Route.party.createParty)

// Party Search
app.post('/api/searchParty', Route.party.searchParty)

//
//
//
//
//
// End app.js