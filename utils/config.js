'use strict';

const config = require('../config');
const eq = require('./eq');

const masterIdRegex = /^\d+$/;
const masterUsernameRegex = /^@?\w+$/;

const stringOrNumber = x =>
	[ 'string', 'number' ].includes(typeof x);

const masterById = value =>
	stringOrNumber(value) &&
	masterIdRegex.test(value);

const masterByUsername = value =>
	stringOrNumber(value) &&
	masterUsernameRegex.test(value);

const masterArray = list =>
	Array.isArray(list) &&
		list.every(value =>
			masterById(value) ||
			masterByUsername(value));

if (
	!masterById(config.master) &&
	!masterByUsername(config.master) &&
	!masterArray(config.master)
) {
	throw new Error('Invalid value for `master` in config file: ' +
		config.master);
}

const ensureArray = value =>
	Array.isArray(value)
		? value
		: [ value ];

const isMaster = user =>
	ensureArray(config.master).some(value =>
		Number(value) === user.id ||
			user.username &&
				masterByUsername(value) &&
				eq.username(user.username, value));

module.exports = {
	isMaster,
};
