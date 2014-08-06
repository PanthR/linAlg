(function(define) {'use strict';
define(function(require) {

	var Vector, DenseV, SparseV;

	/**
	 * Constructs a Vector object
	 * @param {array|object} arr - Values
	 * @param {int} [len] - length of Vector
	 */
	function Vector(arr, len) {
		if (Array.isArray(arr)) {
			return new DenseV(arr);
		}
		return new SparseV(arr, len);
	}

	// Vector.prototype methods 

	/**
	 * Returns i'th value
	 * @param  {int} i - index
	 * @return {double} - value
	 *
	 * Indexing begins from 0
	 */
	Vector.prototype.get = function get(i) {
		console.log("Vector.get not implemented");
	}

	/**
	 * Constructs a DenseV object
	 * @param {array} arr - Values
	 */
	function DenseV(arr) {
		this.values = arr;
		this.length = arr.length;
	}

	DenseV.prototype = Object.create(Vector.prototype);

	// DenseV.prototype methods
	DenseV.prototype.get = function get(i) {
		return this.values[i] || 0;
	}

	/**
	 * Constructs a SparseV object
	 * @param {object} arr - Values
	 * @param {int} len - length of Vector
	 *
	 * The object properties are the indices of the non-zero values.
	 */
	function SparseV(arr, len) {
		this.values = arr;
		this.length = len;
	}

	SparseV.prototype = Object.create(Vector.prototype);

	// SparseV.prototype methods

	SparseV.prototype.get = function get(i) {
		return this.values[i] || 0;
	}

});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
	'use strict';
	module.exports = factory(require); 
}));