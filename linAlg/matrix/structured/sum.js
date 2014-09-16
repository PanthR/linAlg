(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {
   // return A + kB
   function SumM(A, B, k) {
      if (k == null) { k = 1; }
      Matrix.ensureSameDims(A, B);
      return computeSum(A, B, k);
   }

   SumM.prototype = Object.create(StructuredM.prototype);

   function computeSum(A, B, k) {
      // if both sparse, return a sparse (via SparseM.add??)
      if (A.isA(Matrix.SparseM) && B.isA(Matrix.SparseM)) {
         return Matrix.SparseM.add(A, B, k);
      }
      // if both cdiag, return a cdiag
      if (A.isA(Matrix.CDiagM) && B.isA(Matrix.CDiagM)) {
         return Matrix.CDiagM.add(A, B, k);
      }
      // in every other case, use commonConstr (give constructor a function)
      return new (Matrix.commonConstr(A, B))(function(i, j) {
         return A.get(i, j) + k * B.get(i, j);
      }, A);
   }

   return SumM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
