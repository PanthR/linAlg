(function(define) {'use strict';
define(function(require) {

   /**
    * Javascript implementation of Linear Algebra Matrices.
    * @module Matrix
    * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
    */
   var DenseM, SparseM, TabularM, DiagM;

   /** Options may be:
    * 1. A number of rows (assumes row-wise)
    * 2. An object with possible keys: nrow, ncol, byRow (boolean)
    */
   function Matrix(arr, options) {
      if (Array.isArray(arr)) {
         return new DenseM(arr, options);
      }
      if (typeof arr === 'function') {
         return new TabularM(arr, options);
      }
      return new SparseM(arr, options);
   }

   Matrix.Vector   = require('./vector');
   Matrix.DenseM   = DenseM   = require('./matrix/dense')(Matrix);
   Matrix.SparseM  = SparseM  = require('./matrix/sparse')(Matrix);
   Matrix.TabularM = TabularM = require('./matrix/tabular')(Matrix);
   Matrix.DiagM    = DiagM    = require('./matrix/diag')(Matrix);

   /** 'this' is set to the matrix
    * Returns the vector index that would correspond to the i-th row and j-th column
    */
   Matrix.prototype.toIndex = function toIndex(i, j) {
      return this.byRow ? (i - 1) * this.ncol + j : (j - 1) * this.nrow + i;
   };
   Matrix.prototype.fromIndex = function fromIndex(n) {
      if (this.byRow) {
         return { i: Math.floor((n + 1) / this.ncol), j: (n - 1) % this.ncol + 1 };
      }
      return { i: (n - 1) % this.nrow + 1, j: Math.floor((n + 1) / this.nrow) };
   };

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
