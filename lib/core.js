/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * parent:			@sean_nicholls
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
 *					We will also frequently ping the Twitter server for an update on what
 *					the current API status is like. This is currently done at some 
 *					arbitrary intervals:
 *
 *					1. 	upon instantiation of the Twitter object. It may become necessary
 *						at some stage to make this optional.					
 *
 *					2.	every 50 API requests.
 *
 *
 *
 * Notes:			1. 	Uses a multi-authentication model, whereby you can supply multiple
 *						credentials and specify which to use for each query, or use round-
 *						robin.
 *						
 *						This comes into play for servers which would otherwise bump up
 *						against API limits etc.
 *					
 *					3.	The goal is to eventually make this a SAX-like, streaming library
 *						whereby events are fired for each object that is parsed, while it
 *						is parsed rather than downloading the data, parsing it and
 *						returning an array of results. Although both methdologies will be
 *						available.
 *					
 *					4. 	some sort of minimal built-in caching support would be nice.
 *					
 *					5.	no tests have yet been made on the efficacy of this methodology,
 *						however optimisations would be nice - including, if it helps, 
 *						spawning child processes for http requests.
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
		return new Twitter(login);
	}
	
	if(login === undefined) {
		this.credentials	= [ this.createCredential(	'',
														'',
														'',
														'',
														false,
														this) ];
	} else if(login instanceof Array) {
		this.credentials = login;
	} else if(login !== undefined && login instanceof Object) {
		this.credentials = [ login ];
	}
	
	// unauthenticated api tracking
	this.api_rate =	{
						timestamp:				null,
						remaining: 				config.api_rate_limit.oauth,
						limited:				false
					};
	
	// used for round-robin request signing
	this.credentialIndex = 0;
	
	//
	// helper objects
	//
	this.timeline				= new TwitterHelper.prototype.Timeline(this);
	this.statuses				= new TwitterHelper.prototype.Statuses(this);		
	this.retweets				= new TwitterHelper.prototype.Retweets(this);
	this.oembed					= new TwitterHelper.prototype.Oembed(this);
	this.search					= new TwitterHelper.prototype.Search(this);
	this.direct_messages		= new TwitterHelper.prototype.DirectMessages(this);
	this.users					= new TwitterHelper.prototype.Users(this);
	this.favourites				= new TwitterHelper.prototype.Favourites(this);
	this.lists					= new TwitterHelper.prototype.Lists(this);
	this.account				= new TwitterHelper.prototype.Account(this);
	this.notifications			= new TwitterHelper.prototype.Notifications(this);

}
module.exports = Twitter;

Twitter.prototype.createCredential = function	(	c_key,
													c_secret,
													a_token_key,
													a_token_secret,
													callback,
													parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
	var out	=	{
					consumer_key:			c_key,
					consumer_secret:		c_secret,
					access_token_key:		a_token_key,
					access_token_secret:	a_token_secret,
					
					api:					{
												timestamp:				null,
												remaining: 				config.api_rate_limit.oauth,
												limited:				false
											}			
				};

	if(util.isCallbackReturn(callback)) {
		return out;
	} else {
		callback(out, parent);
	}
	
}

Twitter.prototype.isRateLimited = function(authentication, callback, parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
/*
	var out = true,
		now = new Date().getTime(),
		credential = parent.getCredentials(authentication, function(result, parent) {
		
			for(var i=0; i<result.length; i++) {
			
				// TODO: move to multi-authentication model
			
				if(	parent.credentials[i].api.timestamp == null) {
					parent.credentials[i].api.timestamp = now;
					parent.refreshRateLimitInfo(i);
				}
					
				// TODO: move to parent-style timestamping (next refresh stamp)
				
				// time since first API request is greater
				// than the api limit interval (1 hour)
				// so, reset our soft-limit of API calls
				if((now - parent.credentials[i].api.timestamp) > config.api_rate_limit.interval) {
					parent.credentials[i].api =	{
													timestamp:	now,
													remaining: 	config.api_rate_limit.oauth,
													limited:	false
												};
					out = false;
				} else {
					out = (parent.credentials[i].api.remaining > 0);
				}
										console.log('-3');	
				if(util.isCallbackReturn(callback)) {
					return out;
				} else {
					callback(out, parent);
				}
			
				
			}
				
		}, this);
*/

	// DEBUG
	if(util.isCallbackReturn(callback)) {
		return false;
	} else {
		callback(false, parent);
	}

}

