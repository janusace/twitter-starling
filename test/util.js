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
		if(typeof tweets[j].delete !== 'undefined') {	// delete a tweet
			//
			// do nothing
			//
			// Twitter wants us to delete a tweet,
			// but if we're outputting to console, 
			// that's not possible.
			//
		} else if(typeof tweets[j].user === 'undefined') {
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

TestUtil.prototype.printHRule = function() {
	console.log('-------------------');
}

TestUtil.prototype.printError = function(error) {
	console.log('Error (' + error.code + '): ' + error.message);
}
