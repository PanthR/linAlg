(function(define) {'use strict';
define(function(require) {

return function(Matrix) {

   var Vector;

   Vector = Matrix.Vector;

   /**
    * Top level class for solving linear systems
    */
   function Solver(A) {
      /** Each subclass should define this.nrow */
   }

   Solver.Matrix = Matrix;
   Solver.prototype = Object.create({});

   Solver.DiagS   = require('./solver/diag')(Solver);
   Solver.LowerS  = require('./solver/lower')(Solver);
   Solver.UpperS  = require('./solver/upper')(Solver);
   Solver.PLUS    = require('./solver/plu')(Solver);

   /** Expects b to be a Vector or Matrix (maybe array also?) */
   Solver.prototype.solve = function solve(b) {
      this.ensureCompatibleDims(b);
      if (b instanceof Vector) { return this._solve(b); }
      return new Matrix(b.mapCol(this._solve.bind(this)));
   };

   Solver.prototype.ensureCompatibleDims = function ensureCompatibleDims(b) {
      if (this.nrow !== (b instanceof Vector ? b.length : b.nrow)) {
         throw new Error('Solver and RHS have incompatible dimensions.');
      }
      return;
   };

   return Solver;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
