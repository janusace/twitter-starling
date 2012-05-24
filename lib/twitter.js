/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		Twitter rate limiting is calculated from the first api request,
 *					this is false. Twitter api rate limiting is based on the clock-hour.
 *					so it is possible to get double the rate limit by sending 50% at one
 *					second before, and 50% at one second after the hour. You are then
 *					limited for the next hour of course, but it is an important
 *					distinction.
 *					
 *					This is not reflected in this version of the API because it is not
 *					clear on how, or the best method, to find out what 'clock-hour'
 *					Twitters servers are basing the API limits on.
 *					
 *					So until that becomes known, the soft limit will be how we determine
 *					how many API requests we have left... it's an edge case and won't
 *					likely affect most applications.
 *
 * Notes:			1. 	Uses a multi-authentication model, whereby you can supply multiple
 *						credentials and specify which to use for each query, or use round-
 *						robin.
 *						
 *						This comes into play for servers which would otherwise bump up
 *						against API limits etc.
 *
 *					2. 	This file represents the 'core' of the twitter library. You 
 *						can safely use just this file to communicate with twitter, if 
 *						you adequetely understand the parameters of the methods.
 *
 *						that said, it is recommended that you use the 'helper' file instead
 *						as it is easier to use and more easily maintained should twitter
 *						change its API formatting.
 *
 *					3.	The goal is to eventually make this a SAX-like, streaming library
 *						whereby events are fired for each object that is parsed, while it
 *						is parsed rather than downloading the data, parsing it and
 *						returning an array of results. Although both methdologies will be
 *						available.
 *
 *					4. 	some sort of in-built caching support would be nice.
 *
 *					5.	no tests have yet been made on the efficacy of this methodology,
 *						however optimisations would be nice - including, if it helps, 
 *						spawning child processes for http requests.
 *					
 *					
 *						
 *
 */

var	TwitterResult 	= require('./error'),
	util			= require('./util'),
	config			= require('./config'),
	
	request 		= require('request'),
	querystr 		= require('querystring');

function Twitter(login) {

	if (!(this instanceof Twitter)) {
		return new Twitter(args);
	}
	
	if(login === undefined) {
		this.credentials =	[ this.createCredential() ];
	} else if(login instanceof Array) {
		this.credentials = login;
	} else if(login !== undefined && login instanceof Object) {
		this.credentials = [ login ];
	}
	
	// used for round-robin request signing
	this.credentialIndex = 0;

}
module.exports = Twitter;

Twitter.prototype.createCredential = function	(	c_key,
													c_secret,
													a_token_key,
													a_token_secret,
													callback
												) {
	
	var out	=	{
					consumer_key:			'',
					consumer_secret:		'',
					access_token_key:		'',
					access_token_secret:	'',
					
					api:					{
												timestamp:				null,
												remaining: 				config.api_rate_limit.oauth,
												limited:				false
											}			
				};
	
	if(typeof c_secret === 'undefined') {
		callback = c_key;
	} else {
		out.consumer_key = c_key;
		out.consumer_secret = c_secret;
		out.access_token_key = a_token_key;
		out.access_token_secret = a_token_secret;
	}
						
	if(callback !== undefined && util.checkCallback(callback, true)) {
		callback(out);
	} else {
		return out;
	}
	
}

Twitter.prototype.isRateLimited = function(authentication, callback) {
	
	if(typeof callback === 'undefined') {
		if(typeof authentication === 'function') {
			callback = authentication;
		}
	}
	
	var out = true,
		now = new Date().getTime(),
		credential = this.getCredentials(authentication, function(result) {
	 
			for(var i=0; i<result.length; i++) {
			
				// TODO: move to multi-authentication model
			
				if(this.auth_api_rate[i].timestamp == null) {
					this.auth_api_rate[i].timestamp = now;
					this.refreshRateLimitInfo(i);
				}
					
				// TODO: move to twitter-style timestamping (next refresh stamp)
				
				// time since first API request is greater
				// than the api limit interval (1 hour)
				// so, reset our soft-limit of API calls
				if((now - this.auth_api_rate[i].timestamp) > config.api_rate_limit.interval) {
					this.auth_api_rate[i] =	{
												timestamp:				now,
												remaining: 				config.api_rate_limit.oauth,
												limited:				false
											};
					out = false;
				} else {
					out = (this.auth_api_rate.remaining > 0);
				}
				
				if(callback !== undefined && util.checkCallback(callback, true)) {
					callback(out);
				} else {
					return out;
				}
				
			}
		
		});

}

