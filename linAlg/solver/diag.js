(function(define) {'use strict';
define(function(require) {

return function(Solver) {

   var Vector, Matrix;

   Matrix = Solver.Matrix;
   Vector = Matrix.Vector;
   /**
    * diag is meant to be the diagonal of a diagonal matrix D.
    * Solves the system Dx = b.
    */
   function DiagS(diag) {
      this.diag = new Vector(diag);
      this.nrow = this.diag.length;
   }

   DiagS.prototype = Object.create(Solver.prototype);

   /** Expects b to be a vector. Returns a vector */
   DiagS.prototype._solve = function _solve(b) {
      return b.pDiv(this.diag);
   };

   return DiagS;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
