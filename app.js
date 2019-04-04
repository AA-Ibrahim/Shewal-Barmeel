//----Importing all required packages----//
const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');
const dbFill = require('./backend/dbFill');


//----Create user database----//
const db = new sqlite3.Database( __dirname + '/userbase.db',
	function(err){
		if(!err){
			db.run(`
				CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY,
				firstName TEXT,
				lastName TEXT,
				username TEXT,
				password TEXT,
				email TEXT,
				dob DATE,
				administration BOOLEAN,
				recent_items VARCHAR
			)`);
			
			console.log('opened userbase.db');
		}
	});

//----Create food database----//
const dbf = new sqlite3.Database( __dirname + '/food_dpt.db',
	function(err){
		if(err){
			console.log(err);
		}
		else if(!err){
			dbf.run(`
				CREATE TABLE IF NOT EXISTS food(
				id INTEGER PRIMARY KEY,
				name TEXT,
				description TEXT,
				type TEXT,
				price INTEGER
			)`);
			console.log('opened the food department database.');
		}
	});

//----Create clothing database----//
const dbc = new sqlite3.Database( __dirname + '/clothing_dpt.db',
	function(err){
		if(err){
			console.log(err);
		}
		else if(!err){
			dbc.run(`
				CREATE TABLE IF NOT EXISTS clothing(
				id INTEGER PRIMARY KEY,
				name TEXT,
				description TEXT,
				material TEXT,
				style TEXT,
				size TEXT,
				price INTEGER
			)`);
			console.log('opened the clothing department database.');
		}
	});

//----Create electronics database----//
const dbe = new sqlite3.Database( __dirname + '/electronics_dpt.db', function(err){
	if(err){
		console.log(err);
	}
	else if(!err){
		dbe.run(`
			CREATE TABLE IF NOT EXISTS electronic(
			id INTEGER PRIMARY KEY,
			name TEXT,
			price INTEGER,
			description TEXT,
			brand TEXT,
			type TEXT
		)`);
		console.log('opened the electronics department database.');
	}
});

//----Pushing admin data into user database----//

admins = [[1, 'admin', '1', 'admin1', 'admin1', 'admin@mun', 2019-01-01, true]];

//----Pushing data into food database----//
foods = [
	[0, 'lamb', 'Frenched Australian fresh rack of lamb', 'fresh', 25],
	[1, 'beefSoup', 'Campbells chunky beef soup; 540ml', 'canned', 3],
	[2, 'pepper', 'McCormick whole black pepper; 500g', 'fresh', 3],
	[3, 'canola', 'Mazola canola oil, cholesterol free; 1.42L', 'bottled',2],
	[4, 'chickenSoup', 'Campbells chunky chicken noodle soup ; 540ml', 'canned', 1],
	[5, 'crackers', 'Ritz crackers; 388g', 'packaged', 1],
	[6, 'olive' , ' Pompein extra virgin olive oil  ; 946 ml' , 'bottled', 3],
	[7, 'duck', 'Juicy single duck breast', 'fresh', 11],
	[8 , 'ravioli' , ' Chef boyardi beef ravioli with tomato sauce  ; 425 g' , 'canned', 5],
	[9 , 'noodle' , 'Maruchan instant ramen, assorted flavors  ; 150 g' , 'packaged', 4],
	[10, 'gummy', 'Dtusa sour gummy bears, fat free, gluten free ; 141g', 'packaged', 3],
	[11 , 'granola' , 'Nature valley oats and honey granola ; 253 g' , 'packaged', 2],
	[12 , 'lasagna' , ' Chef boyardi beef lasagna with tomato sauce  ; 425 g' , 'canned', 2]	
];

