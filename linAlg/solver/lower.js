(function(define) {'use strict';
define(function(require) {

return function(Solver) {

   var Vector, Matrix, utils;

   utils = require('./../utils');
   Matrix = Solver.Matrix;
   Vector = Matrix.Vector;
   /**
    * Expects a `LowerTriM` matrix for `A` (or full square matrix and it will use its lower triangle).
    * Solves by forward substitution.
    */
   function LowerS(A) {
      this.A = new Matrix.LowerTriM(A);
      this.nrow = this.A.nrow;
   }

   LowerS.prototype = Object.create(Solver.prototype);

   /** Expects b to be a vector. Returns a vector */
   LowerS.prototype._solve = function _solve(b) {
      var x, i, j, v;
      x = [];
      for (i = 1; i <= this.nrow; i += 1) {
         v = b.get(i);
         for (j = 1; j < i; j += 1) { v -= this.A.get(i, j) * x[j - 1]; }
         x.push(v / this.A.get(i, i));
      }
      return new Vector(x);
   };

   LowerS.prototype.isSingular = function isSingular() {
      return this.A.diagView().any(function(x) {
         return utils.veryClose(x, 0, Vector.tolerance);
      });
   };

   return LowerS;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
