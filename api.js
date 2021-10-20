const express = require('express');
const http = require('http');
const port = process.env.PORT || 3000;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const review = require('./routes/reviewRoutes');

app.set("views",path.join(__dirname,"views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "x-access-token,Origin, X-Requested-With, Content-Type, Accept");
  	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	next();
});

app.use('/review',review);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));