/*
 * Author:          Sean Nicholls
 * Website:         http://www.seannicholls.com
 * github:          https://github.com/snicholls
 * parent:          @sean_nicholls
 *
 * Assumptions:     Twitter rate limiting is calculated from the first api request,
 *                  this is false. Twitter api rate limiting is based on the clock-hour.
 *                  so it is possible to get double the rate limit by sending 50% at one
 *                  second before, and 50% at one second after the hour. You are then
 *                  limited for the next hour of course, but it is an important
 *                  distinction.
 *                  
 *                  This is not reflected in this version of the API because it is not
 *                  clear on how, or the best method, to find out what 'clock-hour'
 *                  Twitters servers are basing the API limits on.
 *                  
 *                  So until that becomes known, the soft limit will be how we determine
 *                  how many API requests we have left... it's an edge case and won't
 *                  likely affect most applications.
 *
 *                  We will also frequently ping the Twitter server for an update on what
 *                  the current API status is like. This is currently done at some 
 *                  arbitrary intervals:
 *
 *                  1.  upon instantiation of the Twitter object. It may become necessary
 *                      at some stage to make this optional.                    
 *
 *                  2.  every 50 API requests.
 *
 *
 *
 * Notes:           1.  Uses a multi-authentication model, whereby you can supply multiple
 *                      credentials and specify which to use for each query, or use round-
 *                      robin.
 *                      
 *                      This comes into play for servers which would otherwise bump up
 *                      against API limits etc.
 *                  
 *                  3.  The goal is to eventually make this a SAX-like, streaming library
 *                      whereby events are fired for each object that is parsed, while it
 *                      is parsed rather than downloading the data, parsing it and
 *                      returning an array of results. Although both methdologies will be
 *                      available.
 *                  
 *                  4.  some sort of minimal built-in caching support would be nice.
 *                  
 *                  5.  no tests have yet been made on the efficacy of this methodology,
 *                      however optimisations would be nice - including, if it helps, 
 *                      spawning child processes for http requests.
 *                      
 *
 */

var TwitterResult   = require('./error'),
    TwitterUtil     = require('./util'),
    config          = require('./config'),
    request         = require('request'),
    querystr        = require('querystring'),
    oauth           = require('oauth').OAuth;

var util = new TwitterUtil();

function Twitter(login) {

    if (!(this instanceof Twitter)) {
        return new Twitter(login);
    }
    
    //
    // helper objects
    //
    this.timeline               = new TwitterHelper.prototype.Timeline(this);
    this.statuses               = new TwitterHelper.prototype.Statuses(this);       
    this.retweets               = new TwitterHelper.prototype.Retweets(this);
    this.oembed                 = new TwitterHelper.prototype.Oembed(this);
    this.search                 = new TwitterHelper.prototype.Search(this);
    this.direct_messages        = new TwitterHelper.prototype.DirectMessages(this);
    this.users                  = new TwitterHelper.prototype.Users(this);
    this.favourites             = new TwitterHelper.prototype.Favourites(this);
    this.lists                  = new TwitterHelper.prototype.Lists(this);
    this.account                = new TwitterHelper.prototype.Account(this);
    this.notifications          = new TwitterHelper.prototype.Notifications(this);
    this.saved_searches         = new TwitterHelper.prototype.SavedSearches(this);
    this.geo                    = new TwitterHelper.prototype.Geo(this);
    this.trends                 = new TwitterHelper.prototype.Trends(this);
    this.block                  = new TwitterHelper.prototype.Block(this);
    this.spam                   = new TwitterHelper.prototype.Spam(this);
    this.help                   = new TwitterHelper.prototype.Help(this);
    this.legal                  = new TwitterHelper.prototype.Legal(this);
    
    this.stream                 = new TwitterHelper.prototype.Stream(this);
    //
    //
    //
    
    // login credentials
    this.credentialIndex        = 0;                                // used for round-robin request signing
    this.guest_credential       = new LoginCredential(this);        // create one unauthenticated login credential
    this.credentials            = [];
    
    if(!util.isUndefined(login)) {
        if(util.isArray(login)) {
            this.credentials = login;
        } else if(util.isObject(login)) {
            this.credentials = [ login ];
        }
    }
    
    this.nextLoginCredential    =   function() {
                                        if(this.credentials.length > 0) {
                                        
                                            this.credentialIndex++;
                                            if(this.credentialIndex >= this.credentials.length) {
                                                this.credentialIndex = 0;
                                            }
                                            
                                            // if next credential index is rate limited,
                                            // step through them all until one is found that
                                            // isn't. If none are found, return null
                                            
                                            if(this.credentials[this.credentialIndex].isRateLimited) {
                                                for(var i=this.credentialIndex+1; i<this.credentials.length; i++) {
                                                    if(!this.credentials[this.credentialIndex].isRateLimited) {
                                                        return this.credentials[i];
                                                    }
                                                }
                                                for(var i=0; i<this.credentialIndex; i++) {
                                                    if(!this.credentials[this.credentialIndex].isRateLimited) {
                                                        return this.credentials[i];
                                                    }
                                                }
                                                return null;
                                            }
                                            
                                            return this.credentials[this.credentialIndex];
                                        } else {
                                            return this.guest_credential;
                                        }
                                    };
    
}
module.exports  = Twitter;
module.exports.util  = TwitterUtil;

