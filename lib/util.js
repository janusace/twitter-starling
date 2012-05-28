/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		There is no such thing as 'too much pizza'.
 *
*/

//
// is 'callback' a function callback or a return value
// if callback is not a function, then return the
// value instead.
//
// true = return value
// false = callback
//
function isCallbackReturn(callback) {

	return (!isCallbackType(callback) || !isFunction(callback));

}
exports.isCallbackReturn = isCallbackReturn;

// a callback can either be a function, a boolean value
// of 'false' or an undefined value .
//
// function = true, everything else = false.
//
function isCallbackType(object) {
	
	return !isUndefined(object) && (isFunction(object) || (isBool(object) && object == false));
	
}
exports.isCallbackType = isCallbackType;

// check callback and parent variables for validity
// and return them as required.
//
// in action, this allows the callback and parent 
// variables to be optional, and sorts out the logic
// required to figure out how to proceed.
function checkBounds(callback, parent, callerParent) {
	
	if(isUndefined(callback)) {
		parent = callerParent;
		callback = null;
	} else {
		if(isCallbackType(callback)) {
			if(isUndefined(parent)) {
				parent = callerParent;
			}
		} else {
			callback = false;
			if(isUndefined(parent)) {
				parent = callerParent;
			}
		}
	}
	
	return	{
				callback:	callback,
				parent:		parent,
			};

}

exports.checkBounds = checkBounds;

//
// The following functions are only really syntactic sugar.
// they make reading code easier to read, not much else.
//

function isUndefined(object) {
	
	return (typeof object === 'undefined');
	
}
exports.isUndefined = isUndefined;

function isFunction(object) {

	return !isUndefined(object) && (object instanceof Function || typeof object === 'function');
	
}
exports.isFunction = isFunction;

function isArray(object) {
	
	return !isUndefined(object) && (object instanceof Array || typeof object === 'array');
	
}

exports.isArray = isArray;

function isBool(object) {
	
	return !isUndefined(object) && (object instanceof Boolean || typeof object === 'boolean');
	
}
exports.isBool = isBool;

// for the purposes of creating a logical distinction between Array and Object,
// Arrays do no return true to isObject(Array).
function isObject(object) {
	
	return	!isUndefined(object) &&
			!isArray(object) &&
			(object instanceof Object || typeof object === 'object');

}
exports.isObject = isObject;

function isString(object) {

	return !isUndefined(object) && (object instanceof String || typeof object === 'string');
	
}
exports.isString = isString;
