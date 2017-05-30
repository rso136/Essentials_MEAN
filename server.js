// Include Server Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var Users = require('./server/users.js');
var Items = require('./server/items.js');

var app = express();
var PORT = process.env.PORT || 3000; 

app.use(session({ secret: 'app', resave: true, saveUninitialized: true, cookie: { maxAge: 30*24*60*60*1000 }}));
app.use(cookieParser());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(express.static('./public'));

// mongoose.connect('mongodb://localhost/essentials');
mongoose.connect('mongodb://heroku_rqdtg0ms:ufatusi0h2uhttgqh7n4e8lovp@ds157621.mlab.com:57621/heroku_rqdtg0ms');
var db = mongoose.connection;

db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});

db.once('open', function () {
	console.log('Mongoose connection successful.');
});

app.get('/', function(req, res){
	res.sendFile('./public/login.htm');
});

app.post('/create', function(req, res) {

	console.log('email: ' + req.body.email);
	console.log('pass: ' + req.body.pass);
	
	Users.findOne({"email": req.body.email}, function(err, result) {
		if (err) {
			console.log(err);
		}
		
		if (result != null) {
			console.log('User exists');
			res.send('User already exists');
		}
		
		else {
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.pass, salt, function(err, hash) {
					Users.create({
						"email": req.body.email,
						"pass": hash
					}, function(err, result) {
						if(err) {
							console.log(err);
						}
						else {
							console.log(result);
							req.session.logged_in = true;
							req.session.user_email = req.body.email;
							console.log('Email is: ' + req.session.user_email);
							res.send('User created');
						}
					})
				});
			})
		}	
	})
});

app.post('/itemcreate', function(req, res) {
	
	Items.create({
		"email": req.body.email,
		"userID": req.body.userID,
		"item": req.body.item,
		"category": req.body.category,
		"quantity": req.body.quantity, 
		"shopping": 0
	}, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(result);
			res.send('Item posted');
		}
	});
});

app.post('/itemamt', function(req, res) {

 	Items.findOne({
 		"userID": req.body.userID,
 		"item": req.body.item,
 		"shopping": 0
 	}, function(err, items) {
 		items.quantity = req.body.quantity;

 		items.save(function(err, result) {
 			if(err) {
 				console.log(err)
 			}
 			else {
 				console.log(result);
 				res.send(result);
 			}
 		})
 	});
});

app.post('/itemamtdec', function(req, res) {

 	Items.findOne({
 		"userID": req.body.userID,
 		"item": req.body.item,
 		"shopping": 0
 	}, function(err, items) {
 		items.quantity = req.body.quantity;

 		if (items.quantity <= 0) {

 			Items.findOne({
 				"userID": req.body.userID,
 				"item": req.body.item,
 				"shopping": 0
 			}, function(err, items) {
 				items.shopping = 1;

 				items.save(function(err, result) {
 					
 					if(err) {
 						console.log(err)
 					}
 					else {
 						console.log(result);
 						res.send(result);
 					}
 				})

 			})

 		} else {

 		items.save(function(err, result) {
 			
 			if(err) {
 				console.log(err)
 			}
 			else {
 				console.log(result);
 				res.send(result);
 			}
 		})

 		}
 	});
});

app.post('/buy', function(req, res) {

	Items.findOne({
 		"userID": req.body.userID,
 		"item": req.body.item,
 		"shopping": 1
 	}, function(err, items) {
 		items.quantity = req.body.quantity;
 		items.shopping = 0;

 		items.save(function(err, result) {
 			if(err) {
 				console.log(err)
 			}
 			else {
 				console.log(result);
 				res.send(result);
 			}
 		})
 	});

});

app.get('/inventory/:userID', function(req, res) {
	Items.find({"userID": req.params.userID, "shopping": 0}, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(result);
			res.send(result);
		}
	})
});

app.get('/sortAlpha/:userID', function(req, res) {

	Items.find({"userID": req.params.userID, "shopping": 0}).sort({item: 1}).exec(function(err, docs){
	 	
	 	if(err) {
	 		console.log(err);
	 	}
	 	else {
	 		console.log('Sort results: ' + docs);
	 		res.send(docs);
	 	}
	});
});

