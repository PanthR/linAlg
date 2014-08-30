(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass SparseM of Matrix
 */
return function(Matrix) {

   // Subclass of `Matrix` representing "Sparse" matrices.
   // Sparse matrices are "by row". TODO: Think about it.
   function SparseM(arr, options) {
      var values = {}, i, j;
      this.byRow = true;
      this.nrow = options && options.nrow;
      this.ncol = options && options.ncol;
      for (i in arr) {
         if (arr.hasOwnProperty(i) && !isNaN(parseInt(i))) {
            for (j in arr[i]) {
               if (arr[i].hasOwnProperty(j) && !isNaN(parseInt(j))) {
                  values[this.toIndex(parseInt(i), parseInt(j))] = arr[i][j];
               }
            }
         }
      }
      this.values = new Matrix.Vector(values, this.nrow * this.ncol);
   }

   SparseM.prototype = Object.create(Matrix.prototype);

   return SparseM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
