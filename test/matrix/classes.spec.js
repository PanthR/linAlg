var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

function random(i) { return Math.floor(Math.random() * i + 1); }

describe('Matrix classes', function() {
   var A = [];
   A[1] = new Matrix([4, 6, 7, 2, 1, 3, 5, 7.53, 9.95], { nrow : 3 });
   A[2] = new Matrix({ 2: { 3: 8, 1: 2}, 1: { 1: 5 }}, { nrow : 3, ncol: 3 });
   A[3] = new Matrix(function(i, j) { return i * j; }, { nrow: 3, ncol: 3 });
   A[4] = Matrix.diag([4, 3.3, 5.1]);
   A[5] = Matrix.const(5.8, 3);
   A[6] = new Matrix.StructuredM.LowerTriM(A[1]);
   A[7] = new Matrix.StructuredM.UpperTriM(A[1]);
   A[8] = new Matrix.StructuredM.SymmetricM(A[1]);
   it('isA is true for the subclasses in m.classes', function() {
      for(var i = 1; i < A.length; i += 1) {
         A[i].classes.forEach(function(cl) {
            expect(A[i].isA(cl)).to.be.true;
            expect(cl).to.exist;
         });
      }
   });
   it('commonConstr of m with itself should be m.classes[0]', function() {
      for(var i = 1; i < A.length; i += 1) {
         expect(Matrix.commonConstr(A[i], A[i])).to.equal(A[i].classes[0]);
      }
   });
   it('commonConstr returns correct classes', function() {
      // lower trim with lower, diag -- etc...
      expect(Matrix.commonConstr(A[6], A[6]) === Matrix.StructuredM.LowerTriM).to.be.ok;
      expect(Matrix.commonConstr(A[4], A[6]) === Matrix.StructuredM.LowerTriM).to.be.ok;
      expect(Matrix.commonConstr(A[5], A[6]) === Matrix.StructuredM.LowerTriM).to.be.ok;
      expect(Matrix.commonConstr(A[6], A[5]) === Matrix.StructuredM.LowerTriM).to.be.ok;
      expect(Matrix.commonConstr(A[4], A[4]) === Matrix.StructuredM.DiagM).to.be.ok;
      expect(Matrix.commonConstr(A[4], A[5]) === Matrix.StructuredM.DiagM).to.be.ok;
      expect(Matrix.commonConstr(A[5], A[4]) === Matrix.StructuredM.DiagM).to.be.ok;
      expect(Matrix.commonConstr(A[5], A[5]) === Matrix.StructuredM.CDiagM).to.be.ok;
      expect(Matrix.commonConstr(A[4], A[8]) === Matrix.StructuredM.SymmetricM).to.be.ok;
      expect(Matrix.commonConstr(A[5], A[8]) === Matrix.StructuredM.SymmetricM).to.be.ok;
      expect(Matrix.commonConstr(A[8], A[8]) === Matrix.StructuredM.SymmetricM).to.be.ok;
      expect(Matrix.commonConstr(A[2], A[2]) === Matrix.DenseM.SparseM).to.be.ok;
   });
});