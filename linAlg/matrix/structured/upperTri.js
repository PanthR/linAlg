(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {

   // Subclass of `StructuredM` representing "Upper triangular" matrices.
   //
   // Possible ways to specify:
   // 1. A full square matrix, and we grab the Upper triangular part. If the
   // matrix is already `UpperTriM`, returns the matrix itself.
   // 2. A function. Second argument would then be the nrow = ncol.
   // 3. A single value, to be used for all entries. Second argument ncol needed.
   function UpperTriM(values, ncol) {
      var getValue;
      if (values instanceof UpperTriM) { return values; }
      this.byRow = false;
      this.mutable = false;
      this.nrow = ncol;
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

   UpperTriM.prototype = Object.create(StructuredM.prototype);

   UpperTriM.prototype.toIndex = function toIndex(i, j) {
      return j * (j - 1) / 2 + i;
   };
   UpperTriM.prototype.rowFromIndex = function rowFromIndex(n) {
      var j = Math.floor((1 + Math.sqrt(1 + 8 * (n - 1))) / 2);
      return n - j * (j - 1) / 2;
   };
   UpperTriM.prototype.colFromIndex = function colFromIndex(n) {
      return Math.floor((1 + Math.sqrt(1 + 8 * (n - 1))) / 2);
   };

   UpperTriM.prototype.validate = function(i, j, val) {
      if (i <= j) { return true; }
      if (arguments.length > 2 && val !== 0) {
         throw new Error('Trying to set lower entry in Upper triangular matrix');
      }
      return false;
   };

   // UpperTriM.prototype.each = function each(f) {
   //    // apply f along the diagonal
   //    this.values.each(function(val, i) {
   //       f(val, i, i);
   //    }, false);  // want to access all diag elements
   //    return this;
   // };

   UpperTriM.prototype.map = function map(f) {
      function f2(val, i) { return f(val, i, i); }
      return new UpperTriM(this.values.map(f2));
   };

   return UpperTriM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
