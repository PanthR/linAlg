(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass DenseM of Matrix
 */
return function(Matrix) {

   // Subclass of `Matrix` representing 'dense' matrices.
   function DenseM(arr, options) {
      if (arr.length === 0) { return new Error('Cannot create empty matrix yet.'); }
      // Storage defaults to 'by column'
      this.byRow = options && options.byRow === true;
      if (Array.isArray(arr[0])) {
         if (this.byRow) {
            this.nrow = arr.length;
            this.ncol = arr[0].length;
         } else {
            this.nrow = arr[0].length;
            this.ncol = arr.length;
         }
         this.values = new Matrix.Vector([].concat.apply([], arr));
         // TODO: Should we do more validation here?
      } else {
         if (options && options.nrow !== 0) {
            this.nrow = options.nrow;
            this.ncol = Math.floor(arr.length / this.nrow);
         } else {
            this.ncol = options.ncol;
            this.nrow = Math.floor(arr.length / this.ncol);
         }
         if (this.ncol * this.nrow !== arr.length) {
            return new Error('Declared matrix dimensions invalid');
         }
         this.values = new Matrix.Vector(arr);
      }
      this.constructor = DenseM;
   }

   DenseM.prototype = Object.create(Matrix.prototype);

   return DenseM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
