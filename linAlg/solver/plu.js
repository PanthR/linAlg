(function(define) {'use strict';
define(function(require) {

return function(Solver) {

   var Matrix, utils;

   utils  = require('./../utils');
   Matrix = Solver.Matrix;

   /**
    * Solves the system Ax = b by computing a PLU decomposition.
    * `A` is a square matrix and `strategy` specifies the pivoting
    * strategy for the PLU solver ('partial' or 'complete').
    */
   function PLUS(A, strategy) {
      this.A = A;
      this.strategy = strategy || 'partial';
      computePLU.call(this); // sets P (perm), L (solver), U (solver)
      this.nrow = A.nrow;
   }

   PLUS.prototype = Object.create(Solver.prototype);

   PLUS.prototype._solve = function _solve(b) {
      // LUx = Pb
      return this.U.solve(this.L.solve(this.P.mult(b)));
   };

   // local methods
   // computePLU sets the P, L, U for this so that P*A = L*U.
   // TODO:  add the ability to handle 'complete' pivoting strategy
   function computePLU() {
      var A, origA, i, j, k, pivot;
      // returns the rowIndex of the maximum of the values |A(k, k)| through |A(n, k)|
      function getPivot(A, k) {
         var max, maxRow, r;
         max = -Infinity;
         for (r = k; r <= A.nrow; r += 1) {
            if (Math.abs(A.get(r, k)) > max) {
               max = Math.abs(A.get(r, k));
               maxRow = r;
            }
         }
         return maxRow;
      }
      A = origA = this.A.clone(false).mutable(true);
      this.P = Matrix.perm({}, A.nrow); // ID matrix as a PermM
      for (k = 1; k <= A.ncol; k += 1) {
         pivot = getPivot(A, k);
         if (utils.veryClose(A.get(pivot, k), 0, Matrix.Vector.tolerance)) {
            continue;
         }
         if (pivot !== k) {
            this.P = Matrix.perm([pivot, k], A.nrow).mult(this.P);
            A = this.P.mult(origA);
         }
         for (i = k + 1; i <= A.nrow; i += 1) {
            A.set(i, k, A.get(i, k) / A.get(k, k));
            for (j = k + 1; j <= A.ncol; j += 1) {
               A.set(i, j, A.get(i, j) - A.get(i, k) * A.get(k, j));
            }
         }
      }
      this.U = new Solver.UpperS(A.mutable(false).upper());
      function lowerLookup(i, j) {
         return i === j ? 1 : A.get(i, j);
      }
      this.L = new Solver.LowerS(new Matrix.LowerTriM(lowerLookup, A.nrow));
   }

   PLUS.prototype.isSingular = function isSingular() {
      return this.U.isSingular();
   };

   return PLUS;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
