/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		Twitter rate limiting is calculated from the first api request,
 					this is false. Twitter api rate limiting is based on the clock-hour.
 					so it is possible to get double the rate limit by sending 50% at one
 					second before, and 50% at one second after the hour. You are then
 					limited for the next hour of course, but it is an important
 					distinction.
 					
 					This is not reflected in this version of the API because it is not
 					clear on how, or the best method, to find out what 'clock-hour'
 					Twitters servers are basing the API limits on.
 					
 					So until that becomes known, the soft limit will be how we determine
 					how many API requests we have left... it's an edge case and won't
 					likely affect most applications.
 *
 */

var	TwitterResult 	= require('./error'),
	util			= require('./util'),
	config			= require('./config'),
	
	http 			= require('http'),
	oauth 			= require('oauth'),
	request 		= require('request'),
	querystr 		= require('querystring');

function Twitter(args) {

	if (!(this instanceof Twitter)) {
		return new Twitter(args);
	}
  
	this.oauth =	{
						consumer_key: 			null,
						consumer_secret:		null,
						access_token_key:		null,
						access_token_secret:	null
					};
				
	this.api_rate =	{
						timestamp:				null,
						remaining: 				config.api_rate_limit,
						limited:				false
					};

}
module.exports = Twitter;

Twitter.prototype.isRateLimited = function(callback) {
	
	var out = true,
		now = new Date().getTime();
	
	if(this.api_rate.timestamp == null) {
		this.api_rate.timestamp = now;
		// TODO: request current API call count from twitter
	}
	
	// time since first API request is greater
	// than the api limit interval (1 hour)
	// so, reset our soft-limit of API calls
	if((now - this.api_rate.timestamp) > config.api_rate_limit.interval) {
		this.api_rate =	{
							timestamp:				now,
							remaining: 				config.api_rate_limit,
							limited:				false
						};
		out = false;
	} else {
		out = (this.api_rate.remaining > 0);
	}
	
	if(callback !== undefined && util.checkCallback(callback, true)) {
		callback(out);
	} else {
		return out;
	}

}

Twitter.prototype.rateLimitTimeLeft = function(callback) {

	//
	// TODO:	automatically request API call status
	//			from twitter once at initialization,
	//			and then again after every N calls
	//
	//			every 100 calls?
	//

	var out = config.api_rate_limit.interval,
		now = new Date().getTime();
	
	if(this.api_rate.timestamp != null) {
		// TODO: request api call status
		out = (now - this.api_rate.timestamp);
	}
	
	if(callback !== undefined && util.checkCallback(callback, true)) {
		callback(out);
	} else {
		return out;
	}
	
}

Twitter.prototype.getRequestURL = function(url, param, callback) {

	var out = "";
	
	if(url instanceof Array) {
		for(var i=0; i<url.length; i++) {
			out += url[i];
		}
	} else {
		out = url;
	}
	
	out += '?' + querystr.stringify(param, '&', '=');

	if(callback !== undefined && util.checkCallback(callback, true)) {
		callback(out);
	} else {
		return out;
	}
	
}

Twitter.prototype.get = function(url, param, authenticate, callback) {
	url = [ config.endpoints.twitter_rest_base, '/', url , '.json' ];
	return this.fetch(url, param, authenticate, 'GET', callback);
}

Twitter.prototype.post = function(url, param, authenticate, callback) {
	url = [ config.endpoints.twitter_rest_base, '/', url , '.json' ];
	return this.fetch(url, param, authenticate, 'POST', callback);
}

Twitter.prototype.request = function(url, param, authenticate, callback) {

	if(url instanceof Array) {
	
		var method = url[url.length-1];
		
		if(url.length == 2) {
			url = [ config.endpoints.twitter_rest_base, '/', url[0] , '.json' ];
		} else {									// use indices which are objects as tokens to place param keys
			var concat = "",
				keys,
				elm;
			for(var i=0; i<url.length-1; i++) {		// exclude last index as it is reserved for method type
				keys = [];
				elm = url[i];
				if(elm instanceof Object) {			// presumes object keys are ordered correctly
					keys = Object.keys(elm);
					for(var j=0; j<keys.length; j++) {
						concat += param[keys[j]];
					}
				} else {
					concat += elm
				}
			}
			url = [ config.endpoints.twitter_rest_base, '/',concat , '.json' ];
		}
		
		if(callback !== undefined && util.checkCallback(callback, true)) {
			return callback(this.fetch(url, param, authenticate, method, callback));
		} else {
			return this.fetch(url, param, authenticate, method, callback);
		}
		
	} else {
		
		if(callback !== undefined && util.checkCallback(callback, true)) {
			return callback(this.fetch(url, param, authenticate, 'GET', callback));
		} else {
			return this.fetch(url, param, authenticate, 'GET', callback);
		}
		
	}
	
}

Twitter.prototype.fetch = function(url, param, authenticate, method, callback) {

	util.checkCallback(callback, false);
	var parent = this;
	
	this.isRateLimited(function(isLimited) {
	
		if(isLimited) {	// return error indicating rate limit
		
			var out = new TwitterResult( false, 'rate limited' );
		
			if(callback !== undefined && util.checkCallback(callback, true)) {
				callback(out);
			} else {
				return out;
			}
			
		} else {
		
			if(authenticate) {
				// TODO: authenticate the user
				parent.api_rate.remaining.oauth--;
			} else {
				parent.api_rate.remaining.unauthenticated--;
			}
			
			url = parent.getRequestURL(url, param, function(result) {

				// TODO:	parse the streamed data in chunks of JSON,
				//			and emit event for on 'object available'.

				// request the URL
				request({	method:method,
							uri: result } , function(error, response, body) {
				
					var out = null;
					body = JSON.parse(body);

					if(error || response.statusCode != 200 || typeof body.error != 'undefined') {
						out = new TwitterResult( false, {
							message: body.error,
							code: response.statusCode
						});
					} else {
						out = new TwitterResult( true, body );
					}
					
					callback(out);
				
				});
							
				
			});
			
			
		}
	
	})
	
	return this;
	
}
