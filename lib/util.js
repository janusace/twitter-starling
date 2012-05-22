/*
 * Author:			Sean Nicholls
 * Website:			http://www.seannicholls.com
 * github:			https://github.com/snicholls
 * Twitter:			@sean_nicholls
 *
 * Assumptions:		There is no such thing as 'too much pizza'.
 *
*/

exports.checkCallback = function(callback, boolResponse) {

	if(callback === undefined || typeof(callback) !== 'boolean' || boolResponse) {
		return(typeof(callback) === 'function');
	} else {
		if(typeof(callback) !== 'function') {
			throw new Error('supplied callback argument is not a function');
		} else {
			return true;
		}
	}

}