//----Pushing data into clothing database----//
clothes = [
	[13, 'black', 'Massimo Dutti, made in Pakistan', 'Cotton', 'Casual', 'Large','$39.99'],
	[14 , 'blueblouse' , ' Sadie, made in China' , 'Rayon', 'Casual', 'Large','$60.00'],
	[15 , 'cap' , ' Swagster, made in Turkey' , 'Polyester and Cotton', 'Casual', 'One size','$15.00'],
	[16 , 'fanela' , ' cottonil, made in Egypt' , 'Cotton', 'Homewear', 'Small','$5.00'],
	[17 , 'greenblouse' , ' Sadie, made in china' , 'Rayon', 'casual', 'XXL','$55.00'],
	[18, 'jeans', 'Barbados, made in China', 'Cotton', 'Casual', 'Medium','$70.00'],
	[19, 'jeans2', 'Barbados, made in China', 'Cotton', 'Casua', 'Large','$75.00'],
	[20 , 'oompa' , 'Gucci overalls, Made in loompa' , 'Cotton and thread', 'Work', 'XXXXL','$213.50'],
	[21, 'shoe', 'Tahari, made in China', 'Leather and Felt', 'Sport' ,'Size 9', '$185.00']
];


//----Pushing data into electronics database----//
electronics = [
	[22, 'Laptop', '480', 'Intel Core i3, 4GB RAM, 500GB Storage.', 'HP','computers'],
	[23, 'TV', '278', '55-inch Screen with a 4K UltraHD display. Multiple HDMI and USB inputs.', 'LG', 'screens'],
	[24, 'Headphones', '59', 'Bluetooth, NFC Fucntionality, internal battery supports upto 30 hours of use.', 'Beats', 'accessories'],
	[25, 'Blender', '42', '800 Watts, two-speeds control, 5 blades.', 'Hamilton', 'appliances'],
	[26, 'Mixer', '31', '150 Watts, three-speeds control, additional accessories included.', 'Orca', 'appliances'],
	[27, 'iPhone', '829', '128GB, Silver, Unlocked 5.3-inch display, face recognition, 8MP Camera.', 'Apple', 'phones'],
	[28, 'Android', '720', '128GB, Gold, 4GB RAM, 5-inch display, 8MP Camera, Fingerprint scanner.', 'Samsung', 'phones'],
	[29, 'Microwave', '60', '700 Watts, 10 power levels, child safety lock, weight and time defrost.', 'Danby', 'appliances'],
	[30, 'Coffee', '138', '14 oz water reservoir, single capacity, packages and ground coffee compatible.', 'Nespresso', '']
];

//----Server initialization----//
const app=express();
const port = process.env.PORT || 8000;

app.use(express.static( __dirname + '/frontend'));
app.use(bodyParser.urlencoded({extended:true}));


app.set('views', __dirname + '/frontend');
app.engine('hbs', hbs.express4({
	partialsDir: __dirname + '/frontend',
	defaultLayout: __dirname +'/frontend/page.hbs'
}));
app.set('view engine', 'hbs');

app.use(cookieSession({
	name: 'session',
	secret: 'foo'
}));

