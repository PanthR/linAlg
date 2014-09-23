(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {

   // Subclass of `StructuredM` representing "Symmetric" matrices.
   //
   // Possible ways to specify:
   // 1. A full square matrix (it better be symmetric to begin with). If the
   // matrix is already `SymmetricM`, returns the matrix itself.
   // 2. A function. Second argument would then be the nrow = ncol, or an
   // object with an `nrow` property. The function better be symmetric.
   // 3. A single value, to be used for all entries. Second argument nrow needed.
   function SymmetricM(values, nrow) {
      var getValue;
      if (values instanceof SymmetricM) { return values; }
      this.byRow = true;
      this.nrow = nrow && nrow.nrow || nrow; // nrow is object or number
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

   SymmetricM.prototype = Object.create(StructuredM.prototype);

   SymmetricM.prototype.classes = [ SymmetricM, Matrix ];

   SymmetricM.prototype.toIndex = function toIndex(i, j) {
      if (j > i) { return j * (j - 1) / 2 + i; }
      return i * (i - 1) / 2 + j;
   };
   SymmetricM.prototype.rowFromIndex = function rowFromIndex(n) {
      return Math.floor((1 + Math.sqrt(1 + 8 * (n - 1))) / 2);
   };
   SymmetricM.prototype.colFromIndex = function colFromIndex(n) {
      var i = Math.floor((1 + Math.sqrt(1 + 8 * (n - 1))) / 2);
      return n - i * (i - 1) / 2;
   };

   SymmetricM.prototype.constr = function constr() {
      return Matrix;
   };

   SymmetricM.prototype.transpose = function transpose() {
      return this;
   };

   SymmetricM.prototype.isSymmetric = function() { return true; };

   // Needs its own sMult to ensure the result is still symmetric
   SymmetricM.prototype.sMult = function sMult(k) {
      return new SymmetricM(function(i, j) {
         return k * this.get(i, j);
      }.bind(this), this);
   };

   return SymmetricM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
