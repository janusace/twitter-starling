/*
 * Author:          Sean Nicholls
 * Website:         http://www.seannicholls.com
 * github:          https://github.com/snicholls
 * Twitter:         @sean_nicholls
 *
 * Assumptions:     Reddit feeds on wasted potential.
 *
*/

module.exports = {

    endpoints:          {   
                            twitter_rest_base:          'https://api.twitter.com/1',
                            twitter_search_base:        'http://search.twitter.com',
                            twitter_stream_base:        'https://stream.twitter.com/1.1',
                        },
                        
    oauth:              {
                            version:                    '1.0',
                            signature_method:           'HMAC-SHA1',
                            request_url:                'https://api.twitter.com/oauth/request_token',
                            access_url:                 'https://api.twitter.com/oauth/access_token',
                            authenticate_url:           'https://api.twitter.com/oauth/authenticate',
                            authorize_url:              'https://api.twitter.com/oauth/authorize',
                        },

    api_rate_limit:     {
                            unauthenticated:        150,
                            oauth:                  350,
                            interval:               3600000,    // milliseconds (1 hour = 3,600,000).
                        }
}