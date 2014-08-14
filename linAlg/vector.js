(function(define) {'use strict';
define(function(require) {

   /**
    * Representation of fixed-length vectors.
    * @module Vector
    * @author Haris Skiadas <skiadas@hanover.edu>
    * @author Barb Wahl <wahl@hanover.edu>
    */

   var DenseV, SparseV, TabularV;

   /**
    * `Vector` objects are a Javascript representations of real-valued vectors.
    * They are constructed in one of three ways:
    * 1. Based on an array of values
    * 2. Based on a key-value object representing the non-zero indices and their values (sparse vectors)
    * 3. Based on a function `f(n)` describing how the i-th index is meant to be computed.
    *
    * `Vector` objects are 1-indexed.
    *
    * @class Vector
    * @constructor
    * @param arr {Array|Function|Object} A description of the vector's values
    * @param [len] {Integer}     The vector's length. Optional if an array is passed.
    * @example
    *     var v1 = new Vector([3, 5, 1, 2]);          // A length-4 vector
    *     var v2 = new Vector({ 4: 10, 2: 12 }, 10);  // A length-10 sparse vector
    *     var v3 = new Vector(Math.exp, 3);           // A length-3 vector with values exp(1), exp(2), exp(3)
    */
   function Vector(arr, len) {
      if (Array.isArray(arr)) {
         return new DenseV(arr);
      }
      if (typeof arr === 'function') {
         return new TabularV(arr, len);
      }
      return new SparseV(arr, len);
   }
   /**
    * The length of the vector
    * @property length
    * @type {Integer}
    */

   Vector.DenseV   = DenseV   = (require('./vector/dense'))(Vector);
   Vector.SparseV  = SparseV  = (require('./vector/sparse'))(Vector);
   Vector.TabularV = TabularV = (require('./vector/tabular'))(Vector);


   // Vector dispatch class methods
   Vector.forEach = function forEach(v, f, skipZeros) {
      return v.constructor.forEach(v, f, skipZeros);
   };

   Vector.forEachPair = function forEachPair(v1, v2, f, skipZeros) {
      if (!sameLength(v1, v2)) {
         throw new Error('Vector.forEachPair: vectors should be same langth');
      }
      function swap(f) {
         return function(b, a, i) { return f(a, b, i); };
      }
      if (isSparse(v1)) {
         SparseV.forEachPair(v1, v2, f, skipZeros);
      } else if (isSparse(v2)) {
         SparseV.forEachPair(v2, v1, swap(f), skipZeros);
      } else {
         DenseV.forEachPair(v1, v2, f);
      }
      return Vector;
   };

   // Vector.prototype methods 

   /**
    * Returns the ith value of the vector
    * @method get
    * @param i {Integer} index (1-based)
    * @return {Double} The i-th value in the vector
    *
    * Vector indexing begins from 1
    */
   Vector.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      if (!this.values) { this.values = []; }
      if (this.values[i-1] == null) { 
         this.values[i-1] = this.compute(i) || 0;
      }
      return this.values[i-1];
   };

   /**
    * Sets the ith value of the vector
    * @method set
    * @param i {Integer} index
    * @param v {Double} the new value
    * @return {Object} this
    * @chainable
    */
   Vector.prototype.set = function set(i, v) {
      if ( i >= 1 && i <= this.length) { 
         if (!this.values) { this.values = []; }
         this.values[i-1] = v || 0;
      }
      return this;
   };

   /**
    * Compute the ith entry, to be used internally
    * @method compute
    * @private
    * @param i {Integer} index
    * @return {Double} the i-th value
    */
   Vector.prototype.compute = function compute(i) {

      throw new Error('Subclasses of Vector need to implement compute: ' +
         this.constructor.name);
   };

   /**
    * [forEach description]
    * @param  {[type]} f         [description]
    * @param  {[type]} skipZeros [description]
    * @return {[type]}           [description]
    *
    * Note: skipZeros = true gives permission for zeros to be skipped
    * (doesn't FORCE skipping)
    */
   Vector.prototype.forEach = function forEach(f, skipZeros) {
      Vector.forEach(this, f, skipZeros);
      return this;
   };

   Vector.prototype.forEachPair = function forEachPair(v2, f, skipZeros) {
      Vector.forEachPair(this, v2, f, skipZeros);
      return this;
   };

   Vector.prototype.reduce = function reduce(f, initial, skipZeros) {
      initial = initial || 0;
      this.forEach(function(v, i) {
         initial = f(initial, v, i);
      }, skipZeros);
      return initial;
   };

   /*
    * Dot product
    * @param  {[type]} other [description]
    * @return {[type]}       [description]
    */
   // Vector.prototype.dot = function dot(other) {
   //    var res, i, l;

   //    res = 0;
   //    l = this.length;

   //    for(i = 0; i < l; i += 1) {
   //       res += this.get(i) * other.get(i);
   //    }

   //    return res;
   // };

   // Helper functions
   
   /** @private */
   function sameLength(a, b) {
      return a.length === b.length;
   }

   /** @private */
   function isSparse(a) {
      return a instanceof SparseV;
   }

   return Vector;

});

}(typeof define === 'function' && define.amd ? define : function(factory) { 
   'use strict';
   module.exports = factory(require); 
}));