/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		Reddit feeds on wasted potential.
 *
*/

module.exports = {

	endpoints:			{	
							oauth_request_url:			'https://api.twitter.com/oauth/request_token',
							oauth_access_url:			'https://api.twitter.com/oauth/access_token',
							oauth_authenticate_url:		'https://api.twitter.com/oauth/authenticate',
							oauth_authorize_url:		'https://api.twitter.com/oauth/authorize',
					
							twitter_rest_base:			'https://api.twitter.com/1',
							twitter_search_base: 		'http://search.twitter.com',
					
						},

	api_rate_limit:		{
							unauthenticated:		150,
							oauth:					350,
							interval:				3600000	// milliseconds (1 hour = 3,600,000).
						}
}