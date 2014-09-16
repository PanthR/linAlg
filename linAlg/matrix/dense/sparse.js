(function(define) {'use strict';
define(function(require) {

/* Returns a function which takes the Matrix constructor and
 * creates the subclass SparseM of Matrix
 */
return function(Matrix, DenseM) {

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

   SparseM.prototype = Object.create(DenseM.prototype);

   // A, B are matrices (any subclass) of the same dimensions
   // returns the A + kB as a Sparse matrix
   SparseM.add = function add(A, B, k) {
      var res;
      res = {};
      function addValue(val, i, j) {
         if (val === 0) { return; }
         if (res[i] == null) { res[i] = {}; }
         res[i][j] = (res[i][j] || 0) + val;
      }
      A.forEach(addValue);
      B.forEach(function(val, i, j) {
         addValue(k * val, i, j);
      });
      return new SparseM(res, A);
   };

   SparseM.prototype.classes = [SparseM, Matrix];

   SparseM.prototype.map = function map(f) {
      var newValues = {};
      this.each(function(val, i, j) {
         newValues[i] = newValues[i] || {};
         newValues[i][j] = f(val, i, j);
      }, true);
      return new Matrix(newValues, { nrow: this.nrow, ncol: this.ncol });
   };

   SparseM.prototype.transpose = function transpose() {
      var newValues = {};
      this.each(function(val, i, j) {
         newValues[j] = newValues[j] || {};
         newValues[j][i] = val;
      }, true);
      return new Matrix(newValues, { nrow: this.ncol, ncol: this.nrow });
   };

   return SparseM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
