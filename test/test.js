/*
 * Author:          Sean Nicholls
 * Website:         http://www.seannicholls.com
 * github:          https://github.com/snicholls
 * Twitter:         @sean_nicholls
 *
 * Assumptions:     Your brother is named tim and has an eye patch.
 *
*/
var Twitter = require('../lib/twitter'),
    util = require('util');

//  
// The twitter object we're going to use
//          
var twitter = new Twitter();

//
// Some handy utilities for working with twitter data
//
var util = new Twitter.util();

// NOTE:    change the following to match your application settings!
//          THE TWITTER STREAMING API WILL NOT WORK WITHOUT SUPPLYING
//          A VALID (NON-ANOYMOUS) AUTHENTICATION CREDENTIAL
//
/*
var credential = new Twitter.LoginCredential(   'CONSUMER_KEY',
                                                'CONSUMER_SECRET',
                                                'ACCESS_TOKEN',
                                                'ACCESS_TOKEN_SECRET'   );
*/
var credential = new Twitter.LoginCredential();

var authorisedTwitter = new Twitter(credential);

/* =======================
 * =====[ REST API ] =====
 * ======================= */
/*
// get the public timeline
authorisedTwitter.timeline.public( {}, function(result, parent) {
    
    if(result.isSuccess) {
        var tweets = result.message();
        for(var i=0; i<tweets.length; i++) {
            console.log(util.summariseTwitter(tweets[i], '(public_timeline) '));
        }
    } else {
        console.log("Error: " + result.message); 
    }
    
    console.log('---------------------------');
    
});
*/

// get the users who retweeted a tweet with the specfied id
twitter.retweets.statuses.by_user({ id: '205263849622999040' }, function(result, parent) {

    if(result.isSuccess) {
        var tweets = result.message();
        for(var i=0; i<tweets.length; i++) {
            console.log(util.summariseTwitter(tweets[i], '(retweets_by) '));
        }
    } else {
        console.log("Error: " + result.message()); 
    }
    
    console.log('---------------------------');
    
});

// get a user's timeline, including retweets
authorisedTwitter.timeline.user({   screen_name:    'BarackObama',
                                    include_rts:    'false' },
                                    function(result) {

    if(result.isSuccess) {
        var tweets = result.message();
        for(var i=0; i<tweets.length; i++) {
            console.log(util.summariseTwitter(tweets[i], '(user_timeline) '));
        }
    } else {
        console.log("Error: " + result.message()); 
    }
    
    console.log('---------------------------');
    
});

/* 
// ENABLE AT YOUR OWN RISK!
// send a tweet (this should produce an error without authentication);
authorisedTwitter.statuses.create.standard( { status:   'hello world! this is a test of the #Node.js twitter library, on #github at https://github.com/snicholls/TwitterRestClient'},
                                            function(result, parent) {

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
                console.log(util.summariseTwitter(tweet, '(sample) '));
            } catch (e) {
                // best to just ignore it, eh?
                console.log(e);
            }
            
        } else {
            
            console.log("Error: " + result.message);
            
        }
        
    });
    
    /*
    // track some keywords
    authorisedTwitter.stream.statuses.filter(   { track: ["Twitter","Facebook","YouTube"] },
                                                function(result) {
    
        if(result.isSuccess) {
            
            try {
                var tweet = JSON.parse(result.data);
                console.log(util.summariseTwitter(tweet, '(filter) '));
            } catch (e) {
                // best to just ignore it, eh?
            }
            
        } else {
            
            console.log(result.error.message);
            
        }
    });
    */
}