//
// A LoginCredential represents an *authorised* user's login
// details and API rate limit status. It contains everything
// relevant about the authentication of that user.
//
//
//  Arguments:      1.  LoginCredential()
//                          ->  create Unauthorised credential object, without specifying the parent Twitter object
//
//                  2.  LoginCredential(function())
//                          ->  create Unauthorised credential object, without specifying the parent Twitter object,
//                              with a callback.
//
//                  3.  LoginCredential(Twitter)
//                          ->  create Unauthorised credential object, and specify the parent Twitter object,
//                              without a callback.
//
//                  4.  LoginCredential(function(), Twitter)
//                          ->  create Unauthorised credential object, with a parent Twitter object and a callback.
//
//                  5.  LoginCredential(    'CONSUMER_KEY',
//                                          'CONSUMER_SECRET',
//                                          'ACCESS_TOKEN_KEY',
//                                          'ACCESS_TOKEN_SECRET',
//                                          function(), Twitter)
//                          ->  create an Authorised credential object, with a parent Twitter object and a callback.
//
function LoginCredential (  c_key,
                            c_secret,
                            a_token_key,
                            a_token_secret,
                            callback,
                            theparent ) {

    this.isAnonymous =  true;                               // are we using OAuth, or is it just an unauthorised client?    
    
    if(util.isUndefined(c_key)) {                           // c_key is not defined, so presume no arguments specified
        
        theparent = null;
        c_secret = null;
        a_token_key = null;
        a_token_secret = null;
        callback = null;
        theparent = null;
        
    } else {
        
        if(util.isCallbackType(c_key)) {                    // c_key is a function (or boolean value of false), so presume it to be a callback
        
            callback = c_key;
            c_key = null;
            a_token_key = null;
            a_token_secret = null;
            
            if(util.isObject(c_secret)) {                   // c_secret is an object, so presume it to be a parent object
                theparent = c_secret;
            }
            
            c_secret = null;
            
        } else {
        
            if(util.isObject(c_key)) {                      // c_key is an object, so presume it is a parent object
                
                theparent = c_key;
                c_secret = null;
                a_token_key = null;
                a_token_secret = null;
                callback = null;
                theparent = null;
                            
            } else {
                
                if(util.isString(c_key)) {
                    if(util.isString(c_secret)) {
                        if(util.isString(a_token_key)) {
                            if(!util.isString(a_token_secret)) {
                                // TODO: fetch the access secret from Twitter
                                throw new Error('LoginCredential: argument 4 (access_token_secret) is not a string. In later versions, this will be fetched from twitter.');
                            } else {
                                this.isAnonymous = false;
                            }
                        } else {
                            // TODO: fetch the access token from Twitter
                            throw new Error('LoginCredential: argument 3 (access_token_key) is not a string. In later versions, this will be fetched from twitter.');
                        }
                    } else {
                        throw new Error('LoginCredential: argument 2 (consumer_secret) is not a string');
                    }
                
                } else {
                    throw new Error('LoginCredential: argument 1 (consumer_key) is not a string');
                }
                
            }
            
        }
    }

    // bounds checking
    var result = util.checkBounds(callback, theparent, this);
    callback = result.callback;
    theparent = result.parent;
    delete result;
    
    this.parent =               theparent;
                                
    this.consumer_key =         c_key;
    this.consumer_secret =      c_secret;
    this.access_token_key =     a_token_key;
    this.access_token_secret =  a_token_secret;
    this.verifier               = null;             // verifier is used to request the access_token_key
    
    this.api =                  new TwitterLogin_API(this.parent);
                                                        
}
module.exports.LoginCredential = LoginCredential;

