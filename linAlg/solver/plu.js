(function(define) {'use strict';
define(function(require) {

return function(Solver) {

   var Matrix;

   Matrix      = Solver.Matrix;
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
      var A, i, j, k;
      A = this.A.clone(false).mutable(true);
      this.P = Matrix.perm({}, A.nrow); // ID matrix as a PermM
      for (k = 1; k < A.ncol; k += 1) {
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

   return PLUS;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
