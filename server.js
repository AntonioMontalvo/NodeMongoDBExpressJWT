// =================================================================
// get the packages we need ========================================
// =================================================================

//dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var devLogger = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var Cookies = require('cookies');


// =================================================================
// configuration ===================================================
// =================================================================
app.set('jwtSecret', config.secret); //set token for encryption.

app.use (devLogger('dev'));//use morgan to log requests to the console. The dev optiomn will give you colores response. Red for sever errors, yellow for client errors cyan for redirect codes and uncolored for all other codes. 

app.use(bodyParser.urlencoded({extended:false}));//use body parser so we can get info from POST and /or URL parameters. It parses the text as URL encode data (which is how browsers send data 'forms' data set to POST and gives you and object (containing keys and values) on req.body
app.use(bodyParser.json());
app.use(express.static('public'));//files contained inside public directory are called directly.

mongoose.connect('mongodb://localhost/casa');
var db = mongoose.connection;//stash the mongoose connection

db.on('error', function(err){//handle possible errors
	console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var User = require('./userModel.js');//here we access the file where the mongoose Schema is set up.

// =================================================================
// routes ==========================================================
// =================================================================

app.get('/', function(req, res){//Landing on '/' will show index.html
	res.send(index.html);
});

app.post('/signup', function(req, res){
	var userInfo = new User(req.body);//We crate an instance of User. We pass req.body as an argument. Remember req.body is an object. 

	userInfo.save(function(err, doc){//save the req.body data to mongoDB.
		if (err){
			res.send(err);
		}
		else {
			console.log("SignUp successful")
			// res.send(doc);//send the data 'doc' to the browser	
		}	
	});
});

app.post('/login', function(req, res){
	User.findOne({
		username: req.body.username
	}, function(err, user){
			if(err) throw err;

			if (!user){
				console.log('user not found');
			} else if (user) {
				if (user.password != req.body.password) {
				console.log('wrong password');
				} else {
				var token = jwt.sign(user, app.get('jwtSecret'), {
					expiresIn: 86400
				});


				// for debug purposes
	            console.log("Cookie Sent")

				// The Cookie will be named 'access_token'.
	            new Cookies(req, res).set('access_token', token, {
	                httpOnly: true,
	                secure: false
	                });

	            

				console.log('token successfully created');
				
				res.json({
					successs: true,
					message: 'Enjoy your token',
					token: token
				});
			}
		}	
	});
});



var port = process.env.PORT || 8080;

// =================================================================
// start the server ================================================
// =================================================================

app.listen(port, function (){
	console.log('Welcome to your Application. App is running here http://localhost: ' + port);	
});
