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

TestUtil.prototype.summariseTwitter = function(tweets, prefix, postfix) {

	if(!(tweets instanceof Array)) {
		tweets = [ tweets ];
	 }
	 
	 
	 if(!(prefix instanceof String) && typeof prefix !== 'string') {
		 prefix = '';
	 }
	 
	 if(!(postfix instanceof String) && typeof postfix !== 'string') {
		 postfix = '';
	 }
	 
	 for(var j=0; j<tweets.length; j++) {
		 if(typeof tweets[j].user === 'undefined') {
			TestUtil.prototype.summariseUser(tweets[j], prefix, postfix);
		 } else if(typeof tweets[j].status === 'undefined') {
			TestUtil.prototype.summariseTweet(tweets[j], prefix, postfix);
		 }
	 }
	  
}

TestUtil.prototype.summariseTweet = function(tweet, prefix, postfix) {
	console.log(prefix + '[' + tweet.user.screen_name + '] ' + tweet.text + postfix);
}

TestUtil.prototype.summariseUser = function(user, prefix, postfix) {
	console.log(prefix + '[' + user.screen_name + '] ' + postfix);
}
