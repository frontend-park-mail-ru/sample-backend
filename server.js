'use strict';

const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const body = require('body-parser');
const cors = require('cors');

const app = express();

app.use(morgan('combined'));
app.use(cors({
	origin: ['https://sample-frontend.herokuapp.com/', 'http://localhost:3000'],
	credentials: true,
	allowedHeaders: ['X-EXPRESS-SESSIONID', 'Content-Type', 'Authorization']
}));
app.use(session({
	secret: 'X-EXPRESS-SESSIONID',
	resave: true,
	saveUninitialized: true
}));
app.use(body.json());
app.use(cookie());

app.use(function (req, res) {
	res.send('<h1>Hello, world!</h1>');
});

app.listen(process.env.PORT || 3001, function () {
	console.log(`Server started at port ${process.env.PORT || 3001}`);
});
