(function(define) {'use strict';
define(function(require) {

return function(Matrix, StructuredM) {
   // return A * B
   function ProdM(A, B) {
      if (!Matrix.compatibleDims(A, B)) {
         throw new Error('Cannot multiply matrices/vectors with incompatible dimensions.');
      }
      return computeProd(A, B);
   }

   ProdM.prototype = Object.create(StructuredM.prototype);

   /* eslint-disable complexity */
   function computeProd(A, B) {
      var Constr, rowsA, colsB;
      // A or B Vector
      if (A instanceof Matrix.Vector) { return B.lvMult(A); }
      if (B instanceof Matrix.Vector) { return A.rvMult(B); }
      // A, B both Matrices
      // if both sparse, return a sparse
      if (A.isA(Matrix.PermM)) { return A.rMult(B); }
      if (B.isA(Matrix.PermM)) { return B.lMult(A); }
      if (A.isA(Matrix.SparseM) && B.isA(Matrix.SparseM)) {
         return Matrix.SparseM.mult(A, B);
      }
      // if both cdiag, return a cdiag
      if (A.isA(Matrix.CDiagM)) { return B.sMult(A.val); }
      if (B.isA(Matrix.CDiagM)) { return A.sMult(B.val); }
      if (A.isA(Matrix.DiagM) || A.isA(Matrix.OuterM)) { return A.rMult(B); }
      if (B.isA(Matrix.DiagM) || B.isA(Matrix.OuterM)) { return B.lMult(A); }
      if (A.isA(Matrix.UpperTriM) && B.isA(Matrix.LowerTriM)) {
         return Matrix.diag(function(i) {
            return A.rowView(i).dot(B.colView(i));
         }, A);
      }
      // in every other case, use commonConstr (give constructor a function)
      // TODO: Optimize this later
      Constr = Matrix.commonConstr(A, B);
      if (Constr === Matrix.SymmetricM) { Constr = Matrix; }
      rowsA = A.rows();
      colsB = B.cols();
      return new Constr(function(i, j) {
         return rowsA[i - 1].dot(colsB[j - 1]);
      }, { nrow: A.nrow, ncol: B.ncol });
   }
   /* eslint-enable */

   return ProdM;
};

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
