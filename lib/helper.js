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
								callback,
								this);
	},
	
	home: function (param, callback) {
		return twitter.request( twitter.resources.timeline.home,
								param,
								true,
								callback,
								this);
	},
	
	user: function (param, callback) {
		return twitter.request( twitter.resources.timeline.user,
								param,
								true,
								callback,
								this);
	}

}

// statuses
Twitter.prototype.statuses = {

	create:		{
					standard:	function (param, callback) {
									return twitter.request( twitter.resources.statuses.create.standard,
															param,
															true,
															callback,
															this);
								},
							
					withMedia:	function (param, callback) {
									return twitter.request( twitter.resources.statuses.create.withMedia,
															param,
															true,
															callback,
															this);
								}
				},

	show:		function (param, callback) {
					return twitter.request( twitter.resources.statuses.show,
											param,
											true,
											callback,
											this);
				},

	destroy:	function (param, callback) {
					return twitter.request( twitter.resources.statuses.destroy,
											param,
											true,
											callback,
											this);
				}
					
}

// retweets
Twitter.prototype.retweets = {

	create:		function (param, callback) {
					return twitter.request( twitter.resources.retweets.create,
											param,
											true,
											callback,
											this);
				},
				
	show:		function (param, callback) {
					return twitter.request( twitter.resources.retweets.show,
											param,
											true,
											callback,
											this);
				},
				
	timeline:	{
					all:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.all,
															param,
															true,
															callback,
															this);
								},
								
					by_me:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.by_me,
															param,
															true,
															callback,
															this);
								},
								
					to_me:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.to_me,
															param,
															true,
															callback,
															this);
								},
								
					of_me:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.of_me,
															param,
															true,
															callback,
															this);
								},
								
					to_user:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.to_user,
															param,
															true,
															callback,
															this);
								},
								
					by_user:	function (param, callback) {
									return twitter.request( twitter.resources.retweets.timeline.by_user,
															param,
															true,
															callback,
															this);
								},
				},

	statuses:	{
					by_user:		function (param, callback) {
										return twitter.request( twitter.resources.retweets.statuses.by_user,
																param,
																true,
																callback,
																this);
									},
								
					by_user_ids:	function (param, callback) {
										return twitter.request( twitter.resources.retweets.statuses.by_user_ids,
																param,
																true,
																callback,
																this);
									},
								
					list:			function (param, callback) {
										return twitter.request( twitter.resources.retweets.statuses.list,
																param,
																true,
																callback,
																this);
									}
				},

	destroy:	function (param, callback) {
					return twitter.request( twitter.resources.retweets.destroy,
											param,
											true,
											callback,
											this);
				}
					
}

// oembed
Twitter.prototype.oembed = function (param, callback) {
								return twitter.request( twitter.resources.oembed,
														param,
														true,
														callback,
														this);
							}
// oembed
Twitter.prototype.search = function (param, callback) {
								return twitter.request( twitter.resources.search,
														param,
														true,
														callback,
														this);
							}
							
// direct messages
Twitter.prototype.direct_messages = {

	create:		function (param, callback) {
					return twitter.request( twitter.resources.direct_messages.create,
											param,
											true,
											callback,
											this);
				},
				
	show:		function (param, callback) {
					return twitter.request( twitter.resources.direct_messages.show,
											param,
											true,
											callback,
											this);
				},
				
	recieved:		function (param, callback) {
					return twitter.request( twitter.resources.direct_messages.recieved,
											param,
											true,
											callback,
											this);
				},
				
	sent:		function (param, callback) {
					return twitter.request( twitter.resources.direct_messages.sent,
											param,
											true,
											callback,
											this);
				},

	destroy:	function (param, callback) {
					return twitter.request( twitter.resources.direct_messages.destroy,
											param,
											true,
											callback,
											this);
				}
					
}

// users
Twitter.prototype.users = {

	lookup:		function (param, callback) {
					return twitter.request( twitter.resources.users.lookup,
											param,
											true,
											callback,
											this);
				},
				
	profile_image:		function (param, callback) {
					return twitter.request( twitter.resources.users.profile_image,
											param,
											true,
											callback,
											this);
				},
				
	search:		function (param, callback) {
					return twitter.request( twitter.resources.users.search,
											param,
											true,
											callback,
											this);
				},
				
	show:		function (param, callback) {
					return twitter.request( twitter.resources.users.show,
											param,
											true,
											callback,
											this);
				},

	contributees:	function (param, callback) {
					return twitter.request( twitter.resources.users.contributees,
											param,
											true,
											callback,
											this);
				},

	contributors:	function (param, callback) {
					return twitter.request( twitter.resources.users.contributors,
											param,
											true,
											callback,
											this);
				},

	timeline:	function (param, callback) {
					return twitter.request( twitter.resources.users.timeline,
											param,
											true,
											callback,
											this);
				}
					
}
						
// favourites
Twitter.prototype.favourites = {

	list:		function (param, callback) {
					return twitter.request( twitter.resources.favourites.list,
											param,
											true,
											callback,
											this);
				},
				
	create:		function (param, callback) {
					return twitter.request( twitter.resources.favourites.create,
											param,
											true,
											callback,
											this);
				},
				
	destroy:	function (param, callback) {
					return twitter.request( twitter.resources.favourites.destroy,
											param,
											true,
											callback,
											this);
				},

}

