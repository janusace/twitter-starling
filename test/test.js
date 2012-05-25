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
	TestUtil = require('./util'),
	sys = require('sys');
				
testUtil = new TestUtil();

var twitter = new Twitter();

// authenticate
twitter.authenticate(	'consumer_key',
						'consumer_secret',
						'access_token_key',
						'access_token_secret' );

// get a user's timeline
twitter.timeline.user({ screen_name: 'sean_nicholls' }, function(result) {

	printHRule();
	
	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message());
	} else {
		console.log('Error: ' + result.message());
	}
	
});


twitter.retweets.statuses.by_user({ id: '205263849622999040' }, function(result, parent) {

	printHRule();

	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message());
	} else {
		console.log('Error: ' + result.message());
	}
	
});


function printHRule() {

	console.log('-------------------');
	
}