TwitterLogin_API = function(theparent) {

    this.parent =                   theparent;
    
    this.remaining_hits =           0;
    this.reset_time_in_seconds =    0;
    this.hourly_limit =             0;
    
    this.photos =                   {
                                        remaining_hits:             0,
                                        reset_time_in_seconds:      0,
                                        reset_time:                 null,
                                        daily_limit:                0
                                    };
                                    
    this.reset_time =               null;
    this.total_hits =               0;
    this.limited =                  false;
    
    this.registerRequest =          function(isMedia, callback, parent) {
                                        
                                        // TODO:    return errors that indicate who is doing the rate limiting
                                        //          e.g. Twitter vs. Internal
                                                                                            
                                        // bounds checking
                                        var result = util.checkBounds(callback, parent, this);
                                        callback = result.callback;
                                        parent = result.parent;
                                        delete result;
                                        
                                        var out;
                                        
                                        if(isMedia) {   // refresh API status from Twitter every 10 api calls that use Media
                                            if(this.photos.remaining_hits == null || this.photos.remaining_hits <= 0 || this.photos.remaining_hits % 10 == 0) {
                                                this.refreshRateLimitStatus(null, this.parent);
                                            }
                                            if(this.photos.remaining_hits <= 0) {
                                                out = new TwitterResult(    false, {
                                                                            message: 'twitter rate limited',
                                                                            data: 'twitter rate limited',
                                                                            code: 420
                                                                        });
                                            } else {
                                                this.photos.remaining_hits--;
                                                out = new TwitterResult(true, this.photos.remaining_hits);
                                            }
                                        } else {    // refresh API status from Twitter every 10 api calls that dont use Media
                                            if(this.remaining_hits == null || this.remaining_hits <= 0 || this.remaining_hits % 50 == 0) {
                                                this.refreshRateLimitStatus(null, this.parent);
                                            }
                                            if(this.remaining_hits <= 0) {
                                                out = new TwitterResult (   false, {
                                                                            message: 'twitter rate limited',
                                                                            data: 'twitter rate limited',
                                                                            code: 420
                                                                        });
                                            } else {
                                                this.remaining_hits--;
                                                out = new TwitterResult(true, this.remaining_hits);
                                            }
                                        }
                                        
                                        if(util.isCallbackReturn(callback)) {
                                            return out;
                                        } else {
                                            return callback(out, parent);
                                        }
                                        
                                    };
        
    this.isRateLimited =            function(callback, parent) {
                                                    
                                        // bounds checking
                                        var result = util.checkBounds(callback, parent, this);
                                        callback = result.callback;
                                        parent = result.parent;
                                        delete result;
                                        
                                        /*
                                        if(this.total_hits == null || this.total_hits % 50 == 0) {      // hard limit before checking our API status by contacting Twitter
                                            this.refreshRateLimitStatus(null, this.parent);
                                        }
                                        */
                                        if(true) {
                                            this.refreshRateLimitStatus(null, this.parent);
                                        }

                                        
                                    /*
                                        var out = true,
                                            now = new Date().getTime(),
                                            credential = parent.getCredentials(authentication, function(result, parent) {
                                            
                                                for(var i=0; i<result.length; i++) {
                                                
                                                    // TODO: move to multi-authentication model
                                                
                                                    if( parent.credentials[i].api.timestamp == null) {
                                                        parent.credentials[i].api.timestamp = now;
                                                        parent.refreshRateLimitInfo(i);
                                                    }
                                                        
                                                    // TODO: move to parent-style timestamping (next refresh stamp)
                                                    
                                                    // time since first API request is greater
                                                    // than the api limit interval (1 hour)
                                                    // so, reset our soft-limit of API calls
                                                    if((now - parent.credentials[i].api.timestamp) > config.api_rate_limit.interval) {
                                                        parent.credentials[i].api = {
                                                                                        timestamp:  now,
                                                                                        remaining:  config.api_rate_limit.oauth,
                                                                                        limited:    false
                                                                                    };
                                                        out = false;
                                                    } else {
                                                        out = (parent.credentials[i].api.remaining > 0);
                                                    }
                                                                            console.log('-3');  
                                                    if(util.isCallbackReturn(callback)) {
                                                        return out;
                                                    } else {
                                                        callback(out, parent);
                                                    }
                                                
                                                    
                                                }
                                                    
                                            }, this);
                                    */
                                    
                                    /*
                                        out = new TwitterResult (   false, {
                                                                    message: 'twitter rate limited',
                                                                    data: 'twitter rate limited',
                                                                    code: 420
                                                                });
                                                                */
                                                                
                                                                
                                    
                                        out = new TwitterResult (true);
                                                                
                                        // DEBUG
                                        if(util.isCallbackReturn(callback)) {
                                            return out;
                                        } else {
                                            return callback(out, parent);
                                        }
                
                                    };
                                    
    this.refreshRateLimitStatus =   function(callback, parent) {
                                        
                                        // bounds checking
                                        var result = util.checkBounds(callback, parent, this);
                                        callback = result.callback;
                                        parent = result.parent;
                                        delete result;
                                        
                                    };
                                    
    this.getRateLimitExpiration =   function(callback, parent) {
    
                                        // bounds checking
                                        var result = util.checkBounds(callback, parent, this);
                                        callback = result.callback;
                                        parent = result.parent;
                                        delete result;
                                        
                                        var now = new Date();
                                        
                                    };
                                    
}