app.get('/sortQuantA/FB/:userID', function(req, res) {

	Items.find({"userID": req.params.userID, "category": "foodandbeverage", "shopping": 0}).sort({quantity: -1}).exec(function(err, docs){
	 	
	 	if(err) {
	 		console.log(err);
	 	}
	 	else {
	 		console.log('Sort results: ' + docs);
	 		res.send(docs);
	 	}
	});
});

app.get('/sortQuantA/Disp/:userID', function(req, res) {

	Items.find({"userID": req.params.userID, "category": "disposables", "shopping": 0}).sort({quantity: -1}).exec(function(err, docs){
	 	
	 	if(err) {
	 		console.log(err);
	 	}
	 	else {
	 		console.log('Sort results: ' + docs);
	 		res.send(docs);
	 	}
	});
});

app.get('/sortQuantA/Other/:userID', function(req, res) {

	Items.find({"userID": req.params.userID, "category": "other", "shopping": 0}).sort({quantity: -1}).exec(function(err, docs){
	 	
	 	if(err) {
	 		console.log(err);
	 	}
	 	else {
	 		console.log('Sort results: ' + docs);
	 		res.send(docs);
	 	}
	});
});

app.get('/sortQuantD/FB/:userID', function(req, res) {

	Items.find({"userID": req.params.userID, "category": "foodandbeverage", "shopping": 0}).sort({quantity: 1}).exec(function(err, docs){
	 	
	 	if(err) {
	 		console.log(err);
	 	}
	 	else {
	 		console.log('Sort results: ' + docs);
	 		res.send(docs);
	 	}
	});
});

app.get('/sortQuantD/Disp/:userID', function(req, res) {

	Items.find({"userID": req.params.userID, "category": "disposables", "shopping": 0}).sort({quantity: 1}).exec(function(err, docs){
	 	
	 	if(err) {
	 		console.log(err);
	 	}
	 	else {
	 		console.log('Sort results: ' + docs);
	 		res.send(docs);
	 	}
	});
});

app.get('/sortQuantD/Other/:userID', function(req, res) {

	Items.find({"userID": req.params.userID, "category": "other", "shopping": 0}).sort({quantity: 1}).exec(function(err, docs){
	 	
	 	if(err) {
	 		console.log(err);
	 	}
	 	else {
	 		console.log('Sort results: ' + docs);
	 		res.send(docs);
	 	}
	});
});


app.get('/list/:userID', function(req, res) {
	Items.find({"userID": req.params.userID, "shopping": 1}, function(err, result) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(result);
			res.send(result);
		}
	})
});

app.post('/delete/:itemID', function(req, res){

	Items.find({"_id": req.params.itemID}).remove().exec(function(err, result){
		if (err) {
			console.log(err);
		}
		else {
			res.send("Deleted");
		}
	})
});

app.post('/login', function(req, res) {

	Users.findOne({"email": req.body.email}, function(err, users) {
		if (err) {
			console.log(err);
		}
		
		if (users == null) {
			res.send('User not found');
		}
		else {
			bcrypt.compare(req.body.pass, users.pass, function(err, result) {
		        if (result == true){

		        	req.session.logged_in = true;
		          	// req.session.user_email = req.body.email
		          	req.session.user_email = users.email;
		          	req.session.user_id = users._id;
		    	  	console.log(result);
		    	  	console.log('Session email: ' + req.session.user_email);
		    	  	console.log('Session id: ' + req.session.user_id);
				  	// res.send('Login successful');
				  	res.send('Login successful');
		        } else{
			        console.log(err);
					res.send(err);
			    }
    	});

		}
	})
});

app.get('/session', function(req, res) {
	res.send({logged_in: req.session.logged_in, user_email: req.session.user_email, user_id: req.session.user_id});
});

app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
     	res.redirect('/#/');
  })
});

app.listen(PORT, function() {
	console.log("App listening on PORT: " + PORT);
});