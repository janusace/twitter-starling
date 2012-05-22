/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		You need help.
 *
*/
var	Twitter = require('../lib/twitter');

//
// this is a helper class:
//
// use paths on your own if you like,
// but this avoids typos & helps avoid
// having to rewrite your application
// if the twitter API changes.
//
// this does not follow the API's
// documentation sorting. For example:
// retweets are treated as their own
// logical object.
//
// it is also arguably easier to read.
//
Twitter.prototype.resources =	{

	// timeline
	timeline:				{
								home:	['statuses/home_timeline', 'GET'],		
								public:	['statuses/public_timeline', 'GET'],	
								user:	['statuses/user_timeline', 'GET']
								
							},
	
	// tweets
	statuses:				{
								update:		['statuses/update', 'POST'],	
								withMedia:	['statuses/update_with_media', 'POST'],	
									
								show:		['statuses/show', 'GET'],	
								list:		['statuses', 'GET'],
								destroy:	['statuses/destroy', 'POST'],	
								
							},
							
	retweets:				{
								new:		['statuses/retweet', 'POST'],	
								show:		['statuses/show', 'GET'],
								timeline:	{
												all:	['statuses/retweets', 'GET'],
													
												by_me: 		['statuses/retweeted_by_me', 'GET'],
												to_me:		['statuses/retweeted_to_me', 'GET'],
												of_me:		['statuses/retweets_of_me', 'GET'],
	
												to_user:	['statuses/retweeted_to_user', 'GET'],
												by_user:	['statuses/retweeted_by_user', 'GET']
												
											},
								destroy:	['statuses/destroy', 'POST'],	
								
							},
							
	// ombed
	oembed:					['statuses/oembed', 'GET'],
	
	// search
	search:					['search', 'GET'],
	
	// direct messages
	direct_messages:		{
								new:		['direct_messages/new', 'POST'],	
								show:		['direct_messages/show', 'GET'],
								
								recieved: 	['direct_messages', 'GET'],
								sent:		['direct_messages/sent', 'GET'],
								
								destroy:	['direct_messages/destroy', 'POST']
								
							},	
	
	// friends & followers
	followers:				'followers',
	friends:				'friends',
	friendships_exists:		'friendships/exists',
	friendships_incoming:	'friendships/incoming',
	friendships_outgoing:	'friendships/outgoing',
	friendships_show:		'friendships/show',
	friendships_create:		'friendships/create',
	friendships_destroy:	'friendships/destroy',
	friendships_lookup:		'friendships/lookup',
	friendships_update:		'friendships/exists',
	
	// users
	users:					{
								lookup:				['users/lookup', 'GET'],
								profile_image:		['users/profile_image', 'GET'],
								search:				['users/search', 'GET'],
								show:				['users/show', 'GET'],
								contributees:		['users/contributees', 'GET'],
								contributors:		['users/contributors', 'GET'],
								
								timeline:			['statuses/user_timeline', 'GET']
							},

}

Twitter.prototype.public_timeline = function (param, callback) {

	return this.request( 	this.resources.timeline.public,
							param,
							false,
							callback);

}

Twitter.prototype.home_timeline = function (param, callback) {

	return this.request( 	this.resources.timeline.home,
							param,
							false,
							callback);

}

Twitter.prototype.user_timeline = function (param, callback) {

	return this.request( 	this.resources.timeline.user,
							param,
							false,
							callback);

}