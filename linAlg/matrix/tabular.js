(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass TabularM of Matrix
 */
return function(Matrix) {

   // Subclass of `Matrix` representing "Tabular" matrices.
   function TabularM(f, options) {
      this.byRow = true;
      this.nrow = options && options.nrow;
      this.ncol = options && options.ncol;
      function f2(n) {
         return f(this.rowFromIndex(n), this.colFromIndex(n));
      }
      this.values = new Matrix.Vector(f2.bind(this), this.nrow * this.ncol);
   }

   TabularM.prototype = Object.create(Matrix.DenseM.prototype);

   return TabularM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
