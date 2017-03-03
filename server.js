'use strict';

const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const body = require('body-parser');
const cors = require('cors');
const MessagesStorage = require('./messages-storage');


const app = express();
const productionMessagesStorage = new MessagesStorage();
const testingMessagesStorage = new MessagesStorage();

const testingCredentials = {
	headerName: 'X-SERCET-TESTING',
	headerSecret: '5f59cd181b2b364d98c405767b1b849dafbc055815f496d63f531a1685ecf504'
};

app.use(morgan('combined'));
app.use(cors({
	origin: ['https://sample-frontend.herokuapp.com/', 'http://localhost:3000'],
	credentials: true,
	allowedHeaders: ['X-EXPRESS-SESSIONID', 'X-SERCET-TESTING', 'Content-Type', 'Authorization']
}));
app.use(session({
	secret: 'X-EXPRESS-SESSIONID',
	resave: true,
	saveUninitialized: true
}));
app.use(body.json());
app.use(cookie());

app.get('/api/messages', function (req, res) {
	let storage = null;
	if (req.get(testingCredentials.headerName) === testingCredentials.headerSecret) {
		storage = productionMessagesStorage;
	} else {
		storage = testingMessagesStorage;
	}

	const {limit, offset} = req.query;

	const messages = storage.getMessages(limit, offset);

	res
		.status(200)
		.json(messages);
});

app.post('/api/messages', function (req, res) {
	let storage = null;
	if (req.get(testingCredentials.headerName) === testingCredentials.headerSecret) {
		storage = productionMessagesStorage;
	} else {
		storage = testingMessagesStorage;
	}

	try {
		storage.addMessage(req.body);
	} catch ({text}) {
		return res
			.status(400)
			.json({
				code: 'ERROR',
				errorText: text
			});
	}
	res
		.status(200)
		.json({
			code: 'OK',
			responseText: 'Сообщение добавлено'
		});
});

app.delete('/api/messages', function (req, res) {
	if (req.get(testingCredentials.headerName) !== testingCredentials.headerSecret) {
		return res
			.status(401)
			.json({
				code: 'ERROR',
				errorText: 'Вызов этого метода невозможен на боевом хранилище'
			});
	}

	testingMessagesStorage.clear();
	res
		.status(200)
		.json({
			code: 'OK',
			responseText: 'Хранилище было очищено'
		});
});

app.listen(process.env.PORT || 3001, function () {
	console.log(`Server started at port ${process.env.PORT || 3001}`);
});
