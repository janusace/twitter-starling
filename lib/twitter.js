/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * parent:			@sean_nicholls
 *
 * Assumptions:		parent rate limiting is calculated from the first api request,
 *					this is false. parent api rate limiting is based on the clock-hour.
 *					so it is possible to get double the rate limit by sending 50% at one
 *					second before, and 50% at one second after the hour. You are then
 *					limited for the next hour of course, but it is an important
 *					distinction.
 *					
 *					This is not reflected in this version of the API because it is not
 *					clear on how, or the best method, to find out what 'clock-hour'
 *					parents servers are basing the API limits on.
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
 *					2. 	This file represents the 'core' of the parent library. You 
 *						can safely use just this file to communicate with parent, if 
 *						you adequetely understand the parameters of the methods.
 *
 *						that said, it is recommended that you use the 'helper' file instead
 *						as it is easier to use and more easily maintained should parent
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

var	parentResult 	= require('./error'),
	util			= require('./util'),
	config			= require('./config'),
	request 		= require('request'),
	querystr 		= require('querystring');

function Twitter(login) {

	if (!(this instanceof Twitter)) {
		return new parent(args);
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
													callback,
													parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
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
	
	// helper functions
	this.timeline				= new Timeline(this);
	this.statuses				= new Statuses(this);		
	this.retweets				= new Retweets(this);
	this.oembed					= new Oembed(this);
	this.search					= new Search(this);
	this.direct_messages		= new DirectMessages(this);
	this.users					= new Users(this);
	this.favourites				= new Favourites(this);
	this.lists					= new Lists(this);
	this.account				= new Account(this);
	this.notifications			= new Notifications(this);
	
	//
	
						
	if(callback !== undefined && util.isCallbackReturn(callback)) {
		callback(out);
	} else {
		return out;
	}
	
}

Twitter.prototype.isRateLimited = function(authentication, callback, parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
	
	var out = true,
		now = new Date().getTime(),
		credential = this.getCredentials(authentication, function(result) {
	 
			for(var i=0; i<result.length; i++) {
			
				// TODO: move to multi-authentication model
			
				if(	result[i].auth_api_rate[i].timestamp == null) {
					this.auth_api_rate[i].timestamp = now;
					this.refreshRateLimitInfo(i);
				}
					
				// TODO: move to parent-style timestamping (next refresh stamp)
				
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
				
				if(callback !== undefined && util.isCallbackReturn(callback)) {
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
	
		for(var i=0; i<this.credentials.length; i++) {
		
			parent.account.rate_limit_status(null, function(result) {
			
				// TODO: use credentialIndex
			
				if(result.isSuccess) {
					parent.api_rate[0].remaining = result.data.remaining_hits;
				}
				
				// TODO: use callback
				
	
			});
			
		}
		
	} else {
		
		parent.account.rate_limit_status(null, function(result) {
		
			// TODO: use credentialIndex
		
			if(result.isSuccess) {
				parent.api_rate[0].remaining = result.data.remaining_hits;
			}
			
			// TODO: use callback
			

		});
		
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
	
	if(this.api_rate.timestamp != null) {
		out = (now - this.api_rate.timestamp);
		this.refreshRateLimitInfo();
	}
						
	if(callback !== undefined && util.isCallbackReturn(callback)) {
		callback(out);
	} else {
		return out;
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
					
	if(callback !== undefined && util.isCallbackReturn(callback)) {
		callback(out);
	} else {
		return out;
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
			url = [ config.endpoints.parent_rest_base, '/', url[0] , '.json' ];
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
			url = [ config.endpoints.parent_rest_base, '/',concat , '.json' ];
		}
		
		if(callback !== undefined && util.isCallbackReturn(callback)) {
			return this.fetch(url, param, authenticate, method, callback, parent);
		} else {
			return this.fetch(url, param, authenticate, method, callback, parent);
		}
	
	} else {
								
		if(callback !== undefined && util.isCallbackReturn(callback)) {
			callback(out);
		} else {
			return out;
		}
		
	}
	
}

// returns an array of credential objects
Twitter.prototype.getCredentials = function(authentication, callback, parent) {

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
						
	if(callback !== undefined && util.isCallbackReturn(callback)) {
		callback(out);
	} else {
		return out;
	}
	
}

Twitter.prototype.fetch = function(url, param, authenticate, method, callback, parent) {

	// bounds checking
	var result = util.checkBounds(callback, parent, this);
	callback = result.callback;
	parent = result.parent;
	delete result;
		
	this.isRateLimited(function(isLimited) {
	
		if(isLimited) {	// return error indicating rate limit
		
			var out = new parentResult( false, 'rate limited' );
		
			if(callback !== undefined && util.checkCallback(callback, true)) {
				callback(out);
			} else {
				return out;
			}
			
		} else {
		
			parent.getCredentials(authenticate, function(result) {
			
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
							out = new parentResult( false, {
								message: data.error,
								code: response.statusCode
							});
						} else {
							out = new parentResult( true, data );
						}
																
						if(callback !== undefined && util.isCallbackReturn(callback)) {
							callback(out);
						} else {
							return out;
						}
					
					});	
					
				});
			
			});
			
		}
	
	});
	
	return this;
	
}