/*
// call the callback event when the API rate limit
// has been cleared (i.e. create a timer to call the
// callback function when the interval has elapsed.
Twitter.prototype.wakeOnClearedRateLimit = function(callback, parent) {
    
    // bounds checking
    var result = util.checkBounds(callback, parent, this);
    callback = result.callback;
    parent = result.parent;
    delete result;
    
    // TODO: set timer 
    //var timer = setTimeout(callback(), 3600000);

    
}
*/

//
// returns an array of credential objects
//
// Arguments:       1. Twitter.getLoginCredential(null, null, parent)
//                          ->  round-robin next login, no callback, with parent
//
//                  2. Twitter.getLoginCredential(null,function(){}, parent)
//                          ->  round-robin next login, with callback, with parent
//
//                  3. Twitter.getLoginCredential(TwitterLogin)
//                          ->  use specified TwitterLogin as credential, no callback, no parent
//
//                  4. Twitter.getLoginCredential(TwitterLogin, function(){})
//                          ->  use specified TwitterLogin as credential, with callback, no parent
//
//                  5. Twitter.getLoginCredential(TwitterLogin,function(){},Twitter)
//                          ->  use specified TwitterLogin as credential, with callback and parent
//
//                  6. Twitter.getLoginCredential(TwitterLogin,false,Twitter)
//                          ->  use specified TwitterLogin as credential, no callback, with parent
//
//                  7. Twitter.getLoginCredential(Array)
//                          ->  use the current credential at the round-robin credential index
//                              as the credential. If the array is not large enough, use index 0.
//                              if the array is zero-sized, use the next available round-robin
//                              
//                  8. Twitter.getLoginCredential(function() {})
//                          -> round robin next login, with callback, without parent.
//
//                  9. 
//                      
//
Twitter.prototype.getLoginCredential = function(authentication, callback, parent) {

    var out;
    
    if(util.isUndefined(authentication)) {                  // presume no argument specified
        
        // bounds checking
        var result = util.checkBounds(callback, parent, this);
        callback = result.callback;
        parent = result.parent;
        delete result;
    
        if(!util.isUndefined(parent)){
            out = parent.nextLoginCredential();
        } else {
            throw new Error('Twitter.getLoginCredential(TwitterLogin, function(){}, Twitter): argument 1 is undefined and no Twitter object was specified.');
        }
        
    } else {
    
        if( util.isUndefined(callback) &&               // argument 2 (callback) is undefined
            util.isCallbackType(authentication)) {      // argument 1 (authentication) is a callback type
            callback = authentication;
            authentication = true;
            parent = this;
        }
        
        // bounds checking
        var result = util.checkBounds(callback, parent, this);
        callback = result.callback;
        parent = result.parent;
        delete result;
        
        if(util.isBool(authentication)) {                   // boolean value representing whether to use internal authentication or not
        
            if(authentication == true)  {                   // authenticate
                out = parent.nextLoginCredential();
            } else {                                        // do not authenticate
                out = parent.guest_credentials;
            }
        
        } else if(util.isArray(authentication)) {           // presume to be array of authentication objects
        
            if(!util.isUndefined(parent)) {
            
                if(authentication.length > 0) {
                    if(authentication.length >= parent.credentialIndex) {
                        out = parent.nextLoginCredential();
                    } else {
                        out = authentication[0];
                    }
                } else {
                    out = parent.nextLoginCredential();
                }
                
            } else {
                throw new Error('Twitter.getLoginCredential(Array, function(){}, Twitter): argument 1 is Array and no Twitter object was specified.');  
            }
            
        } else if(util.isObject(authentication)) {          // presume object to be of correct kind
            out = authentication;
        }
        
    }
    
    if(util.isCallbackReturn(callback)) {
        return out;
    } else {
        return callback(out, parent);
    }
    
}

