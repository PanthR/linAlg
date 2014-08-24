(function(define) {'use strict';
define(function(require) {

   /**
    * Javascript implementation of Linear Algebra Vectors.
    * @module LinAlg
    * @version 0.0.1
    * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
    */
   var DenseV, SparseV, TabularV, ConstV;

   /**
    * `Vector` objects are Javascript representations of real-valued vectors.
    * They are constructed in one of three ways depending on the type of the first parameter `arr`:
    * 1. Based on an array of values. In this case, the resulting vector length `len` is optional.
    * 2. Based on a key-value object representing the non-zero indices and their values (sparse vectors)
    * 3. Based on a function `f(n)` describing how the i-th index is meant to be computed.
    *
    * `Vector` objects are 1-indexed. By default, they are immutable structures, they cannot be edited
    * once created. See `Vector.MutableV` for a description of mutable vectors.
    *
    * @example
    * var v1 = new Vector([3, 5, 1, 2]);          // A length-4 vector
    * var v2 = new Vector({ 4: 10, 2: 12 }, 10);  // A length-10 sparse vector
    * var v3 = new Vector(Math.exp, 3);           // A length-3 vector with values e(1), e(2), e(3)
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

   Vector.DenseV   = DenseV   = require('./vector/dense')(Vector);
   Vector.SparseV  = SparseV  = require('./vector/sparse')(Vector);
   Vector.TabularV = TabularV = require('./vector/tabular')(Vector);
   Vector.ConstV   = ConstV   = require('./vector/const')(Vector);

   /**
    * Every vector has a fixed `length`. Vectors of length 0 are allowed,
    * though there is not much one can do with them.
    * @member length
    * @instance
    */

   /** ## Vector dispatch class methods */

   /**
    * Execute the function `f` for each entry from the vector `v`,
    * starting with the entry with index 1. `f` will be called as `f(value, index)`.
    * If `skipZeros` is `true`, then the system _may_ skip the execution
    * of `f` for zero-entries.
    */
   Vector.forEach = function forEach(v, f, skipZeros) {
      return v.constructor.forEach(v, f, skipZeros);
   };

   /**
    * Execute the function `f` for each pair of corresponding entries from the
    * vectors `v1` and `v2`, starting with the entries with index 1.
    * `f` will be called as `f(value1, value2, index)`, where `value1`, `value2`
    * are the entries of the vectors `v1`, `v2` at index `i`.
    * If `skipZeros` is `true`, then the system _may_ skip the execution of `f` when
    * one of the values is 0.
    */
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

   /**
    * Similar to `Array.prototype.reduce`. Given a function `f(acc, val, i)` and an
    * `initial` value, it successively calls the function on the vector's entries,
    * storing each result in the variable `acc`, then feeding that value back.
    * If `skipZeros` is `true`, this operation _may_ skip any zero entries.
    * `initial` and `acc` do not have to be numbers, but they do need to have the
    * same type, and `f` should return that same type.
    * @example
    * var a = new Vector([1,2,3]);
    * function add(acc, val) { return acc + val; };
    * a.reduce(add, 4);     // Equivalent to (((4 + 1) + 2) + 3)
    */
   Vector.reduce = function reduce(v, f, initial, skipZeros) {
      initial = initial || 0;
      v.forEach(function(val, i) {
         initial = f(initial, val, i);
      }, skipZeros);
      return initial;
   };

   /* eslint-disable max-params */
   /**
    * Similar to `Vector.reduce` but acts on a pair of vectors `v1`, `v2`.
    * The signature of the function `f` would be `f(acc, val1, val2, i)` where `acc`
    * is the accumulated value, `i` is the index, and `val1`, `val2` are the `i`-indexed
    * values from `v1`, `v2`. If `skipZeros` is `true`, the implementation _may_ avoid
    * calling `f` for an index `i` if one of the values there is 0.
    *
    * The vectors `v1`, `v2` need to have the same length.
    * @example
    * function f(acc, val1, val2) = { return acc + val1 * val2; };
    * a.reducePair(v1, v2, f, 0)   // Computes the dot product of v1, v2.
    */
   Vector.reducePair = function reducePair(v1, v2, f, initial, skipZeros) {
      initial = initial || 0;
      Vector.forEachPair(v1, v2, function(val1, val2, i) {
         initial = f(initial, val1, val2, i);
      }, skipZeros);
      return initial;
   };
   /* eslint-enable */

   /** Alias for `Vector.reduce`. */
   Vector.foldl = Vector.reduce;

   /**
    * Create a new vector by applying the function `f` to all elements of `v`.
    * The function `f` has the signature `f(val, i)`.
    * If `skipZeros` is `true`, the operation may assume that `f(0, i)=0` and
    * may choose to skip those computations.
    *
    * `Vector.map` only returns a "promise" to compute the resulting vector.
    * The implementation may choose to not actually compute values `f` until
    * they are actually needed. Users should not rely on side-effects of `f`.
    */
   Vector.map = function map(v, f, skipZeros) {
      if (skipZeros && isSparse(v)) { return SparseV.map(v, f); }
      return new Vector(function(i) { return f(v.get(i), i); }, v.length);
   };

   /**
    * Like `Vector.map`, but the function `f` acts on two vectors, with signature
    * `f(val1, val2, i)`. If `skipZeros` is `true`, the implementation may
    * assume that `f` will return 0 as long as one of the values is 0.
    */
   Vector.mapPair = function mapPair(v1, v2, f, skipZeros) {
      if (!sameLength(v1, v2)) {
         throw new Error('Vector.mapPair: vectors should be same langth');
      }
      if (skipZeros && (isSparse(v1) || isSparse(v2))) {
         return SparseV.mapPair(v1, v2, f);
      }
      return new Vector(function(i) {
         return f(v1.get(i), v2.get(i), i);
      }, v1.length);
   };

   /**
    * Compute the p-norm of the vector `v1`. `p` should be a positive
    * number or `Infinity`. Defaults to the 2-norm.
    */
   Vector.norm = function norm(v1, p) {
      var res;
      if (p == null) { p = 2; }
      if (p === Infinity) {
         return v1.reduce(function(acc, val) {
            return Math.max(acc, Math.abs(val));
         }, 0, true);
      }
      res = v1.reduce(function(acc, val) {
         return acc + Math.pow(Math.abs(val), p);
      }, 0, true);
      return Math.pow(res, 1 / p);
   };

   /** Compute the dot product of two vectors `v1`, `v2`. */
   Vector.dot = function dot(v1, v2) {
      return Vector.reducePair(v1, v2, function(acc, val1, val2) {
         return acc + val1 * val2;
      }, 0, true);
   };

   /**
    * Create a vector that follows a linear progression starting from `a` increasing
    * by `step` amount, and ending the moment `b` is exceeded.
    *
    * If `step` is omitted, it defaults to 1 or -1 depending on the relation between
    * `a` and `b`. If `b` is also omitted, then the vector generated is `1,2,...,a`.
    * @example
    * Vector.seq(1,6,2)  // Produces [1, 3, 5]
    * Vector.seq(5,1)    // Produces [5, 4, 3, 2, 1]
    * Vector.seq(3)      // Produces [1, 2, 3]
    */
   Vector.seq = function seq(a, b, step) {
      var length;
      if (arguments.length === 0) { return new Vector([]); }
      if (arguments.length === 1) { b = a; a = 1; step = 1; length = b; }
      if (b === a) { return new Vector([a]); }
      step = step || (b > a ? 1 : -1);
      length = Math.floor((b - a) / step) + 1;
      return new Vector(function(i) { return a + (i - 1) * step; }, length);
   };

   /**
    * Generates a constant vector of length `len`, with all entries having value `val`.
    */
   Vector.const = function constant(val, len) {
      return new ConstV(val, len);
   };

   /**
    * Generates a constant vector of length `len`, with all entries having value 1.
    */
   Vector.ones = function ones(len) {
      return new ConstV(1, len);
   };

   /** ## Pointwise vector operations */

   /** Pointwise add two vectors. */
   Vector.pAdd = function pAdd(v1, v2) {
      return Vector.mapPair(v1, v2, add, false);
   };

   /** Pointwise subtract two vectors. */
   Vector.pSub = function pSub(v1, v2) {
      return Vector.mapPair(v1, v2, sub, false);
   };

   /** Multiply the vector `v` by the constant `a`. */
   Vector.sMult = function sMult(a, v) {
      return Vector.map(v, function(val) { return a * val; }, true);
   };

   /** Pointwise multiply two vectors. */
   Vector.pMult = function pMult(v1, v2) {
      return Vector.mapPair(v1, v2, mult, true);
   };

   /** Pointwise divide two vectors. */
   Vector.pDiv = function pDiv(v1, v2) {
      return Vector.mapPair(v1, v2, divide, false);
   };

   /** Raise each entry in `v` to the `n`-th power. Return the resulting vector. */
   Vector.pPow = function pPow(v, n) {
      return Vector.map(v, function(val) { return Math.pow(val, n); }, n > 0);
   };

   /** ## Other vector methods */

   /**
    * Compute consecutive differences of the values in the vector.
    * @example
    * var v = new Vector([1,1,3,4]);
    * v.diff()   // Produces [0, 2, 1]
    */
   Vector.diff = function diff(v) {
      return new Vector(function(i) {
         return v.get(i + 1) - v.get(i);
      }, v.length - 1);
   };

   /**
    * Create a new vector by accumulating one by one the results
    * `f(acc, val, i)` as `val` ranges over the values of the vector `v`,
    * starting with the value `initial`. This is effectively a version of
    * `Vector.reduce` where each intermediate step is stored.
    * @example
    * var v = new Vector([1, 2, 3]);
    * function f(acc, val) { return acc + val * val; }
    * Vector.cumulative(v, f, 2)  // Produces [3, 7, 16]
    */
   Vector.cumulative = function cumulative(v, f, initial) {
      var arr = [];
      v.reduce(function(acc, val, i) {
         acc = f(acc, val, i);
         arr.push(acc);
         return acc;
      }, initial || 0, false);
      return new Vector(arr);
   };

   /**
    * Create a new vector from the partial sums in `v`.
    * @example
    * new Vector([1, 2, 3]).cumSum()  // Produces [1, 3, 6]
    */
   Vector.cumSum = function cumSum(v) {
      return Vector.cumulative(v, add, 0);
   };

   /**
    * Create a new vector from the partial products in `v`.
    * @example
    * new Vector([2, 3, 3]).cumProd()  // Produces [2, 6, 18]
    */
   Vector.cumProd = function cumProd(v) {
      return Vector.cumulative(v, mult, 1);
   };

   /**
    * Create a new vector from the partial minimums in `v`.
    * @example
    * new Vector([2, 1, 3]).cumMin()  // Produces [2, 1, 1]
    */
   Vector.cumMin = function cumMin(v) {
      return Vector.cumulative(v, function(a, b) {
         return Math.min(a, b);
      }, Infinity);
   };

   /**
    * Create a new vector from the partial maximums in `v`.
    * @example
    * new Vector([2, 1, 3]).cumMax()  // Produces [2, 2, 3]
    */
   Vector.cumMax = function cumMax(v) {
      return Vector.cumulative(v, function(a, b) {
         return Math.max(a, b);
      }, -Infinity);
   };

   /** Vector.prototype methods */

   /**
    * Get the entry at index `i` of the vector. Vector indexing begins from 1.
    * Users should always go through this method when accessing values of the vector.
    */
   Vector.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      if (!this.values) { this.values = []; }
      if (this.values[i - 1] == null) {
         this.values[i - 1] = this.compute(i);
      }
      return this.values[i - 1];
   };

   /**
    * Set the entry at index `i` of the vector. Users should avoid calling this method.
    * TODO: This will be moved to the MutableV subclass
    */
   Vector.prototype.set = function set(i, v) {
      if ( i >= 1 && i <= this.length) {
         if (!this.values) { this.values = []; }
         this.values[i - 1] = v || 0;
      }
      return this;
   };

   /** Force a vector to be evaluated. */
   Vector.prototype.force = function force() {
      return this;  // stub; overridden in some subclasses
   };

   /**
    * Compute the entry at index `i` of the vector. This method is used internally
    * by `Vector#get` to obtain the correct value in cases where the vector values
    * are stored _lazily_. Users should not call it directly.
    * Use `Vector.prototype.get` instead.
    * @private
    */
   Vector.prototype.compute = function compute(i) {

      throw new Error('Subclasses of Vector need to implement compute: ' +
         this.constructor.name);
   };

   /** Delegates to `Vector.forEach`. Chainable. */
   Vector.prototype.forEach = function forEach(f, skipZeros) {
      Vector.forEach(this, f, skipZeros);
      return this;
   };

   /** Delegates to `Vector.forEachPair`. Chainable. */
   Vector.prototype.forEachPair = function forEachPair(v2, f, skipZeros) {
      Vector.forEachPair(this, v2, f, skipZeros);
      return this;
   };

   /** Delegates to `Vector.reduce`. */
   Vector.prototype.reduce = function reduce(f, initial, skipZeros) {
      return Vector.reduce(this, f, initial, skipZeros);
   };

   /** Delegates to `Vector.reducePair`. */
   Vector.prototype.reducePair = function reduce(v2, f, initial, skipZeros) {
      return Vector.reducePair(this, v2, f, initial, skipZeros);
   };

   /** Alias for `Vector.prototype.reduce`. */
   Vector.prototype.foldl = Vector.prototype.reduce;

   /** Delegates to `Vector.map`. */
   Vector.prototype.map = function map(f, skipZeros) {
      return Vector.map(this, f, skipZeros);
   };

   /** Delegates to `Vector.mapPair`. */
   Vector.prototype.mapPair = function mapPair(v2, f, skipZeros) {
      return Vector.mapPair(this, v2, f, skipZeros);
   };

   /** ## Vector operations */

   /** Delegates to `Vector.norm`. */
   Vector.prototype.norm = function norm(p) {
      return Vector.norm(this, p);
   };

   /** Delegates to `Vector.dot`. */
   Vector.prototype.dot = function dot(v2) {
      return Vector.dot(this, v2);
   };

   /** Return a Javascript array of the vector's values. */
   Vector.prototype.toArray = function toArray() {
      var arr = [];
      this.forEach(function(val) { arr.push(val); });
      return arr;
   };

   /** Vector arithmetic operations. */

   /** Delegates to `Vector.pAdd`. */
   Vector.prototype.pAdd = function pAdd(v2) {
      return Vector.pAdd(this, v2);
   };

   /** Delegates to `Vector.pSub`. */
   Vector.prototype.pSub = function pSub(v2) {
      return Vector.pSub(this, v2);
   };

   /** Delegates to `Vector.sMult`. */
   Vector.prototype.sMult = function sMult(a) {
      return Vector.sMult(a, this);
   };

   /** Delegates to `Vector.pMult`. */
   Vector.prototype.pMult = function pMult(v2) {
      return Vector.pMult(this, v2);
   };

   /** Delegates to `Vector.pDiv`. */
   Vector.prototype.pDiv = function pDiv(v2) {
      return Vector.pDiv(this, v2);
   };

   /** Delegates to `Vector.pPow`. */
   Vector.prototype.pPow = function pPow(n) {
      return Vector.pPow(this, n);
   };

   /** ## Other Vector prototype methods */

   /** Delegates to `Vector.diff`. */
   Vector.prototype.diff = function diff() {
      return Vector.diff(this);
   };

   /** Delegates to `Vector.cumulative`. */
   Vector.prototype.cumulative = function cumulative(f, initial) {
      return Vector.cumulative(this, f, initial);
   };

   /** Delegates to `Vector.cumSum`. */
   Vector.prototype.cumSum = function cumSum() {
      return Vector.cumSum(this);
   };

   /** Delegates to `Vector.cumProd`. */
   Vector.prototype.cumProd = function cumProd() {
      return Vector.cumProd(this);
   };

   /** Delegates to `Vector.cumMin`. */
   Vector.prototype.cumMin = function cumMin() {
      return Vector.cumMin(this);
   };

   /** Delegates to `Vector.cumMax`. */
   Vector.prototype.cumMax = function cumMax() {
      return Vector.cumMax(this);
   };

   // Helper functions

   function sameLength(a, b) {
      return a.length === b.length;
   }

   function isSparse(a) {
      return a instanceof SparseV;
   }

   // Arithmetic

   function add(a, b) { return a + b; }
   function sub(a, b) { return a - b; }
   function mult(a, b) { return a * b; }
   function divide(a, b) { return a / b; }

   return Vector;

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
