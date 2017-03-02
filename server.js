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
	origin: 'https://sample-frontend.herokuapp.com/',
	credentials: true
}));

app.use(session());
app.use(body.json());
app.use(cookie());

app.use(function (req, res) {
	res.send('Hello, world!');
});

app.listen(process.env.PORT || 3001, function () {
	console.log(`Server started at port ${process.env.PORT || 3001}`);
});
