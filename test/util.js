/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		Your brother is named tim and has an eye patch.
 *
*/

function TestUtil() {}
module.exports = TestUtil;

TestUtil.prototype.summariseTwitter = function(tweets) {

	if(!(tweets instanceof Array)) {
		tweets = [ tweets ];
	 }
		 
	 for(var j=0; j<tweets.length; j++) {
		 if(typeof tweets[j].user === 'undefined') {
			TestUtil.prototype.summariseUser(tweets[j]);
		 } else if(typeof tweets[j].status === 'undefined') {
			TestUtil.prototype.summariseTweet(tweets[j]);
		 }
	 }
	  
}

TestUtil.prototype.summariseTweet = function(tweet) {
	console.log('[' + tweet.user.screen_name + '] ' + tweet.text);
}

TestUtil.prototype.summariseUser = function(user) {
	console.log('[' + user.screen_name + '] ');
}
