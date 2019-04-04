const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const format = require('string-format');
const cookieSession = require('cookie-session');

const db = new sqlite3.Database( __dirname + '/clothing_dpt.db',
	function(err){
		if(err){
			console.log(err);
		}
		else if(!err){
			db.run(`
				CREATE TABLE IF NOT EXISTS clothing(
				id INTEGER PRIMARY KEY,
				name TEXT,
				description TEXT,
				material TEXT,
				style TEXT,
				size TEXT
			)`);
			console.log('opened the clothing department database.');
		}
});

clothes = [
	[13, 'black', 'Massimo Dutti, made in Pakistan', 'Cotton', 'Casual', 'Large'],
	[14 , 'blueblouse' , ' Sadie, made in China' , 'Rayon', 'Casual', 'Large'],
	[15 , 'cap' , ' Swagster, made in Egypt' , 'Polyester and Cotton', 'Casual', 'One size'],
	[16 , 'fanela' , ' cottonil, made in Turkey' , 'Cotton', 'Homewear', 'Small'],
	[17 , 'greenblouse' , ' Sadie, made in china' , 'Rayon', 'casual', 'XXL'],
	[18, 'jeans', 'Barbados, made in China', 'Cotton', 'Casual', 'Medium'],
	[19, 'jeans2', 'Barbados, made in China', 'Cotton', 'Casua', 'Large'],
	[20 , 'oompa' , 'Gucci, Made in loompa' , 'Cotton and thread', 'Work', 'XXXXL'],
	[21, 'shoe', 'Tahari, made in China', 'Leather and Felt', 'Size 9']
];

for(let row of clothes){
	db.run(`INSERT INTO clothing(id, name, description, material, style, size) 
		VALUES(?,?,?,?,?,?)`, row, (err) => {
	  	if(err){
			console.log(err);
		}
		else{
			console.log('Success');
		}
	});
}
