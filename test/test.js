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

// NOTE: change the following to match your application settings!
var credential = new Twitter.LoginCredential(	'CmQ4jIlm1P0JlHo4cjntLQ',
												'iBwv7HuUdaoTXdNGNxzraL7qAtqjNGfZUePdGtWsunk',
												'10390782-QRfXzq1vkzUjt2eVy25qslN6XTKpE04Hd8QOjYYFl',
												'Rj8B0yqgYhi8FHgG7Ltf6zsHAmjlRYvC97Vzvbvb7Ww'	);

authorisedTwitter = new Twitter(credential);


// get the public timeline
debugger;
authorisedTwitter.timeline.public( {}, function(result, parent) {

	printHRule();

	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(public_timeline) ');
	} else {
		printError(result.error); 
	}
	
});

// get the users who retweeted a tweet with the specfied id
twitter.retweets.statuses.by_user({ id: '205263849622999040' }, function(result, parent) {

	printHRule();

	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(retweeted by) ');
	} else {
		printError(result.error); 
	}
	
});

// get a user's timeline, including retweets
authorisedTwitter.timeline.user({ 	screen_name:	'sean_nicholls',
									include_rts:	'true' },
									function(result) {

	printHRule();
	
	if(result.isSuccess) {
		testUtil.summariseTwitter(result.message(), '(user_timeline) ');
	} else {
		printError(result.error); 
	}
	
});

/*
// send a tweet (this should produce an error without authentication);
authorisedTwitter.statuses.create.standard( {status:	'hello world! this is a test of the Node.js twitter library on @github https://github.com/snicholls/TwitterRestClient'}, function(result, parent) {

	printHRule();

	console.log(result);

});
*/

function printHRule() {
	console.log('-------------------');
}

function printError(error) {
	console.log('Error (' + error.code + '): ' + error.message);
}