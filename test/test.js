/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		Your brother is named tim and has an eye patch.
 *
*/
var	Twitter = require('../lib/twitter'),
	config = require('../lib/config'),
	TwitterHelper = require('../lib/helper');

var	twit = new Twitter;

console.log('------------------');

twit.request( 	twit.resources.timeline.public,
				{},
				false,
				function(result) {
					console.log('------------------');
					summariseTweets(result);
				});
	
twit.user_timeline({ screen_name: 'sean_nicholls' }, function(result) {
	console.log('------------------');
	summariseTweets(result);
});
	
	
twit.rateLimitTimeLeft(function(result) {
	console.log('time left: ' + result);
});
					
console.log('------------------');
	
console.log('OAUTH: calls left: ' + twit.api_rate.remaining.oauth);
console.log('API calls left: ' + twit.api_rate.remaining.unauthenticated);



function summariseTweets(result) {

	 if(result.isSuccess) {
	 
		 var body = result.message();
	 
		 for(var j=0; j<body.length; j++) {
			 console.log('[' + body[j].user.screen_name + '] ' + body[j].text);
		 }
	 
	 } else {
		 console.log(result);
	 }
	 
}