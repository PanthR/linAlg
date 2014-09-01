/**
 * Javascript implementation of Linear Algebra Matrices.
 * @module Matrix
 * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
 */
(function(define) {'use strict';
define(function(require) {

   var op;

   op = require('./utils').op;
   /**
    * The `Matrix` class is a representation of 2-dimensional algebraic matrices
    * with real entries. Their values are internally represented as `Vector`s.
    * Matrices contain the following properties:
    *
    * - A `values` property, containing a vector representing the values.
    * - `nrow` and `ncol` integer properties, representing the number of rows and columns respectively.
    * - A `byRow` boolean property, determining if the matrix's values are stored in the vector
    * "1 row at a time" or "1 column at a time". This defaults to false for most matrices, meaning
    * column-wise storage.
    *
    * New `Matrix` objects are created via the `Matrix` constructor, which accepts a number of options
    * for its first argument, `arr`:
    *
    * 1. Called with another `Matrix`, returns a "copy/clone".
    * 2. Called with a single array of values, constructs a matrix based on these values. The dimensions
    * and other properties of this array are determined by the second argument, which is an object
    * `options` containg one or more of the keys `nrow`, `ncol`, `byRow`.
    * 3. Called with an array of arrays of values, it constructs a matrix with columns based on arrays.
    * The number of arrays (length of `arr`) becomes `ncol`. The arrays in `arr` are expected to have
    * the same length, and that becomes `nrow`. The options object is optional, but may contain a "byRow"
    * entry, which if `true` indicates that the roles of `column` and `row` would be interchanged, i.e.
    * the arrays in `arr` would become rows instead of columns.
    * 4. Called with a function `f(i,j)`, it uses that function to determine the `Matrix`'s values. In
    * that case an `options` second argument specifying `nrow` and `ncol` is needed.
    *
    */
   function Matrix(arr, options) {
      if (Array.isArray(arr)) {
         return new Matrix.DenseM(arr, options);
      }
      if (typeof arr === 'function') {
         return new Matrix.TabularM(arr, options);
      }
      return new Matrix.SparseM(arr, options);
   }

   Matrix.Vector   = require('./vector');
   /**
    * Subclass of `Matrix` representing "dense" matrices.
    * Dense matrices are internally stored simply as Javascript Arrays.
    * Users should not need to access this directly.
    */
   Matrix.DenseM   = require('./matrix/dense')(Matrix);
   /**
    * Subclass of `Matrix` representing "sparse" matrices.
    * Sparce matrices are stored as objects, whose keys represent the indices
    * that have non-zero values.
    * Users should not need to access this directly.
    */
   Matrix.SparseM  = require('./matrix/sparse')(Matrix);
   /**
    * Subclass of `Matrix` representing matrices whose values are specified via
    * a function `f(i)` of the index.
    * The values of the matrix are computed lazily, only when they are accessed.
    * Users should not need to access this directly.
    */
   Matrix.TabularM = require('./matrix/tabular')(Matrix);
   /**
    * Subclass of `Matrix` representing diagonal matrices.
    * Users should not need to access this directly.
    */
   Matrix.DiagM    = require('./matrix/diag')(Matrix);

   Matrix.prototype.get = function get(i, j) {
      return this._get(i, j);
   };
   Matrix.prototype._get = function _get(i, j) {
      var n;
      if ( i < 1 || i > this.nrow) { return 0; }
      if ( j < 1 || j > this.ncol) { return 0; }
      return this.values.get(this.toIndex(i, j));
   };
   /**
    * Return the vector index that would correspond to the i-th row and j-th column.
    * This is used to access the appropriate location in the vector that represents
    * the matrix's values.
    */
   Matrix.prototype.toIndex = function toIndex(i, j) {
      return this.byRow ? (i - 1) * this.ncol + j : (j - 1) * this.nrow + i;
   };
   /**
    * Return the pair i, j corresponding to the vector index `n`. This is the inverse
    * process to `Matrix.prototype.toIndex`.
    */
   Matrix.prototype.fromIndex = function fromIndex(n) {
      if (this.byRow) {
         return { i: Math.floor((n - 1) / this.ncol) + 1, j: (n - 1) % this.ncol + 1 };
      }
      return { i: (n - 1) % this.nrow + 1, j: Math.floor((n - 1) / this.nrow) + 1 };
   };

   /**
    * TODO: Find a way to add this the Vector docs
    */
    Matrix.Vector.prototype.outer = function outer(v2, f) {
       var tabf;
       f = op[f] != null ? op[f] : f || op.mult;
       tabf = function(i, j) { return f(this.get(i), v2.get(j), i, j); }.bind(this);
       return new Matrix(tabf, { nrow: this.length, ncol: v2.length });
    };

   return Matrix;
});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
