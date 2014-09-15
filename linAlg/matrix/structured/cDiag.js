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

   CDiagM.prototype.mutable = function mutable(newSetting) {
      if (newSetting == null) { return false; }
      throw new Error('Cannot set constant to be mutable');
   };

   CDiagM.prototype.change = function(i, j, val) {
      throw new Error('Trying to set entry in constant matrix');
   };

   CDiagM.prototype._get = function(i, j) {
      return i === j ? this.val : 0;
   };

   CDiagM.prototype.constr = function constr() {
      return CDiagM; // TODO: Test this works properly (with map)
   };

   CDiagM.prototype.transpose = function transpose() {
      return this;
   };

   return CDiagM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
