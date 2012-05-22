/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		Unicorns are magic.
 *
*/
var util = require('./util');

// https://dev.twitter.com/docs/error-codes-responses
var status_codes = 	{
						200:	'OK',
						304:	'Not Modified',
						400:	'Bad Request',
						401:	'Unauthorized',
						403:	'Forbidden',
						404:	'Not Found',
						406:	'Not Acceptable',
						420:	'Enhance Your Calm',
						500:	'Internal Server Error',
						502:	'Bad Gateway',
						503:	'Service Unavailable',
						504:	'Gateway timeout'
					};

var error_codes	=	{
						34:		'Sorry, that page does not exist',
						130:	'Over capacity',
						131:	'Internal error'
					};

function TwitterResult(success, theData) {

	this.isSuccess	= false;
	this.data		= null;						// only one of data, or error,
	this.error		= 	{						// should ever be assigned.
							message:	'unknown',
							code:		-1
						}						

	if(success !== undefined) {
	
		this.isSuccess = success;
		
		if(theData !== undefined) {
			if(success) {
				this.data = theData;
			} else {
				this.error = theData;
			}
			
		}
		
	}	
	
}
module.exports = TwitterResult;

TwitterResult.prototype.message = function(callback) {
	
	var out = null;

	if(this.isSuccess) {
		out = this.data;
	} else {
		out = this.error.message;
	}
	
	if(callback !== undefined && checkCallback(callback, true)) {
		callback(out);
	} else {
		return out;
	}

}

TwitterResult.prototype.kind = function(callback) {
	
	var out = 'failure';
	
	if(this.isSuccess) {
		out = 'success'; 
	}
	
	if(callback !== undefined && checkCallback(callback, true)) {
		callback(out);
	} else {
		return out;
	}
	
}
