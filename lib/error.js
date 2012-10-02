/*
 * Author:          Sean Nicholls
 * Website:         http://www.seannicholls.com
 * github:          https://github.com/snicholls
 * Twitter:         @sean_nicholls
 *
 * Assumptions:     Unicorns are magic.
 *
*/
var TwitterUtil = require('./util');

var util = new TwitterUtil();

// https://dev.twitter.com/docs/error-codes-responses

// http status codes and their meaning in the 
// context of the twitter API.
var http_status_codes =     {
                                200:    'OK',
                                304:    'Not Modified',
                                400:    'Bad Request',
                                401:    'Unauthorized',
                                403:    'Forbidden',
                                404:    'Not Found',
                                406:    'Not Acceptable',
                                420:    'Enhance Your Calm',
                                500:    'Internal Server Error',
                                502:    'Bad Gateway',
                                503:    'Service Unavailable',
                                504:    'Gateway timeout'
                            };

// twitter api error codes
var twitter_error_codes =   {
                                34:     'Sorry, that page does not exist',
                                130:    'Over capacity',
                                131:    'Internal error'
                            };
                    
// internal error codes
var internal_error_codes =  {
                                1000:   'internally rate limited'
                            };
                    
//
// an object representing the result of an operation.
// it will contain either an error or an object's result
// data.
//
// while the same can be achieved with multiple arguments,
// this method, I find to be superior and far easier to manage
//

function TwitterResult(success, theData, errorCode) {

    this.isSuccess  =   false;
    this.data       =   null;                       // only one of data, or error, should ever be assigned.
    this.error      =   {                           
                            message:    '',         // the actual error message
                            data:       '',         // the associated data with the error (response etc)
                            code:       ''          // twitter or HTTP status code depending on which is available
                        }                       

    if(!util.isUndefined(success)) {
    
        this.isSuccess = (success == true);

        if(success) {
            this.data = theData;
        } else {
            // OPTIONALLY PRINT ALL ERRORS TO CONSOLE HERE
            //console.log(this);
            this.error = theData;
        }
        
    } else {
        
        throw new Error('TwitterResult error at argument 1: success state must be specified');
        
    }
    
}
module.exports = TwitterResult;

// if success, returns data; if error, returns error message
// useful for debugging purposes etc.
TwitterResult.prototype.message = function(callback) {
    
    var out;

    if(this.isSuccess) {
        out = (util.isUndefined(this.data) ? "" : this.data);
    } else {
        out = (util.isUndefined(this.error.message) ? "" : this.error.message);
    }
                    
    if(util.isCallbackReturn(callback)) {
        return out;
    } else {
        callback(out, parent);
    }

}

// returns a string representation of the kind of success
// or failure state that this result represents
TwitterResult.prototype.kind = function(callback) {
    
    var out = 'failure';
    
    if(this.isSuccess) {
        out = 'success'; 
    }
                            
    if(util.isCallbackReturn(callback)) {
        return out;
    } else {
        callback(out, parent);
    }
    
}