// returns an array of credential objects
Twitter.prototype.getCredentials = function(authentication, callback, parent) {
debugger;
	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
			
	//
	// authentication =	1. a parent credentials object
	//					2. an index of a saved credential
	//					3. false - indicating no authentication
	//					4. true	- indicating round-robin authentication
	//					5. an array of parent credentials
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
			out = [parent.credentials[parent.credentialsIndex]];
			
			if(parent.credentialsIndex++ > parent.credentials.length) {
				parent.credentialsIndex = 0;
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
		out = [parent.credentials[authentication]];
		
	}
								
	if(util.isCallbackReturn(callback)) {
		return out;
	} else {
		callback(out, parent);
	}
	
}

Twitter.prototype.authenticate = function(	consumer_key,
											consumer_secret,
											access_token_key,
											access_token_secret,
											callback,
											parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
	// TODO:	1. create a new credentials object
	//			2. verify it
	//			3. add it to the array
	
}

Twitter.prototype.refreshRateLimitInfo = function(credentialIndex, callback, parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
	// get api call status
	if(credentialIndex < 0) {
	
		for(var i=0; i<parent.credentials.length; i++) {
		
			parent.account.rate_limit_status(null, function(result, parent) {
			
				// TODO: use credentialIndex
			
				if(result.isSuccess) {
					parent.api_rate[0].remaining = result.data.remaining_hits;
				}
				
				// TODO: use callback
				
	
			}, parent);
			
		}
		
	} else {
		
		parent.account.rate_limit_status(null, function(result, parent) {
		
			// TODO: use credentialIndex
		
			if(result.isSuccess) {
				parent.api_rate[0].remaining = result.data.remaining_hits;
			}
			
			// TODO: use callback
			

		}, parent);
		
	}
		
}

Twitter.prototype.rateLimitTimeLeft = function(callback, parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
	//
	// TODO:	automatically request API call status
	//			from parent once at initialization,
	//			and then again after every N calls
	//
	//			every 100 calls?
	//

	var out = config.api_rate_limit.interval,
		now = new Date().getTime();
	
	if(parent.api_rate.timestamp != null) {
		out = (now - parent.api_rate.timestamp);
		parent.refreshRateLimitInfo();
	}
			
	if(util.isCallbackReturn(callback)) {
		return out;
	} else {
		callback(out, parent);
	}
	
}

Twitter.prototype.getRequestURL = function(url, param, callback, parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
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
										
	if(util.isCallbackReturn(callback)) {
		return out;
	} else {
		callback(out, parent);
	}
		
}

Twitter.prototype.get = function(url, param, authenticate, callback) {
	url = [ config.endpoints.parent_rest_base, '/', url , '.json' ];
	return this.fetch(url, param, authenticate, 'GET', callback, this);
}

Twitter.prototype.post = function(url, param, authenticate, callback) {
	url = [ config.endpoints.parent_rest_base, '/', url , '.json' ];
	return this.fetch(url, param, authenticate, 'POST', callback, this);
}

Twitter.prototype.request = function(url, param, authenticate, callback, parent) {
				
	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
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
		
	}
	
	this.fetch(url, param, authenticate, method, callback, parent);
	
}

Twitter.prototype.fetch = function(url, param, authenticate, method, callback, parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, parent);
	callback = result.callback;
	parent = result.parent;
	delete result;
	
	if(this.isRateLimited()) {	// return error indicating rate limit
	
		var out = new TwitterResult( false, 'rate limited' );
									
		if(util.isCallbackReturn(callback)) {
			return out;
		} else {
			callback(out, parent);
		}
		
	} else {
	
		var credential = parent.getCredentials(authenticate);
		
		// note:	result is the credentials object, 
		//			or null if unauthenticated.
	
		if(credential == null) {
			parent.api_rate.remaining.unauthenticated--;
		} else {
			// TODO: authenticate the user
			parent.api_rate.remaining.oauth--;
		}
		
		var url = parent.getRequestURL(url, param);

		// TODO:	parse the streamed data in chunks of JSON,
		//			and emit event for on 'object available'.
		
		// request the URL
		request({	method:	method,
					uri: 	url } , function(error, response, body) {
			
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
			
			if(util.isCallbackReturn(callback)) {
				return out;
			} else {
				callback(out, parent);
			}
		
		});	
		
	}
	
	return parent;
	
}

////////////
