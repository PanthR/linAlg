(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Vector constructor and
 * creates the subclass SparseV of Vector
 */
return function(Vector) {
	/**
	 * Constructs a SparseV object
	 * @param {object} arr - Values
	 * @param {int} len - length of Vector
	 *
	 * The object properties are the indices of the non-zero values.
	 */
	function SparseV(arr, len) {
		this._values = arr;
		this.length = len;
		this.keys = Object.keys(arr); // array of nonzero entries
		this.nnz = this.keys.length; // number of nonzero entries
	}

	SparseV.prototype = Object.create(Vector.prototype);

	// SparseV.prototype methods

	SparseV.prototype.get = function get(i) {
		return this._values[i] || 0;
	}

	SparseV.prototype.set = function set(i, v) {
		if ( i >= 1 && i <= len) { 
			this._values[i] = v || 0;
		}
		return this;
	}

	// SparseV.prototype.dot = function dot(other) {
	// 	// "this" is sparse
	// 	// "other" is sparse or dense
	// 	var res, i, l, that;

	// 	res = 0;
	// 	that = this;

	// 	if (that.nnz > other.nnz) { 
	// 		// swap roles
	// 		that = other;
	// 		other = this;
	// 	}

	// 	l = that.nnz;

	// 	for(i = 0; i < l; i += 1) {
	// 		res += that.get(that.keys[i]) * other.get(that.keys[i]);
	// 	}

	// 	return res;
	// };

	return SparseV;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
	'use strict';
	module.exports = factory(require); 
}));