(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {

   // Subclass of `StructuredM` representing "Lower triangular" matrices.
   //
   // Possible ways to specify:
   // 1. A full square matrix, and we grab the lower triangular part. If the
   // matrix is already `LowerTriM`, returns the matrix itself.
   // 2. A function. Second argument would then be the nrow = ncol.
   // 3. A single value, to be used for all entries. Second argument nrow needed.
   function LowerTriM(values, nrow) {
      var getValue;
      if (values instanceof LowerTriM) { return values; }
      this.byRow = true;
      this.mutable = false;
      this.nrow = nrow;
      if (values instanceof Matrix) {
         this.nrow = Math.min(values.nrow, values.ncol);
         getValue = values._get.bind(values);
      } else {
         getValue = typeof values === 'function' ? values : function() { return values; };
      }
      this.ncol = this.nrow;
      this.values = new Matrix.Vector(function(n) {
         return getValue(this.rowFromIndex(n), this.colFromIndex(n));
      }.bind(this), this.toIndex(this.nrow, this.ncol));
   }

   LowerTriM.prototype = Object.create(StructuredM.prototype);

   LowerTriM.prototype.toIndex = function toIndex(i, j) {
      return i * (i - 1) / 2 + j;
   };
   LowerTriM.prototype.rowFromIndex = function rowFromIndex(n) {
      return Math.floor((1 + Math.sqrt(1 + 8 * (n - 1))) / 2);
   };
   LowerTriM.prototype.colFromIndex = function colFromIndex(n) {
      var i = Math.floor((1 + Math.sqrt(1 + 8 * (n - 1))) / 2);
      return n - i * (i - 1) / 2;
   };

   LowerTriM.prototype.validate = function(i, j, val) {
      if (i >= j) { return true; }
      if (arguments.length > 2 && val !== 0) {
         throw new Error('Trying to set upper entry in Lower triangular matrix');
      }
      return false;
   };

   // LowerTriM.prototype.each = function each(f) {
   //    // apply f along the diagonal
   //    this.values.each(function(val, i) {
   //       f(val, i, i);
   //    }, false);  // want to access all diag elements
   //    return this;
   // };

   LowerTriM.prototype.map = function map(f) {
      function f2(val, i) { return f(val, i, i); }
      return new LowerTriM(this.values.map(f2));
   };

   return LowerTriM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
