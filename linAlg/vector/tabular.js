(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass TabularV of Vector
 */
return function(Vector) {
	/**
	 * Constructs a TabularV object
	 * @param {function} f - generating function
	 * @param {int} len    - length of Vector
	 *
	 * The object properties are the indices of the non-zero values.
	 */
	function TabularV(f, len) {
		this.f = f;
		this.length = len;
		this.nnz = len; // number of nonzero entries
	}

	TabularV.prototype = Object.create(Vector.prototype);

	// TabularV.prototype methods

	TabularV.prototype.compute = function compute(i) {
		return this.f(i);
	}

	return TabularV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
	'use strict';
	module.exports = factory(require); 
}));