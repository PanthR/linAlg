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
    * The methods `Matrix.prototype.fromIndex` and `Matrix.prototype.toIndex` may be used to
    * relate a pair of indices `(i, j)` of the matrix to the index location in the `this.values`
    * vector where the related matrix value is stored.
    *
    * New `Matrix` objects are created via the `Matrix` constructor, which accepts a number of options
    * for its first argument, `arr`:
    *
    * 1. Called with another `Matrix`, simply returns the matrix itself.
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

   /**
    * This is the class `Vector` as it is accessed from `Matrix`.
    */
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
   /**
    * Subclass of `Matrix` representing Submatrix views into another Matrix. Changes
    * to the view are reflected on the original matrix and vice-versa. Use
    * `Matrix.prototype.view` to create these. If you want to create vector views into
    * a row or column of a matrix, use `Matrix.prototype.rowView` or
    * `Matrix.prototype.colView` instead.
    */
   Matrix.ViewM    = require('./matrix/view')(Matrix);

   /**
    * Return the value at the `(i, j)` entry of the matrix. When called with no
    * arguments, it returns an array of arrays of all the matrix's values.
    */
   Matrix.prototype.get = function get(i, j) {
      return this._get(i, j);
   };

   /**
    * Internally used by `Matrix.prototype.get`. There should be no need for users
    * to call this method.
    */
   Matrix.prototype._get = function _get(i, j) {
      var n;
      if ( i < 1 || i > this.nrow) { return 0; }
      if ( j < 1 || j > this.ncol) { return 0; }
      return this.values.get(this.toIndex(i, j));
   };

   /**
    * Set the value of the matrix at the `(i, j)` entry to `val`.
    *
    * If instead there is only one argument, then it may be a function `f(i, j)`, or
    * a single value, or a `Matrix` with the same dimensions, it will be used to set
    * all the values of the Matrix `this`.
    */
   Matrix.prototype.set = function set(i, j, val) {
      function changeAll(target, vals) {
         var row, col;
         function makeLookup(vals) {
            if (typeof vals === 'function') { return vals; }
            if (vals instanceof Matrix) {
               if (!target.sameDims(vals)) {
                  throw new Error('Incompatible matrix dimensions');
               }
               return vals.get.bind(vals);
            }
            return function(i, j) { return vals; };
         }
         vals = makeLookup(vals);
         for (col = 1; col <= target.ncol; col += 1) {
            for (row = 1; row <= target.nrow; row += 1) {
               target._set(row, col, vals(row, col));
            }
         }
      }
      if (arguments.length === 1) {
         changeAll(this, i);
      } else {
         this._set(i, j, val);
      }
      return this;
   };

   /**
    * Internally used by `Matrix.prototype.set`. Users should not have need for
    * this method.
    */
   Matrix.prototype._set = function _set(i, j, val) {
      if ( i < 1 || i > this.nrow ||
           j < 1 || j > this.ncol) {
         throw new Error('Setting out of Matrix bounds');
      }
      this.values._set(this.toIndex(i, j), val);
      return this;
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
   Matrix.prototype.rowFromIndex = function rowFromIndex(n) {
      if (this.byRow) {
         return Math.floor((n - 1) / this.ncol) + 1;
      }
      return (n - 1) % this.nrow + 1;
   };
      Matrix.prototype.colFromIndex = function colFromIndex(n) {
      if (this.byRow) {
         return (n - 1) % this.ncol + 1;
      }
      return Math.floor((n - 1) / this.nrow) + 1;
   };
   /**
    * Return the outer product matrix of two vectors. If a function `f(i, j)` is
    * provided as the second argument, it will be used. Otherwise, normal number
    * multiplication is used resulting in the standard outer product.
    *
    * TODO: Find a way to add this the Vector docs
    * @memberof Vector
    */
   Matrix.Vector.prototype.outer = function outer(v2, f) {
      var tabf;
      f = op[f] != null ? op[f] : f || op.mult;
      tabf = function(i, j) { return f(this.get(i), v2.get(j), i, j); }.bind(this);
      return new Matrix(tabf, { nrow: this.length, ncol: v2.length });
   };
   /**
    * Return a view into a submatrix of `this`. The parameters `rowIndex`, `colIndex`
    * maybe be either arrays or functions `f(i)` used to obtain the indices.
    * In the latter case, a third argument `dims` is needed. It is an object with
    * properties `nrow` or `ncol` as needed, specifying the dimensions of the resulting
    * matrix.
    *
    *     var A1 = new Matrix([2, 3, 4, 5, 6, 7], { nrow: 2 }); // 2x3 matrix
    *     // Returns 2nd & 3rd column
    *     var A2 = A1.view([1, 2], function(j) { return 1 + j; }, { ncol: 2})
    */
   Matrix.prototype.view = function view(rowIndex, colIndex, dims) {
      return new Matrix.ViewM(this, rowIndex, colIndex, dims);
   };
   /** Return a `Vector` view of the `i`-th row of the matrix. */
   Matrix.prototype.rowView = function rowView(i) {
      if (i < 1 || i > this.nrow) {
         throw new Error('Row index out of bounds');
      }
      return this.values.view(function(j) {
         return this.toIndex(i, j);
      }.bind(this), this.ncol);
   };
   /** Return a `Vector` view of the `j`-th column of the matrix. */
   Matrix.prototype.colView = function colView(j) {
      if (j < 1 || j > this.ncol) {
         throw new Error('Column index out of bounds');
      }
      return this.values.view(function(i) {
         return this.toIndex(i, j);
      }.bind(this), this.nrow);
   };
   /**
    * With no arguments, returns the mutable state of the matrix.
    *
    * With a boolean argument, sets the mutable state of the matrix and returns
    * the matrix.
    *
    * A matrix's mutable state is simply a reflection of the mutable state of
    * its `values` vector.
    */
   Matrix.prototype.mutable = function mutable(newSetting) {
      if (newSetting != null) {
         this.values.mutable(newSetting);
         return this;
      }
      return this.values.mutable();
   };

   /** TODO make comment */
   Matrix.prototype.each = function each(f, skipZeros) {
      var f2 = function f2(val, n) {
         return f(val, this.rowFromIndex(n), this.colFromIndex(n));
      }.bind(this);
      this.values.each(f2, skipZeros || false);
      return this;
   };
   Matrix.prototype.forEach = Matrix.prototype.each;

   Matrix.prototype.eachRow = function eachRow(f) {
      var i;
      for (i = 1; i <= this.nrow; i += 1) {
         f(this.rowView(i), i);
      }
      return this;
   };

   Matrix.prototype.eachCol = function eachCol(f) {
      var j;
      for (j = 1; j <= this.ncol; j += 1) {
         f(this.colView(j), j);
      }
      return this;
   };

   /** Return whether the matrix has the same dimensions as the matrix `other` */
   Matrix.prototype.sameDims = function sameDims(other) {
      return this.nrow === other.nrow && this.ncol === other.ncol;
   };

   return Matrix;
});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