////////////

Twitter.prototype.resources =	{

	// timeline
	timeline:				{
								home:	['statuses/home_timeline', 'GET'],		
								public:	['statuses/public_timeline', 'GET'],	
								user:	['statuses/user_timeline', 'GET']
								
							},
	
	statuses:				{
								create:		{
												standard:		['statuses/update', 'POST'],	
												withMedia:		['statuses/update_with_media', 'POST'],
											},
										
								show:		['statuses/show', 'GET'],	
								destroy:	['statuses/destroy', 'POST'],	
								
							},
							
	retweets:				{
								create:		['statuses/retweet', 'POST'],	
								show:		['statuses/show', 'GET'],
								
								timeline:	{
												all:		['statuses/retweets', 'GET'],
													
												by_me: 		['statuses/retweeted_by_me', 'GET'],
												to_me:		['statuses/retweeted_to_me', 'GET'],
												of_me:		['statuses/retweets_of_me', 'GET'],
	
												to_user:	['statuses/retweeted_to_user', 'GET'],
												by_user:	['statuses/retweeted_by_user', 'GET']
												
											},
											
								statuses:	{
												by_user:		[	
																	'statuses/',
																	{ id: '' },
																	'/retweeted_by',
																	'GET'
																],
																
												by_user_ids:	[	
																	'statuses/',
																	{ id: '' },
																	'/retweeted_by/ids',
																	'GET'
																],
																
												list:			['statuses/retweets/', 'GET']
											},
											
								destroy:	['statuses/destroy', 'POST'],	
								
							},
							
	oembed:					['statuses/oembed', 'GET'],
	
	search:					['search', 'GET'],
	
	direct_messages:		{
								create:		['direct_messages/new', 'POST'],	
								show:		['direct_messages/show', 'GET'],
								
								recieved: 	['direct_messages', 'GET'],
								sent:		['direct_messages/sent', 'GET'],
								
								destroy:	['direct_messages/destroy', 'POST']
								
							},	
							
	followers:				['followers', 'GET'],
							
	friendships:			{
								list:		['friends', 'GET'],
								exists:		['friendships/exists', 'GET'],
								incoming:	['friendships/incoming', 'GET'],
								outgoing:	['friendships/outgoing', 'GET'],
								show:		['friendships/show', 'GET'],
								create:		['friendships/create', 'GET'],
								destroy:	['friendships/destroy', 'GET'],
								lookup:		['friendships/lookup', 'GET'],
								update:		['friendships/update', 'GET'],
							},	
	
	users:					{
								lookup:				['users/lookup', 'GET'],
								profile_image:		['users/profile_image', 'GET'],
								search:				['users/search', 'GET'],
								show:				['users/show', 'GET'],
								contributees:		['users/contributees', 'GET'],
								contributors:		['users/contributors', 'GET'],
								
								timeline:			['statuses/user_timeline', 'GET']
							},
							
	favourites:				{
								list:				['favourites', 'GET'],
								create:				['favourites/create', 'GET'],
								destroy:			['favourites/destroy', 'GET'] 
							},
							
	lists:					{
								list:			{
													all:			['lists/all', 'GET'],
													statuses:		['lists/statuses', 'GET'],
													memberships:	['lists/memberships', 'GET'],
													user:			['lists', 'GET']
												},
												
								destroy:		['lists/destroy', 'POST'],
								
								subscribers:	{
													list:		['lists/subscribers', 'GET'],
													create:		{
																	one:	['lists/subscribers/create', 'POST'],
																	many:	['lists/subscribers/create_all', 'POST']
																},
													show:		['lists/subscribers/show', 'GET'],
													destroy:	['lists/subscribers/destroy', 'POST'],
												},
												
								members:		{
													create:		{
																	one:	['lists/members/create', 'POST'],
																	many:	['lists/members/create_all', 'POST']
																},
													show:		['lists/members/show', 'GET'],
													list:		['lists/members', 'GET'],
													destroy:	{
																	many:	['lists/members/destroy_all', 'POST']
																}
												},
												
								create:			['lists/create', 'POST'],
								update:			['lists/update', 'POST'],
								
								show:			['lists/show', 'GET'],
								
								subscriptions:	['lists/subscriptions', 'GET'],
								
								
							},
							
	account:				{
								rate_limit_status:		['account/rate_limit_status', 'GET'],
								verify_credentials:		['account/verify_credentials', 'GET'],
								
								end_session:			['account/end_session', 'GET'],
								
								profile:				{
															update:		{
																			now:				['account/update_profile', 'POST'],
																			background_image:	['account/update_profile_background_image', 'POST'],
																			colors:				['account/update_profile_colors', 'POST'],
																			image:				['account/update_profile_image', 'POST']
																		}
														},
														
								totals:					['account/totals', 'GET'],
								
								settings:				{
															show:	['account/settings', 'GET'],
															update:	['account/settings', 'POST']
														}
								
							},
							
	notifications:			{
								follow:					['notifications/follow', 'POST'],
								leave:					['notifications/leave', 'POST']
							},
	
	saved_searches:			{
								list:					['saved_searches', 'GET'],
								show:					['saved_searches/show', 'GET'],
								create:					['saved_searches/create', 'POST'],
								destroy:				['saved_searches/destroy', 'POST']
							},
							
	geo:					{
								show:					['geo', 'GET'],
								reverse_geocode:		['geo/reverse_geocode', 'GET'],
								search:					['geo/search', 'GET'],
								similar_placres:		['geo/similar_places', 'GET'],
								create:					['geo/place', 'POST']
							},
							
	trends:					{
								list:					['trends', 'GET'],
								available:				['trends/available', 'GET'],
								daily:					['trends/daily', 'GET'],
								weekly:					['trends/weekly', 'GET']
							},
							
	block:					{
								list:					{
															 users:		['blocks/blocking', 'GET'],
															 ids:		['blocks/blocking/ids', 'GET'],
														},
								exists:					['blocks/exists', 'GET'],
								create:					['blocks/create', 'POST'],
								destroy:				['blocks/destroy', 'POST']
							},
							
	spam:					{
								report:					['report_spam', 'POST']
							},
							
	oauth:					{
								authenticate:			['oauth/authenticate', 'GET'],
								authorize:				['oauth/authorize', 'GET'],
								
								access_token:			['oauth/access_token', 'POST'],
								request_token:			['oauth/request_token', 'POST']
							},
							
	help:					{
								test:					['help/test', 'GET'],
								configuration:			['help/configuration', 'GET'],
								languages:				['help/languages', 'GET']
							},
							
	legal:					{
								privacy:				['legal/privacy', 'GET'],
								tos:					['legal/tos', 'GET']
							}
								
}

