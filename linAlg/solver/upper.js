(function(define) {'use strict';
define(function(require) {

return function(Solver) {

   var Vector, Matrix, utils;

   utils = require('./../utils');
   Matrix = Solver.Matrix;
   Vector = Matrix.Vector;
   /**
    * Expects a `UpperTriM` matrix for `A` (or full square matrix and it will use its Upper triangle).
    * Solves by back substitution.
    */
   function UpperS(A) {
      this.A = new Matrix.UpperTriM(A);
      this.nrow = this.A.nrow;
   }

   UpperS.prototype = Object.create(Solver.prototype);

   /** Expects b to be a vector. Returns a vector */
   UpperS.prototype._solve = function _solve(b) {
      var x, i, j, v;
      x = [];
      for (i = this.nrow; i >= 1; i -= 1) {
         v = b.get(i);
         for (j = this.nrow; j > i; j -= 1) { v -= this.A.get(i, j) * x[j - 1]; }
         x[i - 1] = v / this.A.get(i, i);
      }
      return new Vector(x);
   };

   UpperS.prototype.isSingular = function isSingular() {
      return this.A.diagView().any(function(x) {
         return isNaN(x) || utils.veryClose(x, 0, Vector.tolerance);
      });
   };

   return UpperS;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