Twitter.prototype.refreshRateLimitInfo = function(credentialIndex, callback, parent) {

    // bounds checking
    var result = util.checkBounds(callback, parent, this);
    callback = result.callback;
    parent = result.parent;
    delete result;
        
    // get api call status
    if(credentialIndex < 0) {
    
        for(var i=0; i<parent.credentials.length; i++) {
        
            parent.account.rate_limit_status(null, function(result, parent) {
            
                // TODO: use credentialIndex
            
                if(result.isSuccess) {
                    parent.api_rate[0].remaining = result.data.remaining_hits;
                }
                
                // TODO: use callback
                
    
            }, parent);
            
        }
        
    } else {
        
        parent.account.rate_limit_status(null, function(result, parent) {
        
            // TODO: use credentialIndex
        
            if(result.isSuccess) {
                parent.api_rate[0].remaining = result.data.remaining_hits;
            }
            
            // TODO: use callback
            

        }, parent);
        
    }
        
}

Twitter.prototype.rateLimitTimeLeft = function(callback, parent) {

    // bounds checking
    var result = util.checkBounds(callback, parent, this);
    callback = result.callback;
    parent = result.parent;
    delete result;
        
    //
    // TODO:    automatically request API call status
    //          from parent once at initialization,
    //          and then again after every N calls
    //
    //          every 100 calls?
    //

    var out = config.api_rate_limit.interval,
        now = new Date().getTime();
    
    if(parent.api_rate.timestamp != null) {
        out = (now - parent.api_rate.timestamp);
        parent.refreshRateLimitInfo();
    }
            
    if(util.isCallbackReturn(callback)) {
        return out;
    } else {
        return callback(out, parent);
    }
    
}

// TODO:    DONT ADD VARIABLES TO END OF STRING URL IF NOT REQUIRED
//          E.G. twitter.retweets.statuses.by_user({ id: '205263849622999042' }, function(result){} );
Twitter.prototype.getRequestURL = function(url, param, callback, parent) {

    // bounds checking
    var result = util.checkBounds(callback, parent, this);
    callback = result.callback;
    parent = result.parent;
    delete result;
        
    var out = "";
    
    if(util.isArray(url)) {
        for(var i=0; i<url.length; i++) {
            out += url[i];
        }
    } else {
        out = url;
    }
    
    if(util.isObject(param)) {
        out += '?' + querystr.stringify(param, '&', '=');
    }
                                        
    if(util.isCallbackReturn(callback)) {
        return out;
    } else {
        return callback(out, parent);
    }
        
}

Twitter.prototype.get = function(url, param, authenticate, config, callback) {
    url = [ config.endpoints.parent_rest_base, '/', url , '.json' ];
    return this.fetch(url, param, authenticate, 'GET', config, callback, this);
}

Twitter.prototype.post = function(url, param, authenticate, callback) {
    url = [ config.endpoints.parent_rest_base, '/', url , '.json' ];
    return this.fetch(url, param, authenticate, 'POST', config, callback, this);
}

