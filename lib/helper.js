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
// documentation sorting exactly. For 
// example: retweets are treated as 
// their own logical object.
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
// twitter object per process. I do
// not think this is ideal. although
// for now it works well.
twitter = new Twitter();
module.exports = twitter;

// timeline
Twitter.prototype.timeline = {

	public: function (param, callback) {
		return twitter.request( twitter.resources.timeline.public,
								param,
								false,
								callback);
	},
	
	home: function (param, callback) {
		return twitter.request( twitter.resources.timeline.home,
								param,
								true,
								callback);
	},
	
	user: function (param, callback) {
		return twitter.request( twitter.resources.timeline.user,
								param,
								true,
								callback);
	}

}

// statuses
Twitter.prototype.statuses = {

	create:		{
					standard:	function (param, callback) {
									return twitter.request( twitter.resources.statuses.create.standard,
											param,
											true,
											callback);
								},
							
					withMedia:	function (param, callback) {
									return twitter.request( twitter.resources.statuses.create.withMedia,
											param,
											true,
											callback);
								}
				},

	show:		function (param, callback) {
					return twitter.request( twitter.resources.statuses.show,
											param,
											true,
											callback);
				},

	destroy:	function (param, callback) {
					return twitter.request( twitter.resources.statuses.destroy,
											param,
											true,
											callback);
				}
					
}

// retweets
Twitter.prototype.retweets = {

	create:		function (param, callback) {
					return twitter.request( twitter.resources.retweets.create,
											param,
											true,
											callback);
				},
				
	show:		function (param, callback) {
					return twitter.request( twitter.resources.retweets.show,
											param,
											true,
											callback);
				},
				
	timeline:	{
					all:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.all,
											param,
											true,
											callback);
								},
								
					by_me:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.by_me,
											param,
											true,
											callback);
								},
								
					to_me:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.to_me,
											param,
											true,
											callback);
								},
								
					of_me:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.of_me,
											param,
											true,
											callback);
								},
								
					to_user:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.to_user,
											param,
											true,
											callback);
								},
								
					by_user:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.by_user,
											param,
											true,
											callback);
								},
				},

	statuses:	{
					by_user:		function (param, callback) {
										return twitter.request( twitter.resources.retweets.statuses.by_user,
												param,
												true,
												callback);
									},
								
					by_user_ids:	function (param, callback) {
										return twitter.request( twitter.resources.retweets.statuses.by_user_ids,
												param,
												true,
												callback);
									},
								
					list:			function (param, callback) {
										return twitter.request( twitter.resources.retweets.statuses.list,
												param,
												true,
												callback);
									}
				},

	destroy:	function (param, callback) {
					return twitter.request( twitter.resources.retweets.destroy,
											param,
											true,
											callback);
				}
					
}