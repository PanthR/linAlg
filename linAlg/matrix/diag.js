(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass DiagM of Matrix
 */
return function(Matrix) {

   // Subclass of `StructuredM` representing "Diagonal" matrices.
   // DiagM takes ownership of the diagonal vector and may
   // change its values when it itself is changed. Clone the
   // array/vector before passing it to avoid this.
   //
   // `diagonal` needs to be a `Vector`.
   //
   // One can only set values on the diagonal of a DiagM matrix.
   // Trying to set outside the diagonal will result in error.
   // In order to set values outside the diagonal, would need to
   // "unstructure" the matrix.
   //
   // Using rowView/colView on diagonal matrices may be quite inefficient,
   // as it does not recognize the sparse nature of those vectors.
   function DiagM(diagonal) {
      this.byRow = false;
      this.values = diagonal;
      this.nrow = this.values.length;
      this.ncol = this.values.length;
   }

   DiagM.prototype = Object.create(Matrix.StructuredM.prototype);

   DiagM.prototype._get = function _get(i, j) {
      if (i !== j) { return 0; }  // Out of bounds check happens in this.values
      return this.values.get(i);
   };

   DiagM.prototype._set = function _set(i, j, v) {
      if (i !== j && v !== 0) {
         throw new Error('Trying to set non-diagonal entry in diagonal matrix');
      }
      if (i === j) { this.values._set(i, v); }
      return this;
   };

   DiagM.prototype.each = function each(f, skipZeros) {
      console.log('TODO');
   };

   return DiagM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
