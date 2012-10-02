/*
 * Author:          Sean Nicholls
 * Website:         http://www.seannicholls.com
 * github:          https://github.com/snicholls
 * Twitter:         @sean_nicholls
 *
 * Assumptions:     There is no such thing as 'too much pizza'.
 *
*/


module.exports = function() {

                                //
                                // is 'callback' a function callback or a return value
                                // if callback is not a function, then return the
                                // value instead.
                                //
                                // true = return value
                                // false = callback
                                //
    this.isCallbackReturn =     function(callback) {
                                    return (!this.isCallbackType(callback) || !this.isFunction(callback));
                                }
                                
                                // a callback can either be a function, a boolean value
                                // of 'false' or an undefined value .
                                //
                                // function = true, everything else = false.
                                //
    this.isCallbackType =       function(object) {
                                    return !this.isUndefined(object) && 
                                           (this.isFunction(object) || (this.isBool(object) && object == false));
                                }
                                
                                // check callback and parent variables for validity
                                // and return them as required.
                                //
                                // in action, this allows the callback and parent 
                                // variables to be optional, and sorts out the logic
                                // required to figure out how to proceed.
    this.checkBounds =          function(callback, parent, callerParent) {
                                    
                                    if(this.isUndefined(callback)) {
                                        parent = callerParent;
                                        callback = null;
                                    } else {
                                        if(this.isCallbackType(callback)) {
                                            if(this.isUndefined(parent)) {
                                                parent = callerParent;
                                            }
                                        } else {
                                            callback = false;
                                            if(this.isUndefined(parent)) {
                                                parent = callerParent;
                                            }
                                        }
                                    }
                                    
                                    return  {
                                                callback:   callback,
                                                parent:     parent,
                                            };
                                    
                                }
                                
                                //
                                // The following functions are only really syntactic sugar.
                                // they make reading code easier to read, not much else.
                                //
    this.isUndefined =          function(object) {
                                    return (typeof object === 'undefined');
                                }
                                
    this.isFunction =           function(object) {
                                    return !this.isUndefined(object) && 
                                           (object instanceof Function || typeof object === 'function');
                                }
                                
    this.isArray =              function(object) {
                                    return !this.isUndefined(object) &&
                                           (object instanceof Array || typeof object === 'array');
                                }
                                
    this.isBool =               function(object) {
                                    return !this.isUndefined(object) &&
                                           (object instanceof Boolean || typeof object === 'boolean');
                                }
                                
                                // for the purposes of creating a logical distinction between Array and Object,
                                // Arrays do no return true to isObject(Array).
    this.isObject =             function(object) {
                                    return  !this.isUndefined(object) &&
                                            !this.isArray(object) &&
                                            (object instanceof Object || typeof object === 'object');
                                }
    
    this.isString =             function(object) {
                                    return !this.isUndefined(object) &&
                                           (object instanceof String || typeof object === 'string');
                                }
                                
    this.isTweetUser =          function(object) {
                                    return  (   this.isObject(object) &&
                                                !this.isUndefined(object.screen_name) );
                                }
                                
    this.isTweetStatus =        function(object) {
                                    return  (   this.isObject(object) &&
                                                !this.isUndefined(object.text) );
                                }
                                
    this.isTweetDelete =        function(object) {
                                    return  (   this.isObject(object) &&
                                                !this.isUndefined(object.delete) );
                                }
                                
    this.isTweetError =        function(object) {
                                    return  (   this.isObject(object) &&
                                                !this.isUndefined(object.errors) );
                                }
                                
    this.getTweetKind =         function(object) {
                                    if(this.isTweetUser(object)) {
                                        return "user";
                                    } else if(this.isTweetStatus(object)) {
                                        return "status";
                                    } else if(this.isTweetDelete(object)) {
                                        return "delete";
                                    } else if(this.isTweetError(object)) {
                                        return "error";
                                    } else {
                                        return "unknown";
                                    }
                                }
                                
    this.getDataType =         function(object) {
                                    if(this.isUndefined(object)) {
                                        return "undefined";
                                    } else if(this.isFunction(object)) {
                                        return "function";
                                    } else if(this.isArray(object)) {
                                        return "array";
                                    } else if(this.isBool(object)) {
                                        return "boolean";
                                    } else if(this.isString(object)) {
                                        return "string";
                                    } else if(this.isTweetUser(object)) {
                                        return "twitterUser";
                                    } else if(this.isTweetStatus(object)) {
                                        return "twitterStatus";
                                    } else if(this.isTweetDelete(object)) {
                                        return "twitterDelete";
                                    } else if(this.isTweetError(object)) {
                                        return "twitterError";
                                    } else if(this.isObject(object)) {
                                        return "object";
                                    } else {
                                        return "unknown";
                                    }
                                }
                                
    this.summariseTwitter =     function(tweet, prefix, postfix) {
                                
                                    if(!this.isString(prefix)) {
                                        prefix = '';
                                    }
                                    
                                    if(!this.isString(postfix)) {
                                        postfix = '';
                                    }
                                    
                                    switch(this.getTweetKind(tweet)) {
                                        case "status":
                                            return this.summariseTwitterStatus(tweet, prefix, postfix);
                                        case "user":
                                            return this.summariseTwitterUser(tweet, prefix, postfix);
                                        case "delete":
                                            return this.summariseTwitterDelete(tweet, prefix, postfix);
                                        default:
                                        case "error":
                                            return "Error" ;
                                        
                                    }

                                }
                                
    this.summariseTwitterStatus =   function(tweet, prefix, postfix) {
                                      return (prefix + '[' + tweet.user.screen_name + '] ' + tweet.text + postfix);
                                    }
                                
    this.summariseTwitterUser =     function(user, prefix, postfix) {
                                      return (prefix + '[' + user.screen_name + '] ' + postfix);
                                    }
                                
    this.summariseTwitterDelete =   function(user, prefix, postfix) {
                                      return '';   // TODO: flesh out 
                                    }

}