//----Function for authentication checks on signup----//
function reg_check(req,res){
	let user = '';
	let pass = '';
	let msg = {};
	//----Check for blanks----//
	if(!req.body.firstName){
		res.redirect('/signup');
		console.log('Cannot have a blank first name!');
	}
	else if(!req.body.lastName){
		res.redirect('/signup');
		console.log('Cannot have a blank last name!');
	}
	else if(!req.body.username){
		res.redirect('/signup');
		console.log('Cannot have a blank username!');
	}
	else if(!req.body.password){
		res.redirect('/signup');
		console.log('Cannot have a blank password!');
	}
	else if(!req.body.email){
		res.redirect('/signup');
		console.log('Cannot have a blank email address!');
	}
	else if(!req.body.dob){
		res.redirect('/signup');
		console.log('Cannot have a blank date of birth!');
	}

	//----Check for unique username and password----//
	else if(req.body.username && req.body.password){
		console.log('Checking database for entries');
		db.all(`SELECT DISTINCT username, password FROM users`,[], function(err, rows) {
			if(err){
				console.log(err);
				res.redirect('/signup');
			}
			else{
				console.log('Going through database entries');
				for(let n of rows){
					if(n.username === req.body.username && n.password === req.body.password){
						user = n.username;
						pass = n.password;
						break;
					}
					else if(n.username === req.body.username){
						user = n.username;
						break;
					}
					else if(n.password === req.body.password){
						pass = n.password;
						break;
					}
				}
				
				if(req.body.username === user && req.body.password === pass){
					console.log('Both username and password already exist!');
					res.redirect('/signup');
				}
				else if(req.body.username === user){
					console.log('This username already exists!');
					res.redirect('/signup');
				}
				else if(req.body.password === pass){
					console.log('This password already exists!');
					res.redirect('/signup');
				}
				else{
					db.run(`INSERT INTO users(firstName,lastName,username,password,email,dob,administration) VALUES(?,?,?,?,?,?,?)`,
						[req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.email, req.body.dob, false]);
						res.redirect('/login');
						console.log('Both username and password are unique. You may pass!');
				}
			}
		});
	}
	
}

app.get('/', function(req,res) {
	res.redirect('/landing');
});

app.get('/landing', function(req,res) {
	console.log('Reached the landing page.');
/*		dbf.all(`SELECT * FROM food`, [], function(err, rows) {
	if(err){
		console.log(err);
	}
	else if(!err){
		for(row of rows){
			r = JSON.stringify(row);
			console.log(r);
//			res.send(r);
		}
	}
	});*/
	res.redirect('/landing.html');
});

//----Endpoints for XMLHttpRequest----//
app.get('/land', function(req,res) {
	var it = 11;
	if(it >= 0 && it <= 12){
		dbf.get(`SELECT * FROM food WHERE id = ?`, [it], function(err, row) {
			if(err){
				console.log(err);
			}
			else if(!err){
				if(row){
					r = JSON.stringify(row);
					res.send(r);
					res.end();
					console.log('sending from food database');
				}
			}
		});
	}
	else if(it >= 13 && it <= 21){
		dbc.get(`SELECT * FROM clothing WHERE id = ?`, [it], function(err, row) {
			if(err){
				console.log(err);
			}
			else if(!err){
				if(row){
					r = JSON.stringify(row);
					res.send(r);
					res.end();
					console.log('sending from clothing database');
				}
			}
		});
	}
	else if(it >= 22 && it <= 30){
		dbe.get(`SELECT * FROM electronic WHERE id = ?`, [it], function(err, row) {
			if(err){
				console.log(err);
			}
			else if(!err){
				if(row){
					r = JSON.stringify(row);
					res.send(r);
					res.end();
					console.log('sending from electronics database');
				}
			}
		});
	}
	else{
		console.log('ID does not exist');
	}

});

app.get('/catering', function(req,res) {
	res.redirect('/catering.html');
});

app.get('/recipes', function(req,res) {
	res.redirect('/recipes.html');
});

app.get('/flyers', function(req,res) {
	res.redirect('/Flyers.html');
});
app.get('/food', function(req,res) {
	res.redirect('/food.html');
});


app.get('/gfood', function(req,res) {
	msg = [];
	dbf.all(`SELECT * FROM food ORDER BY (price) ASC`, [], function(err, rows) {
		if(err){
			console.log(err);
		}
		else if(!err){
			for(row of rows){
				msg.push(row);
			}
			r = JSON.stringify(msg);
			res.send(msg);
			res.end();
			console.log('sending everything from food.');
		}
	});

});

app.get('/clothing', function(req,res) {
	res.redirect('/clothing.html');
});

app.get('/gclothing', function(req,res) {
	msg = [];
	dbc.all(`SELECT * FROM clothing ORDER BY (price) ASC`, [], function(err, rows) {
		if(err){
			console.log(err);
		}
		else if(!err){
			for(row of rows){
				msg.push(row);
			}
			r = JSON.stringify(msg);
			res.send(msg);
			res.end();
			console.log('sending everything from clothing.');
		}
	});

});

