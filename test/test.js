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
	TestUtil = require('./util');
				
var testUtil = new TestUtil(),
	twitter = new Twitter(),
	anotherTwitter = new Twitter();

// authenticate
twitter.authenticate(	'consumer_key',
						'consumer_secret',
						'access_token_key',
						'access_token_secret' );

// get a user's timeline, including retweets
twitter.timeline.user({ screen_name:	'sean_nicholls',
						include_rts:	'true' },
						function(result) {

	printHRule();
	
	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(user_timeline) ');
	} else {
		console.log('Error: ' + result.message());
	}
	
});

// get the users who retweeted a tweet with the specfied id
twitter.retweets.statuses.by_user({ id: '205263849622999040' }, function(result, parent) {

	printHRule();

	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(retweeted by) ');
	} else {
		console.log('Error: ' + result.message());
	}
	
});

// get the public timeline
anotherTwitter.timeline.public( null, function(result, parent) {

	printHRule();

	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(public_timeline) ');
	} else {
		console.log('Error: ' + result.message());
	}
	
});

function printHRule() {

	console.log('-------------------');
	
}