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
	util = require('util');
				
var testUtil = new TestUtil(),
	twitter = new Twitter();

/*
// NOTE:	change the following to match your application settings!
// 			THE TWITTER STREAMING API WILL NOT WORK WITHOUT SUPPLYING
//			A VALID (NON-ANOYMOUS) AUTHENTICATION CREDENTIAL
//
var credential = new Twitter.LoginCredential(	"MY_CONSUMER_KEY",
												"MY_CONSUMER_SECRET",
												"MY_TOKEN",
												"MY_TOKEN_SECRET");
*/

var credential = new Twitter.LoginCredential();

var authorisedTwitter = new Twitter(credential);

/* =======================
 * =====[ REST API ] =====
 * ======================= */
/*
// get the public timeline
authorisedTwitter.timeline.public( {}, function(result, parent) {

	testUtil.printHRule();

	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(public_timeline) ');
	} else {
		testUtil.printError(result.error); 
	}
	
});

// get the users who retweeted a tweet with the specfied id
twitter.retweets.statuses.by_user({ id: '205263849622999040' }, function(result, parent) {

	testUtil.printHRule();

	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(retweeted by) ');
	} else {
		testUtil.printError(result.error); 
	}
	
});

// get a user's timeline, including retweets
authorisedTwitter.timeline.user({ 	screen_name:	'sean_nicholls',
									include_rts:	'true' },
									function(result) {

	testUtil.printHRule();
	
	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(user_timeline) ');
	} else {
		testUtil.printError(result.error); 
	}
	
});
*/
/* 
// ENABLE AT YOUR OWN RISK!
// send a tweet (this should produce an error without authentication);
authorisedTwitter.statuses.create.standard( { status:	'hello world! this is a test of the #Node.js twitter library, on #github at https://github.com/snicholls/TwitterRestClient'},
											function(result, parent) {

	testUtil.printHRule();

	console.log(result);

});
*/


/* ============================
 * =====[ STREAMING API ] =====
 * ============================ */

if(credential.isAnonymous) {
	console.log("Cannot test the Twitter streaming API without an authenticated login.");
} else {
	
	// sample the public timeline
	authorisedTwitter.stream.statuses.sample({}, function(result) {
	
		if(result.isSuccess) {
		
			try {
				var tweet = JSON.parse(result.data);
				testUtil.summariseTwitter(tweet, '(sample) ');
			} catch (e) {
				// best to just ignore it, eh?
			}
			
		} else {
			
			console.log("Error: " + result.message);
			
		}
		
	});

}

/*
// track some keywords
authorisedTwitter.stream.statuses.filter(	{ track: ["Twitter","Facebook","YouTube"] },
											function(result) {

	if(result.isSuccess) {
		
		try {
			var tweet = JSON.parse(result.data);
			testUtil.summariseTwitter(tweet, '(filter) ');
		} catch (e) {
			// best to just ignore it, eh?
		}
		
	} else {
		
		console.log(result.error.message);
		
	}
});
*/
