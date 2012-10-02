#twitter-starling

Twitter REST & Streaming API client for Node.js

Still very much a work-in-progress.


[Getting Started]

install:

npm install twitter-starling

```javascript
var Twitter = require('twitter-starling');

var credential = new Twitter.LoginCredential(   'CONSUMER_KEY',
                                                'CONSUMER_SECRET',
                                                'ACCESS_TOKEN',
                                                'ACCESS_TOKEN_SECRET'   );

var authorisedTwitter = new Twitter(credential);

// sample the public timeline
	
authorisedTwitter.stream.statuses.sample({}, function(result) {
    
    if(result.isSuccess) {
    
    try {
        var tweet = JSON.parse(result.data);
        
            if(typeof tweets[j].user === 'undefined') {
                console.log('[' + user.screen_name + '] ' + postfix);
            } else if(typeof tweets[j].status === 'undefined') {
                console.log('[' + tweet.user.screen_name + '] ' + tweet.text + postfix);
            }
        
        } catch (e) {
            // best to just ignore it, eh?
        }
        
    } else {
    
        console.log("Error: " + result.message);
    
    }

});
```