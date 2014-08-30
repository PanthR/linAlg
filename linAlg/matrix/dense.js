(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass DenseM of Matrix
 */
return function(Matrix) {

   // Subclass of `Matrix` representing 'dense' matrices.
   function DenseM(arr, options) {
      if (arr.length === 0) { throw new Error('Cannot create empty matrix yet.'); }
      if (typeof options === 'boolean') { options = { byRow: options }; }
      if (options == null) { options = {}; }
      this.byRow = options.byRow === true;
      if (Array.isArray(arr[0])) {
         setFromDoubleArray(this, arr, options.byRow);
      } else {
         setFromSingleArray(this, arr, options);
      }
      if (this.ncol * this.nrow !== this.values.length) {
         throw new Error('Declared matrix dimensions invalid');
      }
      return this;

      function setFromDoubleArray(obj, arr, byRow) {
         obj.values = new Matrix.Vector([].concat.apply([], arr));
         if (byRow) {
            obj.nrow = arr.length; obj.ncol = arr[0].length;
         } else {
            obj.nrow = arr[0].length; obj.ncol = arr.length;
         }
      }
      function setFromSingleArray(obj, arr, options) {
         obj.values = new Matrix.Vector(arr);
         if (options.nrow == null) {
            obj.ncol = options.ncol;
            obj.nrow = Math.floor(arr.length / options.ncol);
         } else if (options.ncol == null) {
            obj.nrow = options.nrow;
            obj.ncol = Math.floor(arr.length / options.nrow);
         }
      }
   }

   DenseM.prototype = Object.create(Matrix.prototype);

   return DenseM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
