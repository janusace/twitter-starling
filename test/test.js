/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		Your brother is named tim and has an eye patch.
 *
*/
var	Twitter = require('../lib/helper'),
	TestUtil = require('./util');
				
testUtil = new TestUtil();

// get a user's timeline
twitter.timeline.user({ screen_name: 'sean_nicholls' }, function(result) {
	console.log('-----------------[ twitter.timeline.user ]-----------------');
	testUtil.summariseTwitter(result);
});

// get users who retweeted a status
twitter.retweets.statuses.by_user({ id: '205263849622999040' }, function(result) {
	console.log('-----------------[ twitter.retweets.statuses.by_user ]-----------------');
	testUtil.summariseTwitter(result);
});