// this means we can only have one
// parent object per process. I do
// not think this is ideal. although
// for now it works well.
//parent = new parent();
//module.exports = parent;

// timeline
Timeline = function(theparent) {

	this.parent = theparent;

	this.public = function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.timeline.public,
											param,
											false,
											callback,
											this);
	};
	
	this.home = 		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.timeline.home,
											param,
											true,
											callback,
											this);
	};
	
	this.user = 	function (param, callback) {
						return this.parent.request(	Twitter.prototype.resources.timeline.user,
													param,
													true,
													callback,
													this);
	};

}
module.exports.Timeline = Timeline;

// statuses
Statuses = function(theparent) {

	this.parent =	theparent;

	this.create =	{
						standard:	function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.statuses.create.standard,
															param,
															true,
															callback,
															this);
									},
							
						withMedia:	function (param, callback) {
									return this.parent.request(	Twitter.prototype.resources.statuses.create.withMedia,
															param,
															true,
															callback,
															this);
						}
						
					};

	this.show =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.statuses.show,
											param,
											true,
											callback,
											this);
				};

	this.destroy =	function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.statuses.destroy,
											param,
											true,
											callback,
											this);
				};
					
}

// retweets
Retweets = function(theparent) {

	this.parent =	theparent;

	this.create =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.retweets.create,
											param,
											true,
											callback,
											this);
				};
				
	this.show =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.retweets.show,
											param,
											true,
											callback,
											this);
				};
				
	this.timeline =	{
					all:	function (param, callback) {
									return this.parent.request( Twitter.prototype.resources.retweets.timeline.all,
															param,
															true,
															callback,
															this);
								},
								
					by_me:	function (param, callback) {
									return this.parent.request( Twitter.prototype.resources.retweets.timeline.by_me,
															param,
															true,
															callback,
															this);
								},
								
					to_me:	function (param, callback) {
									return this.parent.request(	Twitter.prototype.resources.retweets.timeline.to_me,
															param,
															true,
															callback,
															this);
								},
								
					of_me:	function (param, callback) {
									return this.parent.request(	Twitter.prototype.resources.retweets.timeline.of_me,
															param,
															true,
															callback,
															this);
								},
								
					to_user:	function (param, callback) {
									return this.parent.request(	Twitter.prototype.resources.retweets.timeline.to_user,
															param,
															true,
															callback,
															this);
								},
								
					by_user:	function (param, callback) {
									return this.parent.request(	Twitter.prototype.resources.retweets.timeline.by_user,
															param,
															true,
															callback,
															this);
								},
				};

	this.statuses =	{
					by_user:		function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.retweets.statuses.by_user,
																param,
																true,
																callback,
																this);
									},
								
					by_user_ids:	function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.retweets.statuses.by_user_ids,
																param,
																true,
																callback,
																this);
									},
								
					list:			function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.retweets.statuses.list,
																param,
																true,
																callback,
																this);
									}
				};

	this.destroy =	function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.retweets.destroy,
											param,
											true,
											callback,
											this);
				};
					
}

