'use strict';

var needle = require('needle');
var packageJson = require('./package');

// initiate object
// set headers and save the key and secret.
class postCodeNL {
	constructor (key, secret) {
		if(!key || !secret) {
			let err = new Error("Key and secret must both be applied.");
			throw err;
		}

		// save the base url.
		this.baseUrl = 'https://api.postcode.nl/rest';
		this.version = packageJson.version;

		// set default headers for needle client
		this._auth = new Buffer(key + ':' + secret).toString("base64");
	}

	_formatUrl (url, parameters = {}) {
		let keys = Object.keys(parameters);
		for(let i = 0; i < keys.length; i++) {
			url = url.replace('\{' + keys[i] + '\}', parameters[keys[i]]);
		}

		return this.baseUrl + '/' + url.replace(/^\//, '');
	}

	async _runClient(url, data) {
		let formattedUrl = this._formatUrl(url, data);

		let result = await needle("GET", formattedUrl, null, {
			json: true,
			headers: {
				"Authorization": "Basic " + this._auth
			}
		});

		if('exception' in result.body) {
			return this.errorHandler(result.body);
		}

		return result.body;
	}

	viewByPostcode (postcode, houseNumber, houseNumberAddition = '') {
		if(!postcode) {
			let err = new Error("postcode is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}
		
		if(!houseNumber) {
			let err = new Error("houseNumber is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}

		let postcodeNumber = parseInt(postcode.substr(0, 4));

		if(isNaN(postcodeNumber)) {
			let err = new Error("first 4 characters of postcode must be a number.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(postcodeNumber < 1000 || postcodeNumber > 9999) {
			let err = new Error("first 4 characters of postcode must be between 1000 and 9999.");
			err.status = 400;
			return this.errorHandler(err);
		}
		return this._runClient("/addresses/postcode/{postcode}/{houseNumber}/{houseNumberAddition}", {
			postcode: postcode,
			houseNumber: houseNumber,
			houseNumberAddition: houseNumberAddition
		});
	}

	matchExact (city, street, houseNumber, houseNumberAddition = '') {
		if(!city) {
			let err = new Error("city is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}
		
		if(!street) {
			let err = new Error("street is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}
		
		if(!houseNumber) {
			let err = new Error("houseNumber is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}

		return this._runClient("/addresses/exact/{city}/{street}/{houseNumber}/{houseNumberAddition}", {
			city: city,
			street: street,
			houseNumber: houseNumber,
			houseNumberAddition: houseNumberAddition
		});
	}

	viewByRd (rdX, rdY) {
		if(!rdX) {
			let err = new Error("rdX is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}
		
		if(!rdY) {
			let err = new Error("rdY is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(isNaN(rdX)) {
			let err = new Error("rdX must be a number.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(rdX < 0 || rdX > 300000) {
			let err = new Error("rdX must be between 0 and 300000.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(isNaN(rdY)) {
			let err = new Error("rdY must be a number.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(rdY < 300000 || rdY > 620000) {
			let err = new Error("rdY must be between 300000 and 620000.");
			err.status = 400;
			return this.errorHandler(err);
		}

		return this._runClient("/addresses/rd/{rdX}/{rdY}", {
			rdX: rdX,
			rdY: rdY
		});
	}

	latlon (latitude, longitude) {
		if(!latitude) {
			let err = new Error("latitude is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}
		
		if(!longitude) {
			let err = new Error("longitude is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(isNaN(latitude)) {
			let err = new Error("latitude must be a number.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(isNaN(longitude)) {
			let err = new Error("longitude must be a number.");
			err.status = 400;
			return this.errorHandler(err);
		}

		return this._runClient("/addresses/latlon/{latitude}/{longitude}", {
			latitude: latitude,
			longitude: longitude
		});
	}

	postcodeRanges (postcode) {
		if(!postcode) {
			let err = new Error("postcode is a required.");
			err.status = 400;
			return this.errorHandler(err);
		}

		let postcodeNumber = parseInt(postcode.substr(0, 4));

		if(isNaN(postcodeNumber)) {
			let err = new Error("first 4 characters of postcode must be a number.");
			err.status = 400;
			return this.errorHandler(err);
		}

		if(postcodeNumber < 1000 || postcodeNumber > 9999) {
			let err = new Error("first 4 characters of postcode must be between 1000 and 9999.");
			err.status = 400;
			return this.errorHandler(err);
		}

		return this._runClient("/postcode-ranges/postcode/{postcode}", {
			postcode: postcode
		});
	}

	errorHandler (error) {
		if(error instanceof Error) {
			if(error.status) {
				throw error;
			}
		}

		let err;
		if('exceptionId' in error) {
			switch(error.exceptionId) {
				case 'PostcodeNl_Controller_Address_HouseNumberParameterTooLargeException':
					err = new Error(error.exception ? error.exception : "An unknown error has occured.");
					err.status = 400;
					err.code = 'HouseNumberParameterTooLargeException';
					throw err;
				case 'PostcodeNl_Service_PostcodeAddress_AddressNotFoundException':
					err = new Error(error.exception ? error.exception : "An unknown error has occured.");
					err.status = 400;
					err.code = 'AddressNotFoundException';
					throw err;
				default:
					err = new Error(error.exception ? error.exception : "An unknown error has occured.");
					err.status = 500;
					err.code = error.exceptionId;
					throw err;
			}
		}

		err = new Error("An unknown error has occured.");
		err.status = 500;
		err.code = 'unkownError';
		throw err;
	}
}

module.exports = postCodeNL;