Twitter.prototype.request = function(url, param, authentication, reqConfig, callback, parent) {
    
    // bounds checking
    var result = util.checkBounds(callback, parent, this);
    callback = result.callback;
    parent = result.parent;
    delete result;
        
    if(util.isArray(url)) {
    
        var method = url[url.length-1];
        
        if(url.length == 2) {
            url = [ config.endpoints.twitter_rest_base, '/', url[0] , '.json' ];
        } else {                                    // use indices which are objects as tokens to place param keys
            var concat = "",
                keys,
                elm;
            for(var i=0; i<url.length-1; i++) {     // exclude last index as it is reserved for method type (GET || POST) etc
                keys = [];
                elm = url[i];
                if(util.isObject(elm)) {            // presumes object keys are ordered correctly
                    keys = Object.keys(elm);
                    for(var j=0; j<keys.length; j++) {
                        concat += param[keys[j]];
                    }
                } else {
                    concat += elm
                }
            }
            url = [ config.endpoints.twitter_rest_base, '/',concat , '.json' ];
        }
        
    }
    
    this.fetch(url, param, authentication, method, reqConfig, callback, parent);
    
}

//
// REST API
//
// url:                 string, destination url
//
// param:               array, zero or greater of url parameters and values
//
// authentication:      bool, object, or array, for authentication credentials to use
//
// method:              string, HTTP method (GET, POST, PUT, DELETE etc)
//
// reqConfig:           object: additional configuration. eg. {media: true} will specify to use
//                      media API rate limiting instead of standard.
// 
// callback:            function or null
//
// parent:              Twitter object
//
Twitter.prototype.fetch = function(url, param, authentication, method, reqConfig, callback, parent) {

    // bounds checking
    var result = util.checkBounds(callback, parent, parent);
    callback = result.callback;
    parent = result.parent;
    delete result;
    
    var credential = parent.getLoginCredential(authentication),
        rate_limit = credential.api.isRateLimited();
    
    if(!rate_limit.isSuccess) { // return non-zero indicating rate limit
                            
        if(util.isCallbackReturn(callback)) {
            return rate_limit;
        } else {
            var query = {   "url"               :url,
                            "param"             :param,
                            "authentication"    :authentication,
                            "method"            :method,
                            "reqConfig"         :reqConfig
                        };
            return callback(rate_limit, parent, query);
        }
        
    } else {
        
        // register API calls
        credential.api.registerRequest(((reqConfig != null && !util.isUndefined(reqConfig.media)) && reqConfig.media == true));
        
        var url = parent.getRequestURL(url, param);

        // TODO:    parse the streamed data in chunks of JSON,
        //          and emit event for on 'object available'.
        
        
        var requestParam;
        
        if(credential.isAnonymous) {
            requestParam = {
                                method: method,
                                uri:    url,
                                json:   true
                            };
        } else {
            requestParam = {
                                method: method,
                                uri:    url,
                                //TODO: fetch the verifier from twitter?
                                oauth:  {
                                            consumer_key:           credential.consumer_key,
                                            consumer_secret:        credential.consumer_secret,
                                            token:                  credential.access_token_key,
                                            token_secret:           credential.access_token_secret
                                        },
                                json:   true 
                            };
        }
        
        // TODO: ERROR HANDLING SUCKS
        request(requestParam , function(error, response, body) {

            var out = null;
            if(error || !util.isUndefined(body.errors) || response.statusCode != 200) {
                out = new TwitterResult (   false, {
                                            message: body.errors[0].message,
                                            data: body,
                                            code: (util.isUndefined(body.errors[0].code) ? response.statusCode : body.errors[0].code)
                                        });
            } else {
                out = new TwitterResult( true, body );
            }
            
            if(util.isCallbackReturn(callback)) {
                return out;
            } else {
                var query = {   "url"               :url,
                                "param"             :param,
                                "authentication"    :authentication,
                                "method"            :method,
                                "reqConfig"         :reqConfig
                            };
                return callback(out, parent, query);
            }
        
        }); 
        
    }
    return parent;
    
}