// lists
Twitter.prototype.lists = {

	list:			{
						all:		function (param, callback) {
										return twitter.request( twitter.resources.lists.list.all,
																param,
																true,
																callback,
																this);
									},
									
						statuses:	function (param, callback) {
										return twitter.request( twitter.resources.lists.list.statuses,
																param,
																true,
																callback,
																this);
									},
									
						memberships:		function (param, callback) {
										return twitter.request( twitter.resources.lists.list.memberships,
																param,
																true,
																callback,
																this);
									},
									
						users:	function (param, callback) {
										return twitter.request( twitter.resources.lists.list.users,
																param,
																true,
																callback,
																this);
									}
									
					},

	destroy:		function (param, callback) {
						return twitter.request( twitter.resources.lists.destroy,
												param,
												true,
												callback,
												this);
					},

	subscribers:	{
						list:			function (param, callback) {
											return twitter.request( twitter.resources.subscribers.list,
																	param,
																	true,
																	callback,
																	this);
										},
										
						create:			{
											one:		function (param, callback) {
															return twitter.request( twitter.resources.subscribers.create.one,
																	param,
																	true,
																	callback,
																	this);
														},
														
											many:	function (param, callback) {
															return twitter.request( twitter.resources.subscribers.create.many,
																					param,
																					true,
																					callback,
																					this);
														}
														
										},
									
						show:			function (param, callback) {
											return twitter.request( twitter.resources.subscribers.show,
																	param,
																	true,
																	callback,
																	this);
										},
										
						destroy:		function (param, callback) {
											return twitter.request( twitter.resources.subscribers.destroy,
																	param,
																	true,
																	callback,
																	this);
										}
					},
					
	members:		{
						list:			function (param, callback) {
											return twitter.request( twitter.resources.members.list,
																	param,
																	true,
																	callback,
																	this);
										},

						create:			{
											one:		function (param, callback) {
															return twitter.request( twitter.resources.members.create.one,
																					param,
																					true,
																					callback,
																					this);
														},
														
											many:	function (param, callback) {
															return twitter.request( twitter.resources.members.create.many,
																					param,
																					true,
																					callback,
																					this);
														}
														
										},
										
						destroy:		{
											many:	function (param, callback) {
														return twitter.request( twitter.resources.members.destroy.many,
																				param,
																				true,
																				callback,
																				this);
													}
														
										},
									
						create:			function (param, callback) {
											return twitter.request( twitter.resources.members.create,
																	param,
																	true,
																	callback,
																	this);
										},
									
						update:			function (param, callback) {
											return twitter.request( twitter.resources.members.update,
																	param,
																	true,
																	callback,
																	this);
										},
									
						show:			function (param, callback) {
											return twitter.request( twitter.resources.members.show,
																	param,
																	true,
																	callback,
																	this);
										},	
									
						subscriptions:	function (param, callback) {
											return twitter.request( twitter.resources.members.subscriptions,
																	param,
																	true,
																	callback,
																	this);
										}
										
					}
					
}
	
// account
Twitter.prototype.account = {

	rate_limit_status:	function (param, callback) {
							return twitter.request( twitter.resources.account.rate_limit_status,
													param,
													true,
													callback,
													this);
						},
					
	verify_credentials:	function (param, callback) {
							return twitter.request( twitter.resources.account.verify_credentials,
													param,
													true,
													callback,
													this);
						},
					
	end_session:		function (param, callback) {
							return twitter.request( twitter.resources.account.end_session,
													param,
													true,
													callback,
													this);
						},
					
	profile:			{
								update:		{
													now:				function (param, callback) {
																			return twitter.request( twitter.resources.account.profile.update.now,
																									param,
																									true,
																									callback,
																									this);
																		},
															
													background_image:	function (param, callback) {
																			return twitter.request( twitter.resources.account.profile.update.background_image,
																									param,
																									true,
																									callback,
																									this);
																		},
															
													colors:				function (param, callback) {
																			return twitter.request( twitter.resources.account.profile.update.colors,
																									param,
																									true,
																									callback,
																									this);
																		},
															
													image:				function (param, callback) {
																			return twitter.request( twitter.resources.account.profile.update.image,
																									param,
																									true,
																									callback,
																									this);
																		}
											}
						},
						
	totals:			function (param, callback) {
						return twitter.request( twitter.resources.account.totals,
												param,
												true,
												callback,
												this);
					},

	settings:		{			
						show:		function (param, callback) {
										return twitter.request( twitter.resources.settings.show,
																param,
																true,
																callback,
																this);
									},
										
						update:		function (param, callback) {
											return twitter.request( twitter.resources.settings.update,
																	param,
																	true,
																	callback,
																	this);
									}
					},
					
}

	
// notifications
Twitter.prototype.notifications = {

	follow:	function (param, callback) {
							return twitter.request( twitter.resources.notifications.follow,
													param,
													true,
													callback,
													this);
						},
					
	leave:	function (param, callback) {
							return twitter.request( twitter.resources.notifications.leave,
													param,
													true,
													callback,
													this);
						},
	
}
			