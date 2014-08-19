(function(define) {'use strict';
define(function(require) {

   // LinAlg
   // version: 0.0.1
   // author: Haris Skiadas <skiadas@hanover.edu>
   // author: Barb Wahl <wahl@hanover.edu>
   // Javascript implementation of Linear Algebra Vectors.

   var DenseV, SparseV, TabularV;

   // `Vector` objects are Javascript representations of real-valued vectors.
   // They are constructed in one of three ways depending on the type of the first parameter `arr`:
   // 1. Based on an array of values. In this case, the resulting vector length `len` is optional.
   // 2. Based on a key-value object representing the non-zero indices and their values (sparse vectors)
   // 3. Based on a function `f(n)` describing how the i-th index is meant to be computed.
   //
   // `Vector` objects are 1-indexed.
   //
   //     var v1 = new Vector([3, 5, 1, 2]);          // A length-4 vector
   //     var v2 = new Vector({ 4: 10, 2: 12 }, 10);  // A length-10 sparse vector
   //     var v3 = new Vector(Math.exp, 3);           // A length-3 vector with values e(1), e(2), e(3)
   //     v1.length                                   // All vectors have a length property
   function Vector(arr, len) {
      if (Array.isArray(arr)) {
         return new DenseV(arr);
      }
      if (typeof arr === 'function') {
         return new TabularV(arr, len);
      }
      return new SparseV(arr, len);
   }

   Vector.DenseV   = DenseV   = require('./vector/dense')(Vector);
   Vector.SparseV  = SparseV  = require('./vector/sparse')(Vector);
   Vector.TabularV = TabularV = require('./vector/tabular')(Vector);


   /* Vector dispatch class methods */

   // Execute the function `f` for each entries from the vector `v`,
   // starting with the entry with index 1. `f` will be called as `f(value, index)`.
   // If `skipZeros` is `true`, then the system _may_ skip the execution of `f` for zero-entries.
   Vector.forEach = function forEach(v, f, skipZeros) {
      return v.constructor.forEach(v, f, skipZeros);
   };

   // Execute the function `f` for each pair of corresponding entries from the
   // vectors `v1` and `v2`, starting with the entries with index 1.
   // `f` will be called as `f(value1, value2, index)`, where `value1`, `value2` are the entries
   //  of the vectors `v1`, `v2` at index `i`.
   // If `skipZeros` is `true`, then the system _may_ skip the execution of `f` when
   // one of the values is 0.
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

   // Similar to `Array.prototype.reduce`. Given a function `f(acc, val, i)` and an
   // `initial` value, it successively calls the function on the vector's entries,
   // storing each result in the variable `acc`, then feeding that value back.
   // If `skipZeros` is `true`, this operation _may_ skip any zero entries.
   // `initial` and `acc` do not have to be numbers, but they do need to have the
   // same type, and `f` should return that same type.
   //     var a = new Vector([1,2,3]);
   //     a.reduce(function(a,b) { return a + b; }, 4); // Equivalent to (((4 + 1) + 2) + 3)
   Vector.reduce = function reduce(v, f, initial, skipZeros) {
      initial = initial || 0;
      v.forEach(function(val, i) {
         initial = f(initial, val, i);
      }, skipZeros);
      return initial;
   };

   /* eslint-disable max-params */
   Vector.reducePair = function reducePair(v1, v2, f, initial, skipZeros) {
      initial = initial || 0;
      Vector.forEachPair(v1, v2, function(val1, val2, i) {
         initial = f(initial, val1, val2, i);
      }, skipZeros);
      return initial;
   };
   /* eslint-enable */

   Vector.dot = function dot(v1, v2) {
      return Vector.reducePair(v1, v2, function(acc, val1, val2) {
         return acc + val1 * val2;
      }, 0, true);
   };

   // Alias for `Vector.reduce`
   Vector.foldl = Vector.reduce;

   Vector.map = function map(v, f, skipZeros) {
      if (skipZeros && isSparse(v)) { return SparseV.map(v, f); }
      return new Vector(function(i) { return f(v.get(i), i); }, v.length);
   };

   // p should be >0 or Infinity
   Vector.norm = function(v1, p) {
      var res;
      if (p == null) { p = 2; }
      if (p === Infinity) {
         return v1.reduce(function(acc, v) {
            return Math.max(acc, Math.abs(v));
         }, 0, true);
      }
      res = v1.reduce(function(acc, v) {
         return acc + Math.pow(Math.abs(v), p);
      }, 0, true);
      return Math.pow(res, 1 / p);
   };

   /* Vector.prototype methods */

   // Get the entry at index `i` of the vector. Vector indexing begins from 1
   /* eslint-disable complexity */
   Vector.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      if (!this.values) { this.values = []; }
      if (this.values[i - 1] == null) {
         this.values[i - 1] = this.compute(i) || 0;
      }
      return this.values[i - 1];
   };
   /* eslint-enable */

   // Set the entry at index `i` of the vector. Users should avoid calling this method.
   Vector.prototype.set = function set(i, v) {
      if ( i >= 1 && i <= this.length) {
         if (!this.values) { this.values = []; }
         this.values[i - 1] = v || 0;
      }
      return this;
   };

   // Compute the entry at index `i` of the vector. This is meant to be used internally by
   // `Vector#get` to obtain the correct value in cases where the values are stored _lazily_.
   Vector.prototype.compute = function compute(i) {

      throw new Error('Subclasses of Vector need to implement compute: ' +
         this.constructor.name);
   };

   // Delegates to `Vector.forEach`. Chainable.
   Vector.prototype.forEach = function forEach(f, skipZeros) {
      Vector.forEach(this, f, skipZeros);
      return this;
   };

   // Delegates to `Vector.forEachPair`. Chainable.
   Vector.prototype.forEachPair = function forEachPair(v2, f, skipZeros) {
      Vector.forEachPair(this, v2, f, skipZeros);
      return this;
   };

   // Delegates to `Vector.reduce`.
   Vector.prototype.reduce = function reduce(f, initial, skipZeros) {
      return Vector.reduce(this, f, initial, skipZeros);
   };

   // Delegates to `Vector.reducePair`.
   Vector.prototype.reducePair = function reduce(v2, f, initial, skipZeros) {
      return Vector.reducePair(this, v2, f, initial, skipZeros);
   };

   // Alias for `Vector.prototype.reduce`
   Vector.prototype.foldl = Vector.prototype.reduce;

   Vector.prototype.map = function map(f, skipZeros) {
      return Vector.map(this, f, skipZeros);
   };

   // Vector operations

   Vector.prototype.norm = function(p) {
      return Vector.norm(this, p);
   };

   Vector.prototype.dot = function(v2) {
      return Vector.dot(this, v2);
   };

   Vector.prototype.toArray = function toArray() {
      var arr = [];
      this.forEach(arr.push);
      return arr;
   };

   /* Helper functions */

   function sameLength(a, b) {
      return a.length === b.length;
   }

   function isSparse(a) {
      return a instanceof SparseV;
   }

   return Vector;

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
