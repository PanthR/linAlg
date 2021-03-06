(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass DiagM of Matrix
 */
return function(Matrix, StructuredM) {

   // Subclass of `StructuredM` representing matrices that are constant multiples of
   // identity.
   //
   // `nrow` needs to be an object with an `nrow` property, or a number.
   //
   // CDiagM matrices are immutable.
   //
   // Using rowView/colView on diagonal matrices may be quite inefficient,
   // as it does not recognize the sparse nature of those vectors.
   function CDiagM(val, nrow) {
      nrow = nrow && nrow.nrow || nrow;
      if (nrow == null) { throw new Error('Must specify matrix dimensions'); }
      this.val = val;
      this.byRow = false;
      this.nrow = nrow;
      this.ncol = nrow;
   }

   CDiagM.prototype = Object.create(StructuredM.DiagM.prototype);

   CDiagM.add = function add(A, B, k) {
      return new CDiagM(A.val + k * B.val, A);
   };

   CDiagM.prototype.classes = [
      CDiagM, StructuredM.DiagM, StructuredM.LowerTriM,
      StructuredM.UpperTriM, StructuredM.SymmetricM,
      Matrix
   ];

   CDiagM.prototype.mutable = function mutable(newSetting) {
      if (newSetting == null) { return false; }
      throw new Error('Cannot set constant to be mutable');
   };

   CDiagM.prototype.change = function(i, j, val) {
      throw new Error('Trying to set entry in constant matrix');
   };

   CDiagM.prototype.compute = function(i, j) {
      return i === j ? this.val : 0;
   };

   // constructor to use for applying map
   CDiagM.prototype.constr = function constr() {
      return StructuredM.DiagM;
   };

   CDiagM.prototype.each = function each(f) {
      var i;
      for (i = 1; i <= this.nrow; i += 1) {
         f(this.val, i, i);
      }
      return this;
   };

   CDiagM.prototype.inverse = function inverse() {
      if (this.val === 0) { throw new Error('Cannot invert zero matrix.'); }
      return new CDiagM(1 / this.val, this);
   };

   CDiagM.prototype.sMult = function sMult(k) {
      return new CDiagM(k * this.val, this);
   };

   return CDiagM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