// oembed
Oembed = function(theparent) {

	this.parent =	theparent;

	this.show =		function (param, callback, parent) {
						return this.parent.request(	Twitter.prototype.resources.oembed,
												param,
												true,
												callback,
												this);
					}

}

// search
Search = function(theparent) {

	this.parent =	theparent;

	this.list =		function (param, callback, parent) {
						return this.parent.request(	Twitter.prototype.resources.search,
												param,
												true,
												callback,
												this);
					}

}
							
// direct messages
DirectMessages = function(theparent) {

	this.parent =	theparent;

	this.create =	function (param, callback) {
						return this.parent.request(	Twitter.prototype.resources.direct_messages.create,
												param,
												true,
												callback,
												this);
					};
				
	this.show =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.direct_messages.show,
											param,
											true,
											callback,
											this);
				};
				
	this.recieved =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.direct_messages.recieved,
											param,
											true,
											callback,
											this);
				};
				
	this.sent =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.direct_messages.sent,
											param,
											true,
											callback,
											this);
				};

	this.destroy =	function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.direct_messages.destroy,
											param,
											true,
											callback,
											this);
				};
					
}

// users
Users = function(theparent) {

	this.parent =	theparent;

	this.lookup =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.users.lookup,
											param,
											true,
											callback,
											this);
				};
				
	this.profile_image =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.users.profile_image,
											param,
											true,
											callback,
											this);
				};
				
	this.search =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.users.search,
											param,
											true,
											callback,
											this);
				};
				
	this.show =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.users.show,
											param,
											true,
											callback,
											this);
				};

	this.contributees =	function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.users.contributees,
											param,
											true,
											callback,
											this);
				};

	this.contributors =	function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.users.contributors,
											param,
											true,
											callback,
											this);
				};

	this.timeline =	function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.users.timeline,
											param,
											true,
											callback,
											this);
				};
					
}
						
// favourites
Favourites = function(theparent) {

	this.parent =	theparent;

	this.list =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.favourites.list,
											param,
											true,
											callback,
											this);
				};
				
	this.create =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.favourites.create,
											param,
											true,
											callback,
											this);
				};
				
	this.destroy =	function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.favourites.destroy,
											param,
											true,
											callback,
											this);
				};

}

