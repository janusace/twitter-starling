#twitter-starling

Twitter REST & Streaming API client for Node.js

Still very much a work-in-progress.


## Getting Started

Install twitter-starling:
```bash
npm install twitter-starling
```

Include the twitter library:
```javascript
var Twitter = require('twitter-starling');
```

[ **optional** ] Create an authentication credential :
```javascript
var credential = new Twitter.LoginCredential(   'CONSUMER_KEY',
                                                'CONSUMER_SECRET',
                                                'ACCESS_TOKEN',
                                                'ACCESS_TOKEN_SECRET'   );
```

Create the Twitter client:
```javascript
var authorisedTwitter = new Twitter(credential);
```

## Examples

Query the Twitter REST API:

```javascript
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
```

Query the Twitter Streaming API:

```javascript
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
## More examples

From root source folder you can try out some examples in the ***test*** directory:

```bash
node test
```

this will execute some basic REST and Streaming functionality and is a good starting point if the above examples aren't detailed enough.


## Going Forward

### Twitter-Starling is still in active development. 

Most of the functionality is there, but some testing is lacking (there are no unit tests, oh dear!) so you can continue to use it but it would not be advisable to do so on production systems. not yet at least.

#### Where do I get the source code?
Check the GitHub repo here: https://github.com/seannicholls/twitter-starling

#### I want to contribute 
Contact me (Sean Nicholls) on [GitHub](https://github.com/seannicholls) 

The biggest need right now is full documentation of the library. So if you're documentally inclined, get in touch!

#### License
MIT License - fork, modify and use however you want.