app.get('/electronics', function(req,res) {
	res.redirect('/electronics.html');
});

app.get('/gelectronics', function(req,res) {
	msg = [];
	dbe.all(`SELECT * FROM electronic ORDER BY (price) ASC`, [], function(err, rows) {
		if(err){
			console.log(err);
		}
		else if(!err){
			for(row of rows){
				msg.push(row);
			}
			r = JSON.stringify(msg);
			res.send(msg);
			res.end();
			console.log('sending everything from electronics.');
		}
	});

});

app.get('/item', function(req,res) {
	req.session.recent_items = req.body.id;
});

//----Endpoint for login and signup pages----//
app.get('/signup', function(req,res) {
	console.log('Reached the signup page.');
	res.redirect('signup.html');	
});
	

app.post('/signup.html', reg_check, function(req,res) {
});

app.get('/sign', function(req,res) {
	let msg = [];
	let user = '';
	db.all(`SELECT DISTINCT username, password FROM users`,[], function(err, rows) {
		if(err){
			console.log(err);
			res.redirect('/signup');
		}
		else{
			console.log('Going through database entries');
			for(let n of rows){
/*				if(n.username === req.body.username && n.password === req.body.password){
					user = n.username;
					pass = n.password;
					break;
				}
				else if(n.username === req.body.username){
					user = n.username;
					break;
				}
				else if(n.password === req.body.password){
					pass = n.password;
					break;
				}*/
				msg.push(n);
			}
			
			//msg = {name: user, password: pass};
			r = JSON.stringify(msg);
			res.send(r);
			res.end;
		}
	});
});

app.get('/login', function(req,res) {
	console.log('Reached the login page.');
	res.redirect('/login.html');
});

app.post('/login.html', function(req,res) {
	//----Check for blanks----//
	if(!req.body.username){
		console.log('Please enter a username.');
		res.redirect('/login');
	}
	else if(!req.body.password){
		console.log('Please enter a password.');
		res.redirect('/login');
	}
	//----Check for existing username and password----//
	if(req.body.username && req.body.password){
		console.log('Checking database for entries');
		db.get(`SELECT firstName, lastName, username, password, email, dob, administration FROM users where username = ? AND password = ?`,[req.body.username, req.body.password], function(err, row) {
			if(err){
				console.log(err);
				res.redirect('/login');
			}
			else{
				if(row){
					console.log('Entry found; credentials check');
					req.session.auth = true;
					req.session.firstName = row.firstName;
					req.session.lastName = row.lastName;
					req.session.username = req.body.username;
					req.session.password = req.body.password;
					req.session.email = row.email;
					req.session.dob = row.dob;
					req.session.administration = row.administration;
					if(req.session.administration === 1){
						console.log('Login successful. Welcome admin!');
						//console.log(req.session);
						res.redirect('/admin');
					}
					else{
						console.log('Login successful. Welcome!');
						console.log(req.session);
						res.redirect('/page');
					}
				}
				else{
					req.session.auth = false;
					console.log('No such username or password exists');
					res.redirect('/login');
				}
			}
		});
	}
});

//----Endpoints for user profile page and admin page----//
app.get('/page', function(req,res) {
	if(req.session.auth == false){
		res.redirect('/login');
		console.log('You must log in to re-access this page!');
	}
	else if(req.session.auth == null){
		res.redirect('/login');
		console.log('Cannot access page without logging in first!');
	}
	else{
		res.type('.html');
		res.render('page', {
			sess : req.session,
			title : 'User page'
		});
	}
});