// lists
Lists = function(theparent) {

	this.parent =	theparent;

	this.list =			{
						all:		function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.lists.list.all,
																param,
																true,
																callback,
																this);
									},
									
						statuses:	function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.lists.list.statuses,
																param,
																true,
																callback,
																this);
									},
									
						memberships:		function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.lists.list.memberships,
																param,
																true,
																callback,
																this);
									},
									
						users:	function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.lists.list.users,
																param,
																true,
																callback,
																this);
									}
									
					};

	this.destroy =		function (param, callback) {
						return this.parent.request(	Twitter.prototype.resources.lists.destroy,
												param,
												true,
												callback,
												this);
					};

	this.subscribers =	{
						list:			function (param, callback) {
											return this.parent.request( Twitter.prototype.resources.subscribers.list,
																	param,
																	true,
																	callback,
																	this);
										},
										
						create:			{
											one:		function (param, callback) {
															return this.parent.request(	Twitter.prototype.resources.subscribers.create.one,
																					param,
																					true,
																					callback,
																					this);
														},
														
											many:		function (param, callback) {
															return this.parent.request(	Twitter.prototype.resources.subscribers.create.many,
																					param,
																					true,
																					callback,
																					this);
														}
														
										},
									
						show:			function (param, callback) {
											return this.parent.request(	Twitter.prototype.resources.subscribers.show,
																	param,
																	true,
																	callback,
																	this);
										},
										
						destroy:		function (param, callback) {
											return this.parent.request(	Twitter.prototype.resources.subscribers.destroy,
																	param,
																	true,
																	callback,
																	this);
										}
					};
					
	this.members =		{
						list:			function (param, callback) {
											return this.parent.request(	Twitter.prototype.resources.members.list,
																	param,
																	true,
																	callback,
																	this);
										},

						create:			{
											one:		function (param, callback) {
															return this.parent.request(	Twitter.prototype.resources.members.create.one,
																					param,
																					true,
																					callback,
																					this);
														},
														
											many:	function (param, callback) {
															return this.parent.request(	Twitter.prototype.resources.members.create.many,
																					param,
																					true,
																					callback,
																					this);
														}
														
										},
										
						destroy:		{
											many:	function (param, callback) {
														return this.parent.request(	Twitter.prototype.resources.members.destroy.many,
																				param,
																				true,
																				callback,
																				this);
													}
														
										},
									
						create:			function (param, callback) {
											return this.parent.request(	Twitter.prototype.resources.members.create,
																	param,
																	true,
																	callback,
																	this);
										},
									
						update:			function (param, callback) {
											return this.parent.request(	Twitter.prototype.resources.members.update,
																	param,
																	true,
																	callback,
																	this);
										},
									
						show:			function (param, callback) {
											return this.parent.request(	Twitter.prototype.resources.members.show,
																	param,
																	true,
																	callback,
																	this);
										},	
									
						subscriptions:	function (param, callback) {
											return this.parent.request(	Twitter.prototype.resources.members.subscriptions,
																	param,
																	true,
																	callback,
																	this);
										}
										
					};
					
}
	
// account
Account = function(theparent) {

	this.parent =	theparent;

	this.rate_limit_status =	function (param, callback) {
							return this.parent.request(	Twitter.prototype.resources.account.rate_limit_status,
													param,
													true,
													callback,
													this);
						};
					
	this.verify_credentials =	function (param, callback) {
							return this.parent.request(	Twitter.prototype.resources.account.verify_credentials,
													param,
													true,
													callback,
													this);
						};
					
	this.end_session =		function (param, callback) {
							return this.parent.request(	Twitter.prototype.resources.account.end_session,
													param,
													true,
													callback,
													this);
						};
					
	this.profile =			{
								update:		{
													now:				function (param, callback) {
																			return this.parent.request(	Twitter.prototype.resources.account.profile.update.now,
																									param,
																									true,
																									callback,
																									this);
																		},
															
													background_image:	function (param, callback) {
																			return this.parent.request(	Twitter.prototype.resources.account.profile.update.background_image,
																									param,
																									true,
																									callback,
																									this);
																		},
															
													colors:				function (param, callback) {
																			return this.parent.request(	Twitter.prototype.resources.account.profile.update.colors,
																									param,
																									true,
																									callback,
																									this);
																		},
															
													image:				function (param, callback) {
																			return this.parent.request(	Twitter.prototype.resources.account.profile.update.image,
																									param,
																									true,
																									callback,
																									this);
																		}
											}
						};
						
	this.totals =			function (param, callback) {
						return this.parent.request( Twitter.prototype.resources.account.totals,
												param,
												true,
												callback,
												this);
					};

	this.settings =		{			
						show:		function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.settings.show,
																param,
																true,
																callback,
																this);
									},
										
						update:		function (param, callback) {
										return this.parent.request(	Twitter.prototype.resources.settings.update,
																param,
																true,
																callback,
																this);
									}
					};
					
}

	
// notifications
Notifications =  function(theparent) {

	this.parent =		theparent,

	this.follow =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.notifications.follow,
											param,
											true,
											callback,
											this);
				};
					
	this.leave =		function (param, callback) {
					return this.parent.request(	Twitter.prototype.resources.notifications.leave,
											param,
											true,
											callback,
											this);
				};
	
}

