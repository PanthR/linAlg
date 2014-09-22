(function(define) {'use strict';
define(function(require) {

return function(Solver) {

   var Matrix, utils;

   utils  = require('./../utils');
   Matrix = Solver.Matrix;

   /**
    * Solves the system Ax = b for a symmetric positive definite A by computing
    * a Cholesky decomposition. `A` is a square symmetric positive definite matrix.
    * "isSingular" returning true would indicate the matrix is not positive definite.
    */
   function CholeskyS(A) {
      this.A = A;
      computeCholesky.call(this); // sets G, G^T
      this.nrow = A.nrow;
   }

   CholeskyS.prototype = Object.create(Solver.prototype);

   CholeskyS.prototype._solve = function _solve(b) {
      return this.GT.solve(this.G.solve(b));
   };

   // local methods
   // computeCholesky sets the G, G^T solvers for `this` so that A = G*G^T.
   function computeCholesky() {
      var G, i, j, k, val, pivot;
      G = this.A.lower().mutable(true);
      for (j = 1; j <= G.ncol; j += 1) {
         for (k = 1; k < j; k += 1) {
            for (i = j; i <= G.nrow; i += 1) {
               G.set(i, j, G.get(i, j) - G.get(j, k) * G.get(i, k));
            }
         }
         val = Math.sqrt(G.get(j, j));
         for (i = j; i <= G.nrow; i += 1) {
            G.set(i, j, G.get(i, j) / val);
         }
      }
      this.G = new Solver.LowerS(G);
      this.GT = new Solver.UpperS(G.transpose());
      return;
   }

   CholeskyS.prototype.isSingular = function isSingular() {
      return "TODO";
   };

   return CholeskyS;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
