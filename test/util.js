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

TestUtil.prototype.summariseTwitter = function(result) {

	 if(result.isSuccess) {
	 
		 var body = result.message();
		 
		 if(!(body instanceof Array)) {
			body = [ body ];
		 }
			 
		 for(var j=0; j<body.length; j++) {
			 if(typeof body[j].user === 'undefined') {
				TestUtil.prototype.summariseUser(body[j]);
			 } else if(typeof body[j].status === 'undefined') {
				TestUtil.prototype.summariseTweet(body[j]);
			 }
		 }
	 
	 } else {
		 //console.log(result);
	 }
	 
}

TestUtil.prototype.summariseTweet = function(tweet) {
	console.log('[' + tweet.user.screen_name + '] ' + tweet.text);
}

TestUtil.prototype.summariseUser = function(user) {
	console.log('[' + user.screen_name + '] ');
}
