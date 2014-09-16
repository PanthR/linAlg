var Matrix = require('../../linAlg/matrix');
var chai = require('chai');
var expect = chai.expect;

describe('Matrix transpose', function() {
   var A1 = new Matrix.DenseM([4, 6, 7, 2, 1, 3], { ncol : 2 });
   var A2 = new Matrix.DenseM([[4, 6, 7], [2, 1, 3]]);
   var A3 = new Matrix.DenseM([[4, 6, 7], [2, 1, 3]], { byRow : true });
   var A4 = new Matrix.SparseM({ 2: { 3: 23, 4: 2}, 4: { 1: 2 }}, { nrow : 4, ncol: 6 });
   var A5 = new Matrix.DiagM([4, 2, 5, 6]);
   var a  = new Matrix(Math.random, { nrow: 4, ncol: 5});
   var A6 = new Matrix.LowerTriM(a);
   var A7 = new Matrix.UpperTriM(a);
   var A8 = new Matrix.SymmetricM(function(i, j) { return i * j; }, 5);
   var matrices = [A1, A2, A3, A4, A5, A6, A7, A8];
   it('exists', function() {
      expect(Matrix).to.respondTo('transpose');
      matrices.forEach(function(m) {
         expect(function() { m.transpose(); }).to.not.throw(Error);
         expect(m.transpose()).to.be.instanceof(Matrix);
      });
   });
   it('has correct dimensions', function() {
      matrices.forEach(function(m) {
         expect(m.transpose().nrow).to.be.equal(m.ncol);
         expect(m.transpose().ncol).to.be.equal(m.nrow);
      });
   });
   it('returns the transposed values', function() {
      matrices.forEach(function(m) {
         var m2 = m.transpose();
         for (var i = 1; i <= m.nrow; i += 1) {
            for (var j = 1; j <= m.ncol; j += 1) {
               expect(m2.get(j, i)).to.be.equal(m.get(i, j));
            }
         }
      });
   });
   it('"preserves" appropriate structure', function() {
      expect(A4.transpose()).to.be.instanceof(Matrix.SparseM);
      expect(A5.transpose()).to.be.instanceof(Matrix.DiagM);
      expect(A6.transpose()).to.be.instanceof(Matrix.UpperTriM);
      expect(A7.transpose()).to.be.instanceof(Matrix.LowerTriM);
      expect(A8.transpose()).to.be.instanceof(Matrix.SymmetricM);
   });
});