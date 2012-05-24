/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		There is no such thing as 'too much pizza'.
 *
*/

exports.isCallbackReturn = function(callback) {

	return (	typeof callback !== 'undefined' &&
				typeof(callback) === 'function' 	);

}

exports.checkBounds = function(callback, parent, callerParent) {
	
	if(typeof callback === 'undefined') {
		parent = callerParent;
	} else {
		if(typeof callback === 'function') {
			if(typeof parent === 'undefined') {
				parent = callerParent;
			} else {
				// do nothing, all arguments specified
			}
		} else {
			callback = false;
			if(typeof parent === 'undefined') {
				parent = callerParent;
			} else {
				// do nothing, all arguments specified
			}
		}
	}
	
	return		{
					callback:	callback,
					parent:		parent,
				};
	
}