app.post('/page', function(req,res) {
	res.type('.html');
	if(req.body.op === 'update'){
		db.run(`UPDATE users SET username=?, password=?, email=?, dob=? WHERE firstName=? AND lastName=?`,
	       		[req.body.username, req.body.password, req.body.email, req.body.dob, req.session.firstName, req.session.lastName], function(err){
			if(!err){
				if(req.session.administration == 1){
					res.redirect('/admin');
				}
				else{
					res.redirect('/login');
				}
			}
		});
	}
	else if(req.body.op === 'logout'){
		if(req.session.administration === 1){
			req.session.firstName = 'admin';
			req.session.lastName = '1';
			req.session.username = 'admin1';
			req.session.password = 'admin1';
			req.session.email = 'admin@mun';
			req.session.dob = 2019-01-01;
			console.log(req.session);
			res.redirect('/admin');	
		}
		else{	
			req.session = null;
			console.log(req.session);
			res.redirect('/landing');
		}
	}
});

app.get('/admin', function(req,res){
	if(req.session.auth == false){
		res.redirect('/login');
		console.log('Cannot access page without logging in first!');
	}
	else if(req.session.auth == null){
		res.redirect('/login');
		console.log('Cannot access page without logging in first!');
	}
	res.redirect('/admin.html');
});

app.get('/user_table', function(req,res){
	msg = [];
	db.all(`SELECT * FROM users`, [], function(err, rows) {
		if(err){
			console.log(err);
		}
		else if(!err){
			for(row of rows){
				msg.push(row);
			}
			r = JSON.stringify(msg);
//			console.log(r);
			res.send(r);
			res.end();
			console.log('sending everything from user database.');
		}
	});
});

app.post('/admin.html', function(req,res){
	if(req.body.op === 'modify'){
		db.get(`SELECT firstName, lastName, username, password, email, dob, administration FROM users where username = ?`,[req.body.username], function(err, row) {
			if(err){
				console.log(err);
				res.redirect('/admin');
			}
			else{
				if(row){
					if(row.administration === 1){
						res.redirect('/admin');
						console.log('Cannot modify admin account.');
					}
					else{
						console.log('User found; redirecting to user page for modification.');
						req.session.firstName = row.firstName;
						req.session.lastName = row.lastName;
						req.session.username = req.body.username;
						req.session.password = row.password;
						req.session.email = row.email;
						req.session.dob = row.dob;
						console.log(req.session);
						res.redirect('/page');
					}
				}
				else{
					console.log("No such user exists.");
					res.redirect('/admin');
				}
				
			}
		});
	}
	else if(req.body.op === 'delete'){
		db.get(`SELECT firstName, lastName, username, password, email, dob, administration FROM users where username = ?`,[req.body.username], function(err, row) {
			if(err){
				console.log(err);
				res.redirect('/admin');
			}
			else{
				if(row){
					if(row.administration === 1){
						res.redirect('/admin');
						console.log('Cannot delete the admin account.');
					}
					else{
						db.run(`DELETE FROM users WHERE username=?`, [req.body.username], function(err){
							if(err){
								console.log(err);
								res.redirect('/admin');
							}
							else{
								console.log('Delete successful. User no longer exists!');
								res.redirect('/admin');
							}
						});
					}
				}
				else{
					console.log("No such user exists.");
					res.redirect('/admin');
				}
				
			}
		});
	}

/*		else{
			db.run(`DELETE FROM users WHERE username=?`, [req.body.username], function(err){
				if(err){
					console.log(err);
					res.redirect('/admin');
				}
				else{
					console.log('Delete successful. User no longer exists!');
					res.redirect('/admin');
				}
			});
		}*/
	else if(req.body.op === 'logout'){
		req.session = null;
		res.redirect('/landing');
	}
});

//----Initialize server for application to run on----//
app.listen(port, function() {
    console.log(`Listening on port ${port}!`);
});


//----Create delay for database initialization to occur properly----//
setTimeout(()=>{
	dbFill.fill_Admin(admins, db)
	dbFill.fill_Food(foods, dbf)
	dbFill.fill_Clothing(clothes, dbc)
	dbFill.fill_Electronics(electronics, dbe)
}, 3000)