//
// STREAMING API
//
// url:                 array, destination url
//
// param:               array, zero or greater of url parameters and values
//
// authentication:      bool, object, or array, for authentication credentials to use
//
// method:              string, HTTP method (GET, POST)
//
// reqConfig:           [ not implemented ]
// 
// callback:            function or null
//
// parent:              Twitter object
//
Twitter.prototype.requestStream = function(url, param, authentication, reqConfig, callback, parent) {
    
    // bounds checking
    var result = util.checkBounds(callback, parent, this);
    callback = result.callback;
    parent = result.parent;
    delete result;
        
    if(util.isArray(url)) {
    
        var method = url[url.length-1];
        
        if(url.length == 2) {
            url = [ config.endpoints.twitter_stream_base, '/', url[0] , '.json' ];
        } else {                                    // use indices which are objects as tokens to place param keys
            var concat = "",
                keys,
                elm;
            for(var i=0; i<url.length-1; i++) {     // exclude last index as it is reserved for method type (GET || POST) etc
                keys = [];
                elm = url[i];
                if(util.isObject(elm)) {            // presumes object keys are ordered correctly
                    keys = Object.keys(elm);
                    for(var j=0; j<keys.length; j++) {
                        concat += param[keys[j]];
                    }
                } else {
                    concat += elm
                }
            }
            url = [ config.endpoints.twitter_rest_base, '/',concat , '.json' ];
        }
        
    }
    
    this.fetchStream(url, param, authentication, method, reqConfig, callback, parent);
    
}

// encode string as an array for use as post-data variables
Twitter.prototype.encodeStreamParam = function(param, depth) {
    
    if(depth >= 2) {
        return "";
    }
    
    var param_str = "",
        out = [],
        keys = Object.keys(param);  
        
   
    if(util.isUndefined(depth)) {
        depth = 0;
    }
    
    for(var i=0; i<keys.length; i++) {
        if( util.isArray(param[keys[i]]) ||
            util.isObject(param[keys[i]]) ) {
            out[keys[i]] = this.encodeStreamParam(param[keys[i]],depth+1);
        } else if(depth > 0) {
            param_str += ',' + escape(encodeURI(param[keys[i]]));				// NOTE: POTENTIAL UNICODE PITFALL (escape)
        } else {
            out[keys[0]] = param[keys[0]];
            return out;
        }
    }
    
    if(depth > 0) {
        return param_str.substring(1);
    } else {
        return out;
    }
    
}

// streaming-api version of Twitter.prototype.fetch
Twitter.prototype.fetchStream = function(url, param, authentication, method, reqConfig, callback, parent) {

    // bounds checking
    var result = util.checkBounds(callback, parent, parent);
    callback = result.callback;
    parent = result.parent;
    delete result;
    
    var credential = parent.getLoginCredential(authentication);
    
    if(credential.isAnonymous) {    // return non-zero indicating rate limit
        
        throw new Error('The Twitter Streaming API cannot be accessed with anonymous credentials');
        
    } else {
        
        var oa = new oauth(
            config.oauth.request_url,
            config.oauth.access_url,
            credential.consumer_key,
            credential.consumer_secret,
            config.oauth.version,
            "",
            config.oauth.signature_method,
            null,
            {   "Accept" : "*/*",
                "Connection" : "keep-alive" }
        );
        
        var url, request;
        switch(method.toUpperCase()) {
        
            case 'GET':
            request = oa.get(   parent.getRequestURL(url, param),
                                credential.access_token_key,
                                credential.access_token_secret);
            break;
            
            case 'POST':
            // NOTE: if you muck about with the parameters (param)
            //       without knowing what you're doing, you can
            //       easily break the post request.
            //       you have been warned.
            request = oa.post(  parent.getRequestURL(url, ''),
                                credential.access_token_key,
                                credential.access_token_secret,
                                parent.encodeStreamParam(param));
            break;
        }
        
        if(!util.isUndefined(request)) {
            var message = "";       
            request.addListener('response', function (response) {
                response.setEncoding('utf8');
                response.addListener("data", function (chunk) {
            
                    message += chunk;
                    var newlineIndex = message.indexOf("\r\n");
                    
                    if (newlineIndex !== -1) {
                        var tweet = message.slice(0, newlineIndex);
                      
                        var result = new TwitterResult(true, tweet);
                        callback(result);
                        
                    }
                    message = message.slice(newlineIndex + 2);
                    
                });
            
            });
            request.end();
        } else {
            // execute callback with error
            var result = new TwitterResult( false, {message: 'connection failure' });
            callback(result);
        }
                    
    }
    
    return parent;

}

////////////
