const sqlite3 = require('sqlite3').verbose();
const cookieSession = require('cookie-session');
const express = require('express');
const format = require('string-format');
const bodyParser = require('body-parser');
const app = express();
// registers the middleware used to parse post data
app.use(bodyParser.urlencoded({ extended: true }));

// check the environment for a different port
const port = process.env.PORT || 8000;
app.use(express.static( __dirname ));

app.use(cookieSession({
	name: 'session',
	//keys: ['key1', 'key2'],
	secret: 'foo'
}));

function check_boop(req,res){
	if(req.body.xd === "boop"){
		res.redirect('tease.html');
	}
	else{
		res.redirect('test.html');
	}
}
app.get('/', function(req,res) {
	res.redirect('/form.html');
});
app.post('/form.html', check_boop, function(req,res) {
	res.end('did it work?');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
