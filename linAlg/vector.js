(function(define) {'use strict';
define(function(require) {

   /**
    * Javascript implementation of Linear Algebra Vectors.
    * @module Vector
    * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
    */
   var Vector;

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
    * Every vector has a fixed `length`, accessed as a property.
    * Vectors of length 0 are allowed, though there is not much one can do with them.
    *
    *     // A length-4 vector
    *     var v1 = new Vector([3, 5, 1, 2]);
    *     // A length-10 sparse vector
    *     var v2 = new Vector({ 4: 10, 2: 12 }, 10);
    *     // A length-3 vector with values exp(1), exp(2), exp(3)
    *     var v3 = new Vector(Math.exp, 3);
    *     v3.length === 3  // true
    */
   function Vector(arr, len) {
      if (Array.isArray(arr)) {
         return new Vector.DenseV(arr);
      }
      if (typeof arr === 'function') {
         return new Vector.TabularV(arr, len);
      }
      return new Vector.SparseV(arr, len);
   }

   /** Subclass of `Vector` representing "dense" vectors.
    * Dense vectors are internally stored simply as Javascript Arrays
    * Users should not need to access this directly.
    */
   Vector.DenseV = require('./vector/dense')(Vector);

   /** Subclass of `Vector` representing "sparse" vectors.
    * Sparce vectors are stored as objects, whose keys represent the indices
    * that have non-zero values.
    * Users should not need to access this directly.
    */
   Vector.SparseV = require('./vector/sparse')(Vector);

   /** Subclass of `Vector` representing vectors whose values are specified via
    * a function `f(i)` of the index.
    * The values of the vector are computed lazily, only when they are accessed.
    * Users should not need to access this directly.
    */
   Vector.TabularV = require('./vector/tabular')(Vector);
    /** Subclass of `Vector` representing efficiently vectors all of whose
     * values are meant to be the same number.
     * Users should not need to access this directly.
     * Use `Vector.const` or `Vector.ones` instead.
     */
   Vector.ConstV = require('./vector/const')(Vector);
   Vector.ViewV = require('./vector/view')(Vector);

   /**
    * Create a vector that follows a linear progression starting from `a` increasing
    * by `step` amount, and ending the moment `b` is exceeded.
    *
    * If `step` is omitted, it defaults to 1 or -1 depending on the relation between
    * `a` and `b`. If `b` is also omitted, then the vector generated is `1,2,...,a`.
    *
    *     Vector.seq(1, 6, 2)  // Produces [1, 3, 5]
    *     Vector.seq(5, 1)     // Produces [5, 4, 3, 2, 1]
    *     Vector.seq(3)        // Produces [1, 2, 3]
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
      return new Vector.ConstV(val, len);
   };

   /**
    * Generates a constant vector of length `len`, with all entries having value 1.
    *
    *     // Sums all elements of v1
    *     Vector.ones(v1.length).dot(v1)
    */
   Vector.ones = function ones(len) {
      return new Vector.ConstV(1, len);
   };

   // Vector.prototype methods

   /**
    * Get the entry at index `i` of the vector. Vector indexing begins from 1.
    * Users should always go through this method when accessing values of the vector.
    *
    *     v1.get(1) === 3;
    *     v1.get(2) === 5;
    *     // Out of range defaults to 0
    *     v1.get(0) === 0;
    *     v1.get(5) === 0;
    */
   Vector.prototype.get = function get(i) {
      if ( i < 1 || i > this.length) { return 0; }
      if (!this.values) { this.values = []; }
      if (!this.cached && this.values[i - 1] == null) {
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

   /**
    * Force a vector to be evaluated. This resolves any deferred calculations
    * needed for the computation of the vector's elements.
    */
   Vector.prototype.force = function force() {
      return this;  // stub; overridden in some subclasses
   };

   /**
    * Compute the entry at index `i` of the vector. This method is used internally
    * by `Vector.prototype.get` to obtain the correct value in cases where the vector
    * values are stored _lazily_. Users should not call it directly.
    * Use `Vector.prototype.get` instead.
    * @private
    */
   Vector.prototype.compute = function compute(i) {
      throw new Error('Subclasses of Vector need to implement compute: ' +
         this.constructor.name);
   };

   /**
    * Execute the function `f` for each entry from `this`,
    * starting with the entry with index 1. `f` will be called as `f(value, index)`.
    * If `skipZeros` is `true`, then the system _may_ skip the execution
    * of `f` for zero-entries.
    *
    *     // Prints: 3 1, 5 2, 1 3, 2 4
    *     v.each(console.log);
    */
   Vector.prototype.each = function each(f, skipZeros) {
      throw new Error('Subclasses of Vector need to implement each: ' +
         this.constructor.name);
   };

   /**
    * Execute the function `f` for each pair of corresponding entries from the
    * vectors `v1` and `v2`, starting with the entries with index 1.
    * `f` will be called as `f(value1, value2, index)`, where `value1`, `value2`
    * are the entries of the vectors `v1`, `v2` at index `i`.
    * If `skipZeros` is `true`, then the system _may_ skip the execution of `f` when
    * one of the values is 0.
    *
    *     // Prints 3 3 1, 5 5 2, 1 1 3, 2 2 4
    *     v1.eachPair(v1, console.log);
    */
   Vector.prototype.eachPair = function eachPair(v2, f, skipZeros) {
      if (!this.sameLength(v2)) {
         throw new Error('Vector#eachPair: vectors should be same langth');
      }
      if (v2.isSparse()) {
         v2.eachPair(this, swap(f), skipZeros); return this;
      }
      this.each(function(val, i) {
         f(val, v2.get(i), i);
      });
      return this;
   };

   /**
    * Similar to `Array.prototype.reduce`. Given a function `f(acc, val, i)` and an
    * `initial` value, it successively calls the function on the vector's entries,
    * storing each result in the variable `acc`, then feeding that value back.
    * If `skipZeros` is `true`, this operation _may_ skip any zero entries.
    * `initial` and `acc` do not have to be numbers, but they do need to have the
    * same type, and `f` should return that same type.
    *
    *     function add(acc, val) { return acc + val; };
    *     // Equivalent to ((((4 + 3) + 5) + 1) + 2)
    *     v1.reduce(add, 4);
    */
   Vector.prototype.reduce = function reduce(f, initial, skipZeros) {
      initial = initial || 0;
      this.each(function(val, i) {
         initial = f(initial, val, i);
      }, skipZeros);
      return initial;
   };

   /**
    * Similar to `Vector.prototype.reduce` but acts on a pair of vectors `v1`, `v2`.
    * The signature of the function `f` would be `f(acc, val1, val2, i)` where `acc`
    * is the accumulated value, `i` is the index, and `val1`, `val2` are the `i`-indexed
    * values from `v1`, `v2`. If `skipZeros` is `true`, the implementation _may_ avoid
    * calling `f` for an index `i` if one of the values there is 0.
    *
    * The vectors `v1`, `v2` need to have the same length.
    *
    *     function f(acc, val1, val2) = { return acc + val1 * val2; };
    *     // Computes the dot product of v1, v2.
    *     v1.reducePair(v2, f, 0)
    */
   Vector.prototype.reducePair = function reducePair(v2, f, initial, skipZeros) {
      initial = initial || 0;
      this.eachPair(v2, function(val1, val2, i) {
         initial = f(initial, val1, val2, i);
      }, skipZeros);
      return initial;
   };

   /** Alias for `Vector.prototype.reduce`. */
   Vector.prototype.foldl = Vector.prototype.reduce;

   /**
    * Create a new vector by applying the function `f` to all elements of `this`.
    * The function `f` has the signature `f(val, i)`.
    * If `skipZeros` is `true`, the operation may assume that `f(0, i)=0` and
    * may choose to skip those computations.
    *
    * `Vector#map` only returns a "promise" to compute the resulting vector.
    * The implementation may choose to not actually compute values `f` until
    * they are actually needed. Users should not rely on side-effects of `f`.
    *
    *     // Results in [4, 7, 4, 6];
    *     v1.map(function(val, i) { return val + i; });
    */
   Vector.prototype.map = function map(f, skipZeros) {
      var f2 = function(i) { return f(this.get(i), i); }.bind(this);
      return new Vector(f2, this.length);
   };


   /**
    * Like `Vector.map`, but the function `f` acts on two vectors, with signature
    * `f(val1, val2, i)`. If `skipZeros` is `true`, the implementation may
    * assume that `f` will return 0 as long as one of the values is 0.
    */
   Vector.prototype.mapPair = function mapPair(v2, f, skipZeros) {
      if (!this.sameLength(v2)) {
         throw new Error('Vector.mapPair: vectors should be same langth');
      }
      if (skipZeros && v2.isSparse()) {
         return v2.mapPair(this, swap(f), skipZeros);
      }
      return new Vector(function(i) {
         return f(this.get(i), v2.get(i), i);
      }.bind(this), this.length);
   };

   // Vector operations

   /**
    * Compute the p-norm of the vector. `p` should be a positive
    * number or `Infinity`. Defaults to the 2-norm.
    *
    *     v.norm(1)        // 1-norm (sum of absolute values)
    *     v.norm()           // 2 norm (usual formula)
    *     v.norm(Infinity) // Infinity (max) norm
    */
   Vector.prototype.norm = function norm(p) {
      var res;
      if (p == null) { p = 2; }
      if (p === Infinity) {
         return this.reduce(function(acc, val) {
            return Math.max(acc, Math.abs(val));
         }, 0, true);
      }
      res = this.reduce(function(acc, val) {
         return acc + Math.pow(Math.abs(val), p);
      }, 0, true);
      return Math.pow(res, 1 / p);
   };

   /**
    * Compute the dot product of `this` with `v`.
    *
    *     // Returns 3 * 3 + 5 * 5 + 1 * 1 + 2 * 2
    *     v1.dot(v1);
    */
   Vector.prototype.dot = function dot(v) {
      return this.reducePair(v, function(acc, val1, val2) {
         return acc + val1 * val2;
      }, 0, true);
   };

   /**
    * Return a Javascript array of the vector's values. Returns a new
    * Array object every time.
    */
   Vector.prototype.toArray = function toArray() {
      if (this.cached) { return this.values.slice(); }
      var arr = [];
      this.each(function(val) { arr.push(val); });
      return arr;
   };

   // Vector arithmetic operations.

   /** Pointwise add two vectors. */
   Vector.prototype.pAdd = function pAdd(v) {
      return this.mapPair(v, add, false);
   };

   /** Pointwise subtract two vectors. */
   Vector.prototype.pSub = function pSub(v) {
      return this.mapPair(v, sub, false);
   };

   /** Multiply the vector `v` by the constant `a`. */
   Vector.prototype.sMult = function sMult(a) {
      return this.map(function(val) { return a * val; }, true);
   };

   /** Pointwise multiply two vectors. */
   Vector.prototype.pMult = function pMult(v) {
      return this.mapPair(v, mult, true);
   };

   /** Pointwise divide two vectors. */
   Vector.prototype.pDiv = function pDiv(v) {
      return this.mapPair(v, divide, false);
   };

   /** Raise each entry in `v` to the `n`-th power. Return the resulting vector. */
   Vector.prototype.pPow = function pPow(n) {
      return this.map(function(val) { return Math.pow(val, n); }, n > 0);
   };

   // Other Vector prototype methods

   /**
    * Compute consecutive differences of the values in the vector.
    *
    *     // Both produce: [2, -4, 1]
    *     Vector.diff(v1);
    *     v1.diff();
    *     v1.diff().length === v1.length - 1 // true
    */
   Vector.prototype.diff = function diff() {
      return new Vector(function(i) {
         return this.get(i + 1) - this.get(i);
      }.bind(this), this.length - 1);
   };

   /**
    * Create a new vector by accumulating one by one the results
    * `f(acc, val, i)` as `val` ranges over the values of the vector,
    * starting with the value `initial`. This is effectively a version of
    * `Vector.reduce` where each intermediate step is stored.
    *
    *     function f(acc, val) { return acc + val * val; }
    *     v1.cumulative(f, 2);  // Produces [11, 36, 37, 41]
    */
   Vector.prototype.cumulative = function cumulative(f, initial) {
      var arr = [];
      this.reduce(function(acc, val, i) {
         acc = f(acc, val, i);
         arr.push(acc);
         return acc;
      }, initial || 0, false);
      return new Vector(arr);
   };

   /**
    * Create a new vector from the partial sums in the vector.
    *
    *     // Both produce [3, 8, 9, 11]
    *     Vector.prototype.cumSum(v1);
    *     v1.cumSum();
    */
   Vector.prototype.cumSum = function cumSum() {
      return this.cumulative(add, 0);
   };

   /**
    * Create a new vector from the partial products in the vector.
    *
    *     v1.cumProd(); // Produces [3, 15, 15, 30]
    */
   Vector.prototype.cumProd = function cumProd() {
      return this.cumulative(mult, 1);
   };

   /**
    * Create a new vector from the partial minimums in the vector.
    *
    *     v1.cumMin(); // Produces [3, 5, 1, 1]
    */
   Vector.prototype.cumMin = function cumMin() {
      return this.cumulative(function(a, b) {
         return Math.min(a, b);
      }, Infinity);
   };

   /**
    * Create a new vector from the partial maximums in the vector.
    *
    *     v1.cumMax(); // Produces [3, 5, 5, 5]
    */
   Vector.prototype.cumMax = function cumMax() {
      return this.cumulative(function(a, b) {
         return Math.max(a, b);
      }, -Infinity);
   };

   Vector.prototype.isSparse = function isSparse() {
      return false;
   };

   Vector.prototype.sameLength = function sameLength(b) {
      return this.length === b.length;
   };

   // Helper functions

   function swap(f) {
      return function(b, a, i) { return f(a, b, i); };
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
