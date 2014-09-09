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
    * One can access the matrix dimensions via the properties `nrow` and `ncol`.
    *
    * New `Matrix` objects are created via the `Matrix` constructor, which accepts
    * a number of options for its first argument, `arr`:
    *
    * 1. Called with another `Matrix`, simply returns the matrix itself.
    * 2. Called with a single array of values, constructs a matrix based on these values.
    * The dimensions and other properties of this array are determined by the second
    * argument, which is an object `options` containg one or more of the keys
    * `nrow`, `ncol`, `byRow`.
    * 3. Called with an array of arrays of values, it constructs a matrix with columns
    * based on those arrays. The number of arrays (length of `arr`) becomes `ncol`. The
    * arrays in `arr` are expected to have the same length, and that becomes `nrow`.
    * The options object is optional, but may contain a "byRow" entry, which if `true`
    * indicates that the roles of `column` and `row` would be interchanged, i.e.
    * the arrays in `arr` would become rows instead of columns.
    * 4. Called with a function `f(i,j)`, it uses that function to determine the `Matrix`'s
    * values. In that case an `options` second argument specifying `nrow` and `ncol` is needed.
    *
    * Examples:
    *
    *     // All these create:
    *     //        0 1 1
    *     //        2 0 1
    *     //
    *     new Matrix([0, 2, 1, 0, 1, 1], { nrow : 2 }); // by column default
    *     new Matrix([0, 1, 1, 2, 0, 1], { nrow : 2, byRow: true });
    *     new Matrix([[0, 1, 1], [2, 0, 1]], { byRow : true });
    *     new Matrix([[0, 2], [1, 0], [1, 1]]);
    *     // Sparse matrix:
    *     new Matrix({ 1: { 2: 1, 3: 1}, 2: { 1: 2, 3: 1 }}, { nrow : 2, ncol: 3 });
    *     
    *     // The following produces in rows: [[1, 2, 3], [2, 4, 6]]
    *     new Matrix(function(i, j) { return i * j; }, { nrow: 2, ncol: 3 });
    */
   function Matrix(arr, options) {
      if (arr instanceof Matrix) { return arr; }
      if (Array.isArray(arr)) {
         return new Matrix.DenseM(arr, options);
      }
      if (typeof arr === 'function') {
         return new Matrix.TabularM(arr, options);
      }
      return new Matrix.SparseM(arr, options);
   }

   /* The class `Vector` as it is accessed from `Matrix`. */
   Matrix.Vector   = require('./vector');
   /**
    * Subclass of `Matrix` representing "dense" matrices.
    * Dense matrices are internally stored simply as Javascript Arrays.
    * Users should not need to access this subclass directly.
    */
   Matrix.DenseM   = require('./matrix/dense')(Matrix);
   /**
    * Subclass of `Matrix` representing "sparse" matrices.
    * Sparse matrices are stored as objects, whose keys represent the indices
    * that have non-zero values.
    * Users should not need to access this subclass directly.
    */
   Matrix.SparseM  = require('./matrix/sparse')(Matrix);
   /**
    * Subclass of `Matrix` representing matrices whose values are specified via
    * a function `f(i)` of the index.
    * The values of the matrix are computed lazily, only when they are accessed.
    * Users should not need to access this subclass directly.
    */
   Matrix.TabularM = require('./matrix/tabular')(Matrix);
   /**
    * Subclass of `Matrix` acting as a superclass for classes of matrices
    * with extra structure. Users should not need to access this subclass
    * directly.
    */
   Matrix.StructuredM = require('./matrix/structured')(Matrix);
   /**
    * Subclass of `Matrix` representing diagonal matrices.
    * Users should not need to access this subclass directly.
    */
   Matrix.DiagM    = require('./matrix/diag')(Matrix);
   /**
    * Subclass of `Matrix` representing submatrix views into another matrix. Changes
    * to the view are reflected on the original matrix and vice-versa. Use
    * `Matrix.prototype.view` to create these.
    *
    * See also: `Matrix.prototype.rowView`, `Matrix.prototype.colView`,
    * `Matrix.prototype.diagView`.
    */
   Matrix.ViewM    = require('./matrix/view')(Matrix);

   /**
    * Subclass of Vector that is used internally by `Matrix` for representing
    * the rows/columns/diagonals of a matrix as vectors.
    *
    * For creating these, see: `Matrix.prototype.rowView`, `Matrix.prototype.colView`,
    * `Matrix.prototype.diagView`.
    */
   Matrix.ViewMV    = require('./matrix/viewmv')(Matrix);
   // Static methods

   /**
    * Return a square diagonal matrix with values given by `diagonal`. The argument
    * `diagonal` may be an array, a `Vector`, or a function `f(i)`. In the latter case,
    * a second argument `len` is required to provide the length of the resulting diagonal.
    *
    * To obtain a diagonal of an arbitrary matrix, see `Matrix.prototype.diagView`.
    */
   Matrix.diag = function diag(diagonal, len) {
      return new Matrix.DiagM(diagonal, len);
   };

   /**
    * Return the value at location `(i, j)`. Returns `0` if accessing a location out
    * of bounds.
    *
    * Called with 0 or 1 arguments, it is an alias for `Matrix.prototype.toArray`.
    */
   Matrix.prototype.get = function get(i, j) {
      if (arguments.length <= 1) {
         return this.toArray(i || false);
      }
      return this._get(i, j);
   };

   /**
    * Internally used by `Matrix.prototype.get`. May be used in place of
    * `Matrix.prototype.get` if both arguments are always present.
    */
   Matrix.prototype._get = function _get(i, j) {
      if ( i < 1 || i > this.nrow) { return 0; }
      if ( j < 1 || j > this.ncol) { return 0; }
      return this.compute(i, j);
   };

   /**
    * Computes the value at the (i, j) location. _Internal method_. Use `Matrix.prototype.get`
    * instead.
    */
   Matrix.prototype.compute = function compute(i, j) {
      return this.values.get(this.toIndex(i, j));
   };

   /**
    * Set the value of the matrix at the `(i, j)` location to `val`. Requires that
    * the matrix be set to be mutable.
    *
    * If called with only one argument, then that argument may be a function `f(i, j)`, or
    * a single value, or a `Matrix` with the same dimensions. That argument will then be used
    * to set all the values of the Matrix.
    *
    *     var A1 = new Matrix([1, 2, 3, 4, 5, 6], { nrow: 2, byRow: true });
    *     A1.set(1, 1, 42);    // Throws an exception
    *     A1.mutable(true);    // Set matrix to mutable
    *     A1.set(2, 2, 42);    // Changes 5 to 42
    *     A1.set(Math.random); // Fills A1 with random values
    *     A1.set(5);           // Sets all entries to 5
    *     var A2 = new Matrix([1, 2, 3, 4, 5, 6], { nrow: 2, byRow: true });
    *     A1.set(A2);          // Sets all values of A1 based on those from A2
    *     A1.set(1, 1, 42);    // Only changes A1, not A2
    *
    * Trying to set at an out-of-bounds location results in an exception. If the matrix is
    * "structured", trying to set at a location outside the structure (e.g. an off-diagonal
    * entry of a diagonal matrix) also results in an exception.
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
         target.each(function(val, i, j) { target._set(i, j, vals(i, j)); });
      }
      if (arguments.length === 1) {
         changeAll(this, i);
      } else {
         this._set(i, j, val);
      }
      return this;
   };

   /**
    * Internally used by `Matrix.prototype.set`. _Internal method_. May be used
    * instead of `Matrix.prototype._set` if all three arguments are always present.
    */
   Matrix.prototype._set = function _set(i, j, val) {
      if ( i < 1 || i > this.nrow ||
           j < 1 || j > this.ncol) {
         throw new Error('Setting out of Matrix bounds');
      }
      return this.change(i, j, val);
   };

   /**
    * Internal method used by `Matrix.prototype._set` to change the value of the
    * matrix at a particular location. _Internal method_. This method bypasses
    * various checks and should only be used with extreme care.
    */
   Matrix.prototype.change = function change(i, j, val) {
      this.values._set(this.toIndex(i, j), val);
      return this;
   };

   /**
    * Return an array of arrays representing the matrix. This representation is
    * as an array of columns (or an array of rows if `byRow` is `true`).
    *
    *     var A = new Matrix([1, 2, 3, 4, 5, 6], { byRow: true, nrow: 3 });
    *     A.toArray(true);  // [[1, 2], [3, 4], [5, 6]]
    *     A.toArray(false); // [[1, 3, 5], [2, 4, 6]]
    */
   Matrix.prototype.toArray = function toArray(byRow) {
      var arr = [];
      if (byRow) {
         this.eachRow(function(row) {
            arr.push(row.toArray());
         });
      } else {
         this.eachCol(function(col) {
            arr.push(col.toArray());
         });
      }
      return arr;
   };

   /**
    * Return a flat vector of the matrix values by concatenating its
    * columns (or its rows if `byRow` is true). This is not a view into
    * the matrix, and cannot be used to change the matrix values.
    */
   Matrix.prototype.toVector = function toVector(byRow) {
      var obj;
      byRow = byRow || false;
      obj = { nrow: this.nrow, ncol: this.ncol, byRow: byRow };
      return new Matrix.Vector(function(n) {
         return this.get(this.rowFromIndex.call(obj, n),
                         this.colFromIndex.call(obj, n));
      }.bind(this), this.nrow * this.ncol);
   };

   /*
    * Return the vector index that would correspond to the i-th row and j-th column.
    * This is used to access the appropriate location in the vector that represents
    * the matrix's values. _This is an internal method_.
    */
   Matrix.prototype.toIndex = function toIndex(i, j) {
      return this.byRow ? (i - 1) * this.ncol + j : (j - 1) * this.nrow + i;
   };
   /*
    * Return the row corresponding to the vector index `n`. This is a partial
    * inverse to `Matrix.prototype.toIndex`. _This is an internal method_.
    */
   Matrix.prototype.rowFromIndex = function rowFromIndex(n) {
      if (this.byRow) {
         return Math.floor((n - 1) / this.ncol) + 1;
      }
      return (n - 1) % this.nrow + 1;
   };
   /*
    * Return the column corresponding to the vector index `n`. This is a partial
    * inverse to `Matrix.prototype.toIndex`. _This is an internal method_.
    */
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
      return new Matrix.ViewMV(this, i, 'row');
   };
   /** Return a `Vector` view of the `j`-th column of the matrix. */
   Matrix.prototype.colView = function colView(j) {
      return new Matrix.ViewMV(this, j, 'col');
   };
   /**
    * `offset` is relative to main diagonal being 0.
    */
   Matrix.prototype.diagView = function diagView(offset) {
      return new Matrix.ViewMV(this, offset || 0, 'diag');
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

   /**
    * `Each` automatically respects the "structure" of the matrix. For instance
    * on a Sparse matrix, it will only be called on the non-zero entries, on a
    * DiagM matrix it will only be called on the diagonal entries and so on.
    * TODO: Add a way for someone to "densify" a matrix so that each acts on all.
    * A ViewM on the full dimensions might be able to act that way.
    */
   Matrix.prototype.each = function each(f) {
      var f2 = function f2(val, n) {
         return f(val, this.rowFromIndex(n), this.colFromIndex(n));
      }.bind(this);
      this.values.each(f2, true);
      return this;
   };
   /** Alias for `Matrix.prototype.each` */
   Matrix.prototype.forEach = function(f) { return this.each(f); };

   /**
    * Apply the function `f` to each row in the matrix. The signature of `f` is
    * `f(row, i)` where `row` is a `Vector` object representing the `i`-th row.
    */
   Matrix.prototype.eachRow = function eachRow(f) {
      var i;
      for (i = 1; i <= this.nrow; i += 1) {
         f(this.rowView(i), i);
      }
      return this;
   };

   /**
    * Apply the function `f` to each column in the matrix. The signature of `f` is
    * `f(col, j)` where `col` is a `Vector` object representing the `j`-th col.
    */
   Matrix.prototype.eachCol = function eachCol(f) {
      var j;
      for (j = 1; j <= this.ncol; j += 1) {
         f(this.colView(j), j);
      }
      return this;
   };

   /**
    * TODO
    */
   Matrix.prototype.reduce = function reduce(f, initial) {
      this.each(function(val, i, j) {
         initial = f(initial, val, i, j);
      });
      return initial;
   };

   /**
    * TODO
    */
   Matrix.prototype.reduceRow = function reduceRow(f, initial) {
      var i;
      for (i = 1; i <= this.nrow; i += 1) {
         initial = f(initial, this.rowView(i), i);
      }
      return initial;
   };

   /**
    * TODO
    */
   Matrix.prototype.reduceCol = function reduceCol(f, initial) {
      var j;
      for (j = 1; j <= this.ncol; j += 1) {
         initial = f(initial, this.colView(j), j);
      }
      return initial;
   };

   // TODO: Need to respect the structure??
   Matrix.prototype.map = function map(f) {
      return new Matrix(function(i, j) {
         return f(this.get(i, j), i, j);
      }.bind(this), { nrow: this.nrow, ncol: this.ncol });
   };

   /**
    * TODO
    */
   Matrix.prototype.mapRow = function mapRow(f) {
      var newRows = [];
      this.eachRow(function(row, i) { newRows.push(f(row, i)); });
      if (newRows[0] instanceof Matrix.Vector) {
         return new Matrix(newRows.map(function(row) {
            return row.toArray();
         }), true);
      }
      if (Array.isArray(newRows[0])) {
         return new Matrix(newRows, true);
      }
      // values of f are numbers
      return new Matrix.Vector(newRows);
   };

   /**
    * TODO
    */
   Matrix.prototype.mapCol = function mapCol(f) {
      var newCols = [];
      this.eachCol(function(col, j) { newCols.push(f(col, j)); });
      if (newCols[0] instanceof Matrix.Vector) {
         return new Matrix(newCols.map(function(col) {
            return col.toArray();
         }));
      }
      if (Array.isArray(newCols[0])) {
         return new Matrix(newCols);
      }
      // values of f are numbers
      return new Matrix.Vector(newCols);
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
