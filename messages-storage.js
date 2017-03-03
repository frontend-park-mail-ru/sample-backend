'use strict';

const STORAGE_LIMIT = 128;

class MessagesStorage {
	constructor() {
		this.storage = [];
	}

	clear() {
		this.storage = [];
	}

	addMessage(message) {
		if (typeof message.text !== "string"
			|| typeof message.email !== "string"
			|| typeof message.login !== "string") {
			throw new Error('You must specify message text or/and sender email and login');
		}

		this.storage.unshift({
			text: message.text,
			email: message.email,
			login: message.login,
			timestamp: Date.now()
		});

		if (this.storage.length > STORAGE_LIMIT) {
			this.storage = this.storage.slice(0, STORAGE_LIMIT);
		}
	}

	getMessages(limit = null, offset = 0) {
		if (limit !== null) {
			return this.storage.slice(offset, offset + limit);
		} else {
			return this.storage.slice(offset);
		}
	}
}

module.exports = MessagesStorage;
