const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');

const db = new sqlite3.Database( __dirname + '/food_dpt.db',
	function(err){
		if(err){
			console.log(err);
		}
		else if(!err){
			db.run(`
				CREATE TABLE IF NOT EXISTS food(
				id INTEGER PRIMARY KEY,
				name TEXT,
				description TEXT,
				type TEXT
			)`);
			console.log('opened the food department database.');
		}
});

foods = [
	[0, 'lamb', 'Frenched Australian fresh rack of lamb', 'fresh'],
	[1, 'beefSoup', 'Campbells chunky beef soup; 540ml', 'canned'],
	[2, 'pepper', 'McCormick whole black pepper; 500g', 'fresh'],
	[3, 'canola', 'Mazola canola oil, cholesterol free; 1.42li', 'bottled'],
	[4, 'chickenSoup', 'Campbells chunky chicken noodle soup ; 540ml', 'canned'],
	[5, 'crackers', 'Ritz crackers; 388g', 'packaged'],
	[6, 'olive' , ' Pompein extra virgin olive oil  ; 946 ml' , 'bottled'],
	[7, 'duck', 'Juicy single duck breast', 'fresh'],
	[8 , 'ravioli' , ' Chef boyardi beef ravioli with tomato sauce  ; 425 g' , 'canned'],
	[9 , 'noodle' , 'Maruchan instant ramen, assorted flavors  ; 150 g' , 'packaged'],
	[10, 'gummy', 'Dtusa sour gummy bears, fat free, gluten free ; 141g', 'packaged'],
	[11 , 'granola' , 'Nature valley oats and honey granola ; 253 g' , 'packaged'],
	[12 , 'lasagna' , ' Chef boyardi beef lasagna with tomato sauce  ; 425 g' , 'canned']	
];


for(let row of foods){
	db.run(`INSERT INTO food(id, name, description, type) 
		VALUES(?,?,?,?)`, row, (err) => {
	  	if(err){
			console.log(err);
		}
		else{
			console.log('Success');
		}
	});
}
