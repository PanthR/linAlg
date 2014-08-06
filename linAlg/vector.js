(function(define) {'use strict';
define(function(require) {

	// TODO: decide if Vectors are editable
	// 
	// TODO:  Testing

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
	 * Dot product
	 * @param  {[type]} other [description]
	 * @return {[type]}       [description]
	 */
	Vector.prototype.dot = function dot(other) {
		var res, i, l;

		res = 0;
		l = this.length;

		for(i = 0; i < l; i += 1) {
			res += this.get(i) * other.get(i);
		}

		return res;
	};

	/**
	 * Constructs a DenseV object
	 * @param {array} arr - Values
	 */
	function DenseV(arr) {
		this.values = arr;
		this.length = arr.length;
		this.nnz = this.length;
	}

	DenseV.prototype = Object.create(Vector.prototype);

	// DenseV.prototype methods
	DenseV.prototype.get = function get(i) {
		return this.values[i] || 0;
	}

	DenseV.prototype.dot = function dot(other) {
		if (isSparse(other)) {
			return other.dot(this);
		}
		// both are dense
		return Vector.prototype.dot.call(this, other);
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
		this.keys = arr.keys(); // array of nonzero entries
		this.nnz = this.keys.length; // number of nonzero entries
	}

	SparseV.prototype = Object.create(Vector.prototype);

	// SparseV.prototype methods

	SparseV.prototype.get = function get(i) {
		return this.values[i] || 0;
	}

	SparseV.prototype.dot = function dot(other) {
		// "this" is sparse
		// "other" is sparse or dense
		var res, i, l, that;

		res = 0;
		that = this;

		if (that.nnz > other.nnz) { 
			// swap roles
			that = other;
			other = this;
		}

		l = that.nnz;

		for(i = 0; i < l; i += 1) {
			res += that.get(that.keys[i]) * other.get(that.keys[i]);
		}

		return res;
	};

	// Helper functions
	
	/** @private */
	function sameLength(a, b) {
		return a.length === b.length;
	}

	/** @private */
	function isSparse(a) {
		return a instanceof SparseV;
	}

});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
	'use strict';
	module.exports = factory(require); 
}));