Twitter.prototype.authenticate = function(	consumer_key,
											consumer_secret,
											access_token_key,
											access_token_secret ) {

	// TODO:	1. create a new credentials object
	//			2. verify it
	//			3. add it to the array
	
}

Twitter.prototype.refreshRateLimitInfo = function(credentialIndex, callback) {
		
	if(callback === undefined) {
		if(typeof credentialIndex === 'function') {
			callback = credentialIndex;
			credentialIndex = -1;
		}
	}
	
	// get api call status
	if(credentialIndex < 0) {
	
		for(var i=0; i<this.credentials.length; i++) {
		
			twitter.account.rate_limit_status(null, function(result) {
			
				// TODO: use credentialIndex
			
				if(result.isSuccess) {
					twitter.api_rate[0].remaining = result.data.remaining_hits;
				}
				
				// TODO: use callback
				/*
				if(callback !== undefined && util.checkCallback(callback, true)) {
					callback(out);
				} else {
						return out;
				}
				*/
	
			});
			
		}
		
	} else {
		
		twitter.account.rate_limit_status(null, function(result) {
		
			// TODO: use credentialIndex
		
			if(result.isSuccess) {
				twitter.api_rate[0].remaining = result.data.remaining_hits;
			}
			
			// TODO: use callback
			/*
			if(callback !== undefined && util.checkCallback(callback, true)) {
				callback(out);
			} else {
					return out;
			}
			*/

		});
		
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
		out = (now - this.api_rate.timestamp);
		this.refreshRateLimitInfo();
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
	
	if(param instanceof Object) {
		out += '?' + querystr.stringify(param, '&', '=');
	}

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
			return this.fetch(url, param, authenticate, method, callback);
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

// returns an array of credential objects
Twitter.prototype.getCredentials = function(authentication, callback) {
		
	//
	// authentication =	1. a twitter credentials object
	//					2. an index of a saved credential
	//					3. false - indicating no authentication
	//					4. true	- indicating round-robin authentication
	//					5. an array of twitter credentials
	//

	if(callback === undefined) {
		if(typeof authentication === 'function') {
			callback = authentication;
			authentication = true;
		}
	}
	
	var out;
	
	if(typeof authentication === 'undefined') {
	
		out = null;
	
	} else if(authentication instanceof Array) {
	
		out = authentication;
	
	} else if(typeof authentication === 'boolean') {
		
		if(authentication) {
			
			// round robin
			out = [this.credentials[this.credentialsIndex]];
			
			if(this.credentialsIndex++ > this.credentials.length) {
				this.credentialsIndex = 0;
			}
			
		}  else {
			
			// no authentication
			out = [];
			
		}
		
	} else if(authentication instanceof Object) {
		
		// credentials object
		out = [ authentication ];
		
	} else {
		
		// index of saved credential
		out = [this.credentials[authentication]];
		
	}
	
	if(callback !== undefined && util.checkCallback(callback, true)) {
		callback(out);
	} else {
		return out;
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
		
			twitter.getCredentials(authenticate, function(result) {
			
				// note:	result is the credentials object, 
				//			or null if unauthenticated.
			
				if(result == null) {
					parent.api_rate.remaining.unauthenticated--;
				} else {
					// TODO: authenticate the user
					parent.api_rate.remaining.oauth--;
				}
				
				url = parent.getRequestURL(url, param, function(result) {
	
					// TODO:	parse the streamed data in chunks of JSON,
					//			and emit event for on 'object available'.
	
					// request the URL
					request({	method:method,
								uri: result } , function(error, response, body) {
					
						var out = null,
							data = null;
						
						try {
							data = JSON.parse(body);
						} catch (e) {
							console.log(e);
							data = body;
						}
	
						if(error || response.statusCode != 200 || typeof body.error != 'undefined') {
							out = new TwitterResult( false, {
								message: data.error,
								code: response.statusCode
							});
						} else {
							out = new TwitterResult( true, data );
						}
						
						if(callback !== undefined && util.checkCallback(callback, true)) {
							callback(out);
						} else {
							return out;
						}
					
					});	
					
				});
			
			});
			
		}
	
	})
	
	return this;
	